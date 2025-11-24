// scraper/index.ts

import { extractKeywords } from "./extractKeywords";
import { scannerAgent } from "../agents/scannerAgent";
import { ScrapedJob, ResumeData } from "./types";

export async function scrapeJobs(resume: ResumeData): Promise<ScrapedJob[]> {
  // 1️⃣ Extract roles from resume (currently hardcoded for testing)
  const roles = extractKeywords(resume);

  // 2️⃣ Run the new hybrid pipeline (Google Search → Universal Scraper)
  const jobs = await scannerAgent(roles);

  // 3️⃣ Return the scraped jobs
  return jobs;
}
