import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        if (!session?.metadata?.userId) {
            return new NextResponse("User id is required", { status: 400 });
        }

        const plan = session.metadata.plan;

        if (plan === "templates") {
            // One-time purchase - only enable templates/watermark removal
            await clerk.users.updateUserMetadata(session.metadata.userId, {
                publicMetadata: {
                    hasPurchasedTemplates: true,
                },
            });
        } else if (plan === "pro") {
            // Subscription - enable Pro features + watermark removal (included in Pro)
            await clerk.users.updateUserMetadata(session.metadata.userId, {
                publicMetadata: {
                    isPro: true,
                    hasPurchasedTemplates: true,
                    stripeSubscriptionId: session.subscription,
                },
            });
        } else {
            // Legacy fallback - enable both
            await clerk.users.updateUserMetadata(session.metadata.userId, {
                publicMetadata: {
                    isPro: true,
                    hasPurchasedTemplates: true,
                },
            });
        }
    }

    // Handle subscription cancellation
    if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
            await clerk.users.updateUserMetadata(userId, {
                publicMetadata: {
                    isPro: false,
                    stripeSubscriptionId: null,
                },
            });
        }
    }

    return new NextResponse(null, { status: 200 });
}
