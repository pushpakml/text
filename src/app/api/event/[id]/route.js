import dbConnect from "@/lib/db";
import Event from "@/models/Event";

// ========================================
// GET SINGLE EVENT
// ========================================

export async function GET(
    _request,
    { params }
) {
    try {
        await dbConnect();

        const { id } = await params;

        const event =
            await Event.findById(id);

        if (!event) {
            return Response.json(
                {
                    success: false,
                    message: "Event not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json({
            success: true,
            event,
        });
    } catch (error) {
        console.error(
            "GET EVENT ERROR:",
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
// UPDATE EVENT
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

        const updatedEvent =
            await Event.findByIdAndUpdate(
                id,
                {
                    title: title.trim(),
                    description:
                        description.trim(),
                    date,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedEvent) {
            return Response.json(
                {
                    success: false,
                    message: "Event not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json({
            success: true,
            message:
                "Event updated successfully",
            event: updatedEvent,
        });
    } catch (error) {
        console.error(
            "PUT EVENT ERROR:",
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
// DELETE EVENT
// ========================================

export async function DELETE(
    _request,
    { params }
) {
    try {
        await dbConnect();

        const { id } = await params;

        const deletedEvent =
            await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return Response.json(
                {
                    success: false,
                    message: "Event not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json({
            success: true,
            message:
                "Event deleted successfully",
            event: deletedEvent,
        });
    } catch (error) {
        console.error(
            "DELETE EVENT ERROR:",
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