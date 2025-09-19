// src/app/api/mongodb/route.js
import clientPromise from "./mongoClient";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    const docs = await coll.find({}).toArray();

    const cleanDocs = docs.map((d) => ({
      ...d,
      _id: d._id.toString(),
    }));

    return new Response(JSON.stringify(cleanDocs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in GET /api/companies:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
