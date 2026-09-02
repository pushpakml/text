import dbConnect from "@/lib/db";
import About from "@/models/About";
import { fileToDataUrl } from "@/lib/imageToDataUrl";

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

        const contentType = request.headers.get("content-type") || "";
        let update = {};

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();

            for (const field of ["title", "description", "description1"]) {
                const value = formData.get(field);
                if (value !== null) update[field] = String(value).trim();
            }

            const file = formData.get("image");
            const result = await fileToDataUrl(file);

            if (result.error) {
                return Response.json(
                    { success: false, message: result.error },
                    { status: 400 }
                );
            }

            if (result.dataUrl) {
                update.image = result.dataUrl;
            }
        } else {
            const body = await request.json();

            for (const field of ["title", "description", "description1", "image"]) {
                if (body[field] !== undefined && body[field] !== null) {
                    update[field] =
                        typeof body[field] === "string"
                            ? body[field].trim()
                            : body[field];
                }
            }
        }

        if (Object.keys(update).length === 0) {
            return Response.json(
                { success: false, message: "No fields provided" },
                { status: 400 }
            );
        }

        const updatedAbout = await About.findByIdAndUpdate(
            id,
            update,
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
