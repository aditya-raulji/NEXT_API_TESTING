import clientPromise from "../../mongodb/mongoClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const min = parseInt(searchParams.get("min")) || 0;
    const max = searchParams.get("max") ? parseInt(searchParams.get("max")) : null;

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    // Build headcount filter
    const filter = {
      headcount: { $gte: min },
    };

    if (max !== null) {
      filter.headcount.$lte = max;
    }

    const docs = await coll.find(filter).toArray();

    const cleanDocs = docs.map((d) => ({
      ...d,
      _id: d._id.toString(),
    }));

    return new Response(JSON.stringify(cleanDocs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error in GET /api/companies/headcount-range:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
