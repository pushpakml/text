import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";

export async function PUT(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const body = await request.json();

        const gallery = await Gallery.findByIdAndUpdate(
            id,
            body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!gallery) {
            return Response.json(
                {
                    success: false,
                    message: "Gallery image not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json({
            success: true,
            gallery,
        });

    } catch (error) {
        console.error("GALLERY PUT ERROR:", error);

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

export async function DELETE(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const gallery = await Gallery.findByIdAndDelete(id);

        if (!gallery) {
            return Response.json(
                {
                    success: false,
                    message: "Gallery image not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json({
            success: true,
            message: "Gallery image deleted",
        });

    } catch (error) {
        console.error("GALLERY DELETE ERROR:", error);

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