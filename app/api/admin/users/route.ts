import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/nextjs/server";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// Add your admin email(s) here
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());

export async function GET() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if user is admin
        const userEmail = user.emailAddresses[0]?.emailAddress;
        if (!ADMIN_EMAILS.includes(userEmail || "")) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Fetch all users from Clerk
        const users = await clerk.users.getUserList({ limit: 100 });

        const usersData = users.data.map((u) => ({
            id: u.id,
            email: u.emailAddresses[0]?.emailAddress || "No email",
            firstName: u.firstName,
            lastName: u.lastName,
            createdAt: u.createdAt,
            isPro: u.publicMetadata?.isPro === true,
            hasPurchasedTemplates: u.publicMetadata?.hasPurchasedTemplates === true,
            stripeSubscriptionId: u.publicMetadata?.stripeSubscriptionId || null,
        }));

        return NextResponse.json({ users: usersData });
    } catch (error) {
        console.error("[ADMIN_USERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
