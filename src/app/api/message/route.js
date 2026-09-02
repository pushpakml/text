import dbConnect from "@/lib/db";
import Message from "@/models/Message";

export async function GET() {
  try {
    await dbConnect();

    const messages = await Message.find({}).sort({
      createdAt: 1,
    });

    return Response.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("MESSAGE GET ERROR:", error);

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

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    if (!body.type || !body.title || !body.description || !body.name) {
      return Response.json(
        {
          success: false,
          message:
            "Type, title, description and name are required",
        },
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      type: body.type.trim(),
      title: body.title.trim(),
      description: body.description.trim(),
      name: body.name.trim(),
      image: body.image || "",
    });

    return Response.json(
      {
        success: true,
        message: "Message created successfully",
        messages: newMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MESSAGE POST ERROR:", error);

    if (error.code === 11000) {
      return Response.json(
        {
          success: false,
          message:
            "A message with this type already exists. Edit it instead.",
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
