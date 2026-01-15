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

        // Define success and cancel URLs
        // Assuming the app is running on the origin of the request or localhost:3000
        // A robust way to get the base URL
        const origin = req.headers.get("origin") || "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Pro Membership",
                            description: "AI Features & Unlimited Access",
                        },
                        unit_amount: 1999, // $19.99
                    },
                    quantity: 1,
                },
            ],
            mode: "payment", // "subscription" if recurring
            success_url: `${origin}?success=true`,
            cancel_url: `${origin}?canceled=true`,
            client_reference_id: userId,
            customer_email: user.emailAddresses[0]?.emailAddress,
            metadata: {
                userId: userId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[CHECKOUT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
