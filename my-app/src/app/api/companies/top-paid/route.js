import clientPromise from "../../mongodb/mongoClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let limit = parseInt(searchParams.get("limit")) || 5;

    // Enforce max cap of 50
    if (limit > 50) limit = 50;

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    // Sort by salaryBand.base descending
    const docs = await coll
      .find({})
      .sort({ "salaryBand.base": -1 })
      .limit(limit)
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
    console.error("❌ Error in GET /api/companies/top-paid:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
