import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
        await dbConnect();

        const gallery = await Gallery.find({}).sort({
            createdAt: -1,
        });

        return Response.json({
            success: true,
            gallery,
        });

    } catch (error) {
        console.error("GALLERY GET ERROR:", error);

        return Response.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await dbConnect();

        const formData = await request.formData();

        const file = formData.get("image");
        const title = formData.get("title") || "";
        const description = formData.get("description") || "";

        if (!file) {
            return Response.json(
                {
                    success: false,
                    message: "Image is required",
                },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult =
            await new Promise((resolve, reject) => {

                const uploadStream =
                    cloudinary.v2.uploader.upload_stream(
                        {
                            folder: "texas-academy/gallery",
                            resource_type: "image",
                        },
                        (error, result) => {

                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }

                        }
                    );

                uploadStream.end(buffer);
            });

        const gallery = await Gallery.create({
            image: uploadResult.secure_url,
            title,
            description,
        });

        return Response.json(
            {
                success: true,
                gallery,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("GALLERY POST ERROR:", error);

        return Response.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}
