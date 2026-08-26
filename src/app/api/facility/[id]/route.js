import dbConnect from "@/lib/db";
import Facility from "@/models/Facilities";

export async function GET(_request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const facility = await Facility.findById(id);

        if (!facility) {
            return Response.json(
                {
                    success: false,
                    message: "Facility not found",
                },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            facility,
        });

    } catch (error) {
        console.error("GET FACILITY ERROR:", error);

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

        const body = await request.json();

        console.log("Updating facility:", id);
        console.log("Data:", body);

        const updatedFacility =
            await Facility.findByIdAndUpdate(
                id,
                body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedFacility) {
            return Response.json(
                {
                    success: false,
                    message: "Facility not found",
                },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            message: "Facility updated successfully",
            facility: updatedFacility,
        });

    } catch (error) {
        console.error("UPDATE FACILITY ERROR:", error);

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

        const deleteFacility =
            await Facility.findByIdAndDelete(id);

        if (!deleteFacility) {
            return Response.json(
                {
                    success: false,
                    message: "Facility not found",
                },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            message: "Facility deleted successfully",
            facility: deleteFacility,
        });

    } catch (error) {
        console.error("DELETE FACILITY ERROR:", error);

        return Response.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}