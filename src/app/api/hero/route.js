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

export async function GET() {
  try {
    await dbConnect();

    const heroes = await Hero.find({}).sort({ createdAt: -1 });

    return Response.json({
      success: true,
      hero: heroes,
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

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const data = pickHeroFields(body);

    if (Object.keys(data).length === 0) {
      return Response.json(
        {
          success: false,
          message: "At least one field is required",
        },
        { status: 400 }
      );
    }

    const newHero = await Hero.create(data);

    return Response.json(
      {
        success: true,
        message: "Hero created successfully",
        hero: newHero,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST HERO ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
