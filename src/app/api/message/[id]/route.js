import dbConnect from "@/lib/db";
import Message from "@/models/Message";

export async function PUT(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const body = await request.json();

        const updatedMessage =
            await Message.findByIdAndUpdate(
                id,
                {
                    title: body.title,
                    description: body.description,
                    name: body.name,
                    image: body.image,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedMessage) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json({
            success: true,
            message: updatedMessage,
        });
    } catch (error) {
        console.error("MESSAGE UPDATE ERROR:", error);

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

export async function DELETE(_request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const deletedMessage =
            await Message.findByIdAndDelete(id);

        if (!deletedMessage) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully",
        });
    } catch (error) {
        console.error("MESSAGE DELETE ERROR:", error);

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