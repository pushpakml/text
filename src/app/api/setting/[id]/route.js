import dbConnect from "@/lib/db";
import Setting from "@/models/Setting";



export async function GET(_request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const setting = await Setting.findById(id);
        return Response.json({ success: true, setting });
    } catch (error) {
        return Response.json(
            { success: false, error: error.setting },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    await dbConnect();
    let { id } = await params;
    const updatedSetting = await Setting.findByIdAndUpdate(id, await request.json(), { new: true });
    return Response.json({ updatedSetting });
}

export async function DELETE(request, { params }) {
    await dbConnect();
    let { id } = await params;
    const deleteSetting = await Setting.findByIdAndDelete(id);
    return Response.json({ deleteSetting });
}