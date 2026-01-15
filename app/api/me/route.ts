import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Identify premium users by metadata or specific email
        // For now, we'll auto-grant premium to anyone for testing purposes
        // In a real app, check stripe subscription status here
        const isPro = user.publicMetadata.isPro === true;
        const hasPurchasedTemplates = user.publicMetadata.hasPurchasedTemplates === true;

        return NextResponse.json({
            isPro,
            hasPurchasedTemplates,
        });
    } catch (error) {
        console.error("[ME_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
