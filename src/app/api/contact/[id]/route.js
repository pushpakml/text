import dbConnect from "@/lib/db";
import Contact from "@/models/Contact";

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const body = await request.json().catch(() => ({}));

    const updated = await Contact.findByIdAndUpdate(
      id,
      { isRead: body.isRead !== undefined ? body.isRead : true },
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      contact: updated,
    });
  } catch (error) {
    console.error("CONTACT UPDATE ERROR:", error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("CONTACT DELETE ERROR:", error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
