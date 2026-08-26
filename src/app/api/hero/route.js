import dbConnect from "@/lib/db";
import Hero from "@/models/Hero";

// ========================================
// GET ALL HEROES
// ========================================

export async function GET() {
    try {
        await dbConnect();

        const heroes = await Hero.find({})
            .sort({ createdAt: -1 });

        return Response.json({
            success: true,
            hero: heroes,
        });
    } catch (error) {
        console.error("GET HERO ERROR:", error);

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
// CREATE HERO
// ========================================

export async function POST(request) {
    try {
        await dbConnect();

        const body =
            await request.json();

        const {
            title,
            description,
        } = body;

        // Validation
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

        const newHero =
            await Hero.create({
                title: title.trim(),
                description:
                    description.trim(),
            });

        return Response.json(
            {
                success: true,
                message:
                    "Hero created successfully",
                hero: newHero,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("POST HERO ERROR:", error);

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