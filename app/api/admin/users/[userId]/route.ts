import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/nextjs/server";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// Add your admin email(s) here
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId: adminId } = await auth();
        const admin = await currentUser();

        if (!adminId || !admin) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if user is admin
        const adminEmail = admin.emailAddresses[0]?.emailAddress;
        if (!ADMIN_EMAILS.includes(adminEmail || "")) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const { userId } = await params;
        const body = await req.json();
        const { isPro, hasPurchasedTemplates } = body;

        // Update user metadata
        await clerk.users.updateUserMetadata(userId, {
            publicMetadata: {
                isPro: isPro ?? false,
                hasPurchasedTemplates: hasPurchasedTemplates ?? false,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_USER_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
