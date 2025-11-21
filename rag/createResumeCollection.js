const { QdrantClient } = require("@qdrant/js-client-rest");
require("dotenv").config();

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

async function createResumeCollection() {
  await client.createCollection("resume_vectors", {
    vectors: { size: 1536, distance: "Cosine" },
  });

  console.log("resume_vectors collection created!");
}

createResumeCollection();
