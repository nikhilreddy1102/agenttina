import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";

dotenv.config();

const client = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
});

async function createResumeCollection(): Promise<void> {
  try {
    await client.createCollection("resume_vectors", {
      vectors: {
        size: 1536,
        distance: "Cosine",
      },
    });

    console.log("resume_vectors collection created!");
  } catch (error) {
    console.error("Error creating resume_vectors collection:", error);
  }
}

createResumeCollection();
