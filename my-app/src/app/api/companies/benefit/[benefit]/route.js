import clientPromise from "../../../mongodb/mongoClient";

export async function GET(req, { params }) {
  try {
    const { benefit } = params;

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    // Match benefit (case-insensitive, substring allowed)
    const docs = await coll
      .find({
        benefits: { $regex: new RegExp(benefit, "i") }
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
    console.error("❌ Error in GET /api/companies/benefit/[benefit]:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
