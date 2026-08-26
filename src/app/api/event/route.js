import dbConnect from "@/lib/db";
import Event from "@/models/Event";

// ========================================
// GET ALL EVENTS
// ========================================

export async function GET() {
    try {
        await dbConnect();

        const events = await Event.find({})
            .sort({ createdAt: -1 });

        return Response.json({
            success: true,
            events,
        });
    } catch (error) {
        console.error("GET EVENTS ERROR:", error);

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
// CREATE EVENT
// ========================================

export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();

        const {
            title,
            description,
            date,
        } = body;

        if (!title || !description || !date) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Title, description and date are required",
                },
                {
                    status: 400,
                }
            );
        }

        const newEvent = await Event.create({
            title: title.trim(),
            description: description.trim(),
            date,
        });

        return Response.json(
            {
                success: true,
                message:
                    "Event created successfully",
                event: newEvent,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("POST EVENT ERROR:", error);

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