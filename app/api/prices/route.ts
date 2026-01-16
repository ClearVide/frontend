import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET() {
    try {
        const templatesPriceId = process.env.STRIPE_TEMPLATES_PRICE_ID;
        const proPriceId = process.env.STRIPE_PRO_PRICE_ID;

        if (!templatesPriceId || !proPriceId) {
            return NextResponse.json(
                { error: "Stripe configuration missing" },
                { status: 500 }
            );
        }

        const [templatesPrice, proPrice] = await Promise.all([
            stripe.prices.retrieve(templatesPriceId),
            stripe.prices.retrieve(proPriceId),
        ]);

        const formatPrice = (price: Stripe.Price) => {
            const amount = (price.unit_amount || 0) / 100;
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: price.currency,
            }).format(amount);
        };

        return NextResponse.json({
            templates: {
                amount: formatPrice(templatesPrice),
                id: templatesPrice.id,
            },
            pro: {
                amount: formatPrice(proPrice),
                id: proPrice.id,
            },
        });
    } catch (error) {
        console.error("[PRICES_GET]", error);
        return NextResponse.json(
            { error: "Failed to fetch prices" },
            { status: 500 }
        );
    }
}
