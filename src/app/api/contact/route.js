import dbConnect from "@/lib/db";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await dbConnect();

    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    return Response.json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("CONTACT GET ERROR:", error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: "Name, email and message are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const contact = await Contact.create({
      name: String(name).trim(),
      phone: phone ? String(phone).trim() : "",
      email: String(email).trim(),
      message: String(message).trim(),
    });

    return Response.json({
      success: true,
      message: "Message sent successfully",
      id: contact._id,
    });
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    return Response.json(
      { success: false, message: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
