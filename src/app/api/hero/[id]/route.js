import dbConnect from "@/lib/db";
import Hero from "@/models/Hero";

const HERO_FIELDS = [
  "sub_title",
  "span",
  "span1",
  "span2",
  "span3",
  "description",
  "button1",
  "button2",
  "button3",
  "counternumber",
  "countertext",
  "counternumber1",
  "countertext1",
  "counternumber2",
  "countertext2",
];

function pickHeroFields(body) {
  const data = {};
  for (const field of HERO_FIELDS) {
    if (body[field] !== undefined && body[field] !== null) {
      data[field] =
        typeof body[field] === "string"
          ? body[field].trim()
          : body[field];
    }
  }
  return data;
}

export async function GET(_request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const hero = await Hero.findById(id);

    if (!hero) {
      return Response.json(
        {
          success: false,
          message: "Hero not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      hero,
    });
  } catch (error) {
    console.error("GET HERO ERROR:", error);

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

    const data = pickHeroFields(body);

    if (Object.keys(data).length === 0) {
      return Response.json(
        {
          success: false,
          message: "No valid fields provided",
        },
        { status: 400 }
      );
    }

    const updatedHero = await Hero.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedHero) {
      return Response.json(
        {
          success: false,
          message: "Hero not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Hero updated successfully",
      hero: updatedHero,
    });
  } catch (error) {
    console.error("PUT HERO ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const deletedHero = await Hero.findByIdAndDelete(id);

    if (!deletedHero) {
      return Response.json(
        {
          success: false,
          message: "Hero not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Hero deleted successfully",
      hero: deletedHero,
    });
  } catch (error) {
    console.error("DELETE HERO ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
