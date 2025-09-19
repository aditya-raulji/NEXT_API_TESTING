import clientPromise from "../../../mongodb/mongoClient";

export async function GET(req, { params }) {
  try {
    const { skill } = params;

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    // Match companies where hiringCriteria.skills includes the skill (case-insensitive)
    const docs = await coll
      .find({
        "hiringCriteria.skills": { $regex: new RegExp(`^${skill}$`, "i") },
      })
      .toArray();

    const cleanDocs = docs.map((d) => ({
      ...d,
      _id: d._id.toString(),
    }));

    return new Response(JSON.stringify(cleanDocs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error in GET /api/companies/by-skill/[skill]:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
