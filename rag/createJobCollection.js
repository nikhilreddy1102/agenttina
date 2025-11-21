const { QdrantClient } = require("@qdrant/js-client-rest");
require("dotenv").config();

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

async function createJobCollection() {
  await client.createCollection("job_vectors", {
    vectors: { size: 1536, distance: "Cosine" },
  });

  console.log("job_vectors collection created!");
}

createJobCollection();
