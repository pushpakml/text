import dbConnect from "@/lib/db";
import Message from "@/models/Message";

export async function GET() {
    try {
        await dbConnect();

        const messages = await Message.find({}).sort({
            createdAt: 1,
        });

        return Response.json({
            success: true,
            messages,
        });
    } catch (error) {
        console.error("MESSAGE GET ERROR:", error);

        return Response.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}