import dbConnect from "@/lib/db";
import Facility from "@/models/Facilities";

export async function GET() {
    try {
        await dbConnect();

        const facility = await Facility.find({});

        return Response.json({
            success: true,
            facility,
        });

    } catch (error) {
        console.error("GET FACILITIES ERROR:", error);

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

        const body = await request.json();

        const newFacility = await Facility.create(body);

        return Response.json({
            success: true,
            facility: newFacility,
        });

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}