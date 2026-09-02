import dbConnect from "@/lib/db";
import Teacher from "@/models/Teacher";
import { getCloudinary } from "@/lib/cloudinary";

export async function GET() {
    try {
        await dbConnect();

        const teachers = await Teacher.find().sort({
            createdAt: -1,
        });

        return Response.json({
            success: true,
            teachers,
        });
    } catch (error) {
        console.error(error);

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

        const name = formData.get("name");
        const subject = formData.get("subject");
        const experience = formData.get("experience");
        const image = formData.get("image");

        if (!name || !subject || !experience) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Name, subject and experience are required",
                },
                { status: 400 }
            );
        }

        let imagePath = "";

        if (
            image &&
            image instanceof File &&
            image.size > 0
        ) {
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
            ];

            if (!allowedTypes.includes(image.type)) {
                return Response.json(
                    {
                        success: false,
                        message:
                            "Only JPG, PNG and WEBP images are allowed",
                    },
                    { status: 400 }
                );
            }

            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const cloudinary = getCloudinary();

            const uploadResult = await new Promise(
                (resolve, reject) => {
                    const uploadStream =
                        cloudinary.uploader.upload_stream(
                            {
                                folder: "texas-academy/teachers",
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
                }
            );

            imagePath = uploadResult.secure_url;
        }

        const teacher = await Teacher.create({
            name: name.trim(),
            subject: subject.trim(),
            experience: experience.trim(),
            image: imagePath,
        });

        return Response.json(
            {
                success: true,
                message:
                    "Teacher created successfully",
                teacher,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}
