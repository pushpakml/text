import dbConnect from "@/lib/db";
import Setting from "@/models/Setting";



export async function GET() {
    await dbConnect();
    const setting = await Setting.find({});
    return Response.json({ setting });
}
export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newSetting = await Setting.create(body);
        return Response.json(
            {
                success: true,
                setting: newSetting,
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