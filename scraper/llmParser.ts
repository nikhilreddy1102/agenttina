import { ScrapedJob } from "./types";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_GPT_DEPLOYMENT}/`,
  defaultQuery: {
    "api-version": process.env.AZURE_OPENAI_API_VERSION
  }
});

export async function parseWithLLM(
  htmlText: string,
  company: string,
  sourceUrl: string
): Promise<ScrapedJob | null> {
  try {
    let cleanedHtml = htmlText
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ");

    cleanedHtml = cleanedHtml.slice(0, 20000);

    const prompt = `
Extract job information from the following text.
Return ONLY valid JSON with EXACTLY these fields:

{
  "title": "",
  "location": "",
  "description": ""
}

If any field is missing, return empty string.

COMPANY: ${company}
SOURCE URL: ${sourceUrl}

TEXT:
${cleanedHtml}
`;

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_GPT_DEPLOYMENT!,
      messages: [{ role: "user", content: prompt }]
    });

    const content = response.choices[0].message?.content ?? "";
    const parsed = JSON.parse(content);

    return {
      company,
      title: parsed.title || "",
      location: parsed.location || "",
      description: parsed.description || "",
      url: sourceUrl
    };

  } catch (err) {
    console.error(`❌ LLM parsing error for ${company}:`, err);
    return null;
  }
}
