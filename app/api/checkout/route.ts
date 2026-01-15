import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { plan } = body; // "templates" for one-time, "pro" for subscription

        const origin = req.headers.get("origin") || "http://localhost:3000";

        let sessionConfig: Stripe.Checkout.SessionCreateParams;

        if (plan === "templates") {
            // One-time purchase for watermark removal
            sessionConfig = {
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: "Template Pack",
                                description: "Watermark Removal - One-time Purchase",
                            },
                            unit_amount: 999, // $9.99
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `${origin}?success=true&plan=templates`,
                cancel_url: `${origin}?canceled=true`,
                client_reference_id: userId,
                customer_email: user.emailAddresses[0]?.emailAddress,
                metadata: {
                    userId: userId,
                    plan: "templates",
                },
            };
        } else {
            // Monthly Pro subscription
            sessionConfig = {
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: "Pro Membership",
                                description: "AI Features & Unlimited Access - Monthly",
                            },
                            unit_amount: 999, // $9.99/month
                            recurring: {
                                interval: "month",
                            },
                        },
                        quantity: 1,
                    },
                ],
                mode: "subscription",
                success_url: `${origin}?success=true&plan=pro`,
                cancel_url: `${origin}?canceled=true`,
                client_reference_id: userId,
                customer_email: user.emailAddresses[0]?.emailAddress,
                metadata: {
                    userId: userId,
                    plan: "pro",
                },
            };
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[CHECKOUT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
