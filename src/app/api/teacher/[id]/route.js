import dbConnect from "@/lib/db";
import Teacher from "@/models/Teacher";
import fs from "fs/promises";
import path from "path";


// ========================================
// GET SINGLE TEACHER
// ========================================

export async function GET(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const teacher =
            await Teacher.findById(id);

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


// ========================================
// UPDATE TEACHER
// ========================================

export async function PUT(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const teacher =
            await Teacher.findById(id);

        if (!teacher) {
            return Response.json(
                {
                    success: false,
                    message: "Teacher not found",
                },
                { status: 404 }
            );
        }

        const formData =
            await request.formData();

        const name =
            formData.get("name");

        const subject =
            formData.get("subject");

        const experience =
            formData.get("experience");

        const image =
            formData.get("image");

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

        let imagePath =
            teacher.image || "";

        // ========================================
        // NEW IMAGE
        // ========================================

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

            const uploadDir =
                path.join(
                    process.cwd(),
                    "public",
                    "uploads",
                    "teachers"
                );

            await fs.mkdir(
                uploadDir,
                {
                    recursive: true,
                }
            );

            const extension =
                path.extname(
                    image.name
                ).toLowerCase();

            const fileName =
                `${Date.now()}-${Math.round(
                    Math.random() * 1e9
                )}${extension}`;

            const filePath =
                path.join(
                    uploadDir,
                    fileName
                );

            const bytes =
                await image.arrayBuffer();

            const buffer =
                Buffer.from(bytes);

            await fs.writeFile(
                filePath,
                buffer
            );

            imagePath =
                `/uploads/teachers/${fileName}`;


            // ========================================
            // DELETE OLD IMAGE
            // ========================================

            if (teacher.image) {
                try {
                    const oldImagePath =
                        path.join(
                            process.cwd(),
                            "public",
                            teacher.image
                        );

                    await fs.unlink(
                        oldImagePath
                    );
                } catch (error) {
                    console.log(
                        "Old image not found"
                    );
                }
            }
        }

        // ========================================
        // UPDATE DATABASE
        // ========================================

        teacher.name =
            name.trim();

        teacher.subject =
            subject.trim();

        teacher.experience =
            experience.trim();

        teacher.image =
            imagePath;

        await teacher.save();

        return Response.json({
            success: true,
            message:
                "Teacher updated successfully",
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


// ========================================
// DELETE TEACHER
// ========================================

export async function DELETE(
    request,
    { params }
) {
    try {
        await dbConnect();

        const { id } = await params;

        const teacher =
            await Teacher.findById(id);

        if (!teacher) {
            return Response.json(
                {
                    success: false,
                    message: "Teacher not found",
                },
                { status: 404 }
            );
        }

        // ========================================
        // DELETE IMAGE
        // ========================================

        if (teacher.image) {
            try {
                const imagePath =
                    path.join(
                        process.cwd(),
                        "public",
                        teacher.image
                    );

                await fs.unlink(
                    imagePath
                );
            } catch (error) {
                console.log(
                    "Image file not found"
                );
            }
        }

        await Teacher.findByIdAndDelete(
            id
        );

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