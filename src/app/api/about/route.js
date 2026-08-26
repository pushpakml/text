import dbConnect from "@/lib/db";
import About from "@/models/About";



export async function GET() {
    await dbConnect();
    const about = await About.find({});
    return Response.json({ about });
}
export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newAbout = await About.create(body);
        return Response.json(
            {
                success: true,
                about: newAbout,
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: error.message,
            }
        );
    }
}