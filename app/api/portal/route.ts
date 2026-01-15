import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) {
            return new NextResponse("Email not found", { status: 400 });
        }

        // Find the customer by email
        const customers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        let customerId: string;
        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
        } else {
            // If no customer exists, create one
            const newCustomer = await stripe.customers.create({
                email: email,
                metadata: {
                    userId: userId,
                },
            });
            customerId = newCustomer.id;
        }

        // Create billing portal session
        const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: origin,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[PORTAL_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
