// agents/resumeParser.ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_GPT_DEPLOYMENT}`,
  defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY! },
});

export async function parseResumeText(rawText: string) {
  const systemPrompt = `
You are a resume parser.
Respond ONLY with a JSON object.
No markdown.
No commentary.
No lists.
No bullet points.
No text before or after the JSON.
Output must start with { and end with }.
If you don't know a field, return an empty string or empty array.

JSON format example:
{
  "name": "",
  "email": "",
  "phone": "",
  "summary": "",
  "skills": [],
  "techStack": [],
  "experience": [],
  "education": []
}
`;

  const response = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_GPT_DEPLOYMENT!, // deployment name (string)
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Extract structured data from this resume:\n\n${rawText}` },
    ],
  });

  const output = response.choices[0].message.content || "";

  // Extract ONLY the JSON response
  const jsonMatch = output.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.error("MODEL OUTPUT WAS:", output);
    throw new Error("No JSON returned by model");
  }

  return JSON.parse(jsonMatch[0]);
}
