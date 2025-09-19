import clientPromise from "../../../mongodb/mongoClient";

export async function GET(req, { params }) {
  try {
    const { location } = params;

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    // Case-insensitive match for location
    const docs = await coll
      .find({
        location: { $regex: new RegExp(`^${location}$`, "i") },
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
    console.error("❌ Error in GET /api/companies/by-location/[location]:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
