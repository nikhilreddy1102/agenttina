// agents/scannerAgent.ts

import { universalScraper } from "../scraper/universalScraper";
import { FAANG_CAREER_URLS } from "../scraper/config/faangCareerUrls";

export async function scannerAgent(roles: string[]) {
  const results: any[] = [];

  // Loop FAANG companies
  for (const [company, url] of Object.entries(FAANG_CAREER_URLS)) {
    for (const role of roles) {
      try {
        console.log(`🔍 Scraping ${company} → ${role}`);

        // Directly scrape the FAANG career site
        const jobs = await universalScraper(url, role, company);

        console.log(`📌 ${company}: Found ${jobs.length} jobs for ${role}`);

        results.push(...jobs);
      } catch (err) {
        console.log(`🚨 Error scraping ${company}:`, err);
      }
    }
  }

  return results;
}
