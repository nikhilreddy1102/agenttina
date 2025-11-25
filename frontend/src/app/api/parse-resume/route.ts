export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { parsePdfBuffer } from "../../../../../scripts/pdfParser";
import { parseResumeText } from "../../../../../agents/resumeParser";
import { scrapeJobs } from "../../../../../scraper/index";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // 1️⃣ Convert File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2️⃣ PDF → Raw Text
    const rawText = await parsePdfBuffer(buffer);

    if (!rawText || rawText.trim().length < 10) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 400 }
      );
    }

    // 3️⃣ Raw Text → Parsed Resume JSON (Step 1 complete)
    const parsedResume = await parseResumeText(rawText);

    // 4️⃣ Step 2 — Scrape FAANG jobs using your scraper (fetchHtml + Playwright fallback)
    const jobs = await scrapeJobs(parsedResume);

    // 5️⃣ Return result
    return NextResponse.json({
      success: true,
      jobs,
      resume: parsedResume
    });

  } catch (err: any) {
    console.error("❌ Full pipeline error:", err);
    return NextResponse.json(
      {
        error: "Failed to process resume and scrape jobs",
        details: err.message
      },
      { status: 500 }
    );
  }
}
