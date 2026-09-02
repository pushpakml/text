import dbConnect from "@/lib/db";
import Teacher from "@/models/Teacher";
import { getCloudinary } from "@/lib/cloudinary";

export async function GET(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return Response.json(
                {
                    success: false,
                    message: "Teacher not found",
                },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            teacher,
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

export async function PUT(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return Response.json(
                {
                    success: false,
                    message: "Teacher not found",
                },
                { status: 404 }
            );
        }

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

        let imagePath = teacher.image || "";

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

            if (teacher.image) {
                try {
                    const parts = teacher.image.split("/");
                    const filenameWithExt =
                        parts[parts.length - 1];
                    const publicId = `texas-academy/teachers/${filenameWithExt.split(".")[0]}`;
                    await cloudinary.uploader.destroy(
                        publicId
                    );
                } catch {
                    console.log("Old image not found on Cloudinary");
                }
            }
        }

        teacher.name = name.trim();
        teacher.subject = subject.trim();
        teacher.experience = experience.trim();
        teacher.image = imagePath;

        await teacher.save();

        return Response.json({
            success: true,
            message: "Teacher updated successfully",
            teacher,
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

export async function DELETE(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return Response.json(
                {
                    success: false,
                    message: "Teacher not found",
                },
                { status: 404 }
            );
        }

        if (teacher.image) {
            try {
                const parts = teacher.image.split("/");
                const filenameWithExt =
                    parts[parts.length - 1];
                const publicId = `texas-academy/teachers/${filenameWithExt.split(".")[0]}`;
                await cloudinary.uploader.destroy(
                    publicId
                );
            } catch {
                console.log("Image file not found on Cloudinary");
            }
        }

        await Teacher.findByIdAndDelete(id);

        return Response.json({
            success: true,
            message:
                "Teacher deleted successfully",
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
