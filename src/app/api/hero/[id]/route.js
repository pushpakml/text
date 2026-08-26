import dbConnect from "@/lib/db";
import Hero from "@/models/Hero";

// ========================================
// GET SINGLE HERO
// ========================================

export async function GET(_request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const hero =
            await Hero.findById(id);

        if (!hero) {
            return Response.json(
                {
                    success: false,
                    message: "Hero not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json({
            success: true,
            hero,
        });
    } catch (error) {
        console.error(
            "GET HERO ERROR:",
            error
        );

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


// ========================================
// UPDATE HERO
// ========================================

export async function PUT(
    request,
    { params }
) {
    try {
        await dbConnect();

        const { id } = await params;

        const body =
            await request.json();

        const {
            title,
            description,
        } = body;

        if (!title || !description) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Title and description are required",
                },
                {
                    status: 400,
                }
            );
        }

        const updatedHero =
            await Hero.findByIdAndUpdate(
                id,
                {
                    title: title.trim(),
                    description:
                        description.trim(),
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedHero) {
            return Response.json(
                {
                    success: false,
                    message: "Hero not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json({
            success: true,
            message:
                "Hero updated successfully",
            hero: updatedHero,
        });
    } catch (error) {
        console.error(
            "PUT HERO ERROR:",
            error
        );

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


// ========================================
// DELETE HERO
// ========================================

export async function DELETE(
    _request,
    { params }
) {
    try {
        await dbConnect();

        const { id } = await params;

        const deletedHero =
            await Hero.findByIdAndDelete(id);

        if (!deletedHero) {
            return Response.json(
                {
                    success: false,
                    message: "Hero not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json({
            success: true,
            message:
                "Hero deleted successfully",
            hero: deletedHero,
        });
    } catch (error) {
        console.error(
            "DELETE HERO ERROR:",
            error
        );

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