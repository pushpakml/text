import { auth, currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const clerkUser = await currentUser();

        if (!clerkUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        await dbConnect();

        const email =
            clerkUser.emailAddresses[0]?.emailAddress;

        const name =
            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""
                }`.trim();

        const user = await User.findOneAndUpdate(
            {
                clerkId: userId,
            },
            {
                clerkId: userId,
                name,
                email,
            },
            {
                new: true,
                upsert: true,
            }
        );

        return Response.json({
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}