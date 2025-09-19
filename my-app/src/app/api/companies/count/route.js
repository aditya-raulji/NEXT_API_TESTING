import clientPromise from "../../mongodb/mongoClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get("name");
    const location = searchParams.get("location");
    const skill = searchParams.get("skill");

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    // Build filter dynamically
    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" }; // case-insensitive search
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (skill) {
      filter["hiringCriteria.skills"] = { $regex: new RegExp(skill, "i") };
      // use regex for case-insensitive skill search
    }

    const total = await coll.countDocuments(filter);

    return new Response(JSON.stringify({ total }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error in GET /api/companies/count:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
