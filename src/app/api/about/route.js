import dbConnect from "@/lib/db";
import About from "@/models/About";
import { fileToDataUrl } from "@/lib/imageToDataUrl";

export async function GET() {
    await dbConnect();
    const about = await About.find({});
    return Response.json({ about });
}

export async function POST(request) {
    try {
        await dbConnect();

        const contentType = request.headers.get("content-type") || "";
        let body;

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();

            body = {};
            for (const field of ["title", "description", "description1"]) {
                const value = formData.get(field);
                if (value !== null) body[field] = String(value).trim();
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
                body.image = result.dataUrl;
            }
        } else {
            body = await request.json();
        }

        if (!body.title || !body.description) {
            return Response.json(
                {
                    success: false,
                    message: "Title and description are required",
                },
                { status: 400 }
            );
        }

        const newAbout = await About.create({
            title: body.title,
            description: body.description,
            description1: body.description1 || "",
            image: body.image || "",
        });

        return Response.json(
            {
                success: true,
                about: newAbout,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST ABOUT ERROR:", error);

        return Response.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}
