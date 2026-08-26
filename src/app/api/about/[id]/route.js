import dbConnect from "@/lib/db";
import About from "@/models/About";

export async function GET(_request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const about = await About.findById(id);

        if (!about) {
            return Response.json(
                {
                    success: false,
                    message: "About not found",
                },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            about,
        });

    } catch (error) {
        console.error("GET ABOUT ERROR:", error);

        return Response.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}


export async function PUT(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const body = await request.json();

        console.log("Updating About:", id);
        console.log("Data:", body);

        const updatedAbout = await About.findByIdAndUpdate(
            id,
            body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedAbout) {
            return Response.json(
                {
                    success: false,
                    message: "About not found",
                },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            message: "About updated successfully",
            about: updatedAbout,
        });

    } catch (error) {
        console.error("UPDATE ABOUT ERROR:", error);

        return Response.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}