// scraper/universalScraper.ts
import { chromium, Page } from "playwright";

export interface JobResult {
  title: string;
  company: string;
  location: string;
  url: string;
  postedText: string | null;
}

// --------------------------------------------------
// MAIN SCRAPER
// --------------------------------------------------
export async function universalScraper(
  careerUrl: string,
  role: string,
  company: string
): Promise<JobResult[]> {

  const browser = await chromium.launch({
    headless: true,
    timeout: 35000,
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  console.log(`🌐 Visiting: ${careerUrl}`);
  await safeGoto(page, careerUrl);
  await page.waitForTimeout(3000);

  console.log("📄 Trying universal selectors...");
  let jobs = await collectUniversal(page, company);

  if (jobs.length === 0) {
    console.log("⚠️ Universal scraper failed → Trying Google fallback...");
    jobs = await googleFallback(page, company, role);
  }

  await browser.close();
  console.log(`✅ Final result: ${jobs.length} jobs from ${company}`);

  return jobs;
}

// --------------------------------------------------
// SAFE GOTO
// --------------------------------------------------
async function safeGoto(page: Page, url: string) {
  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
  } catch {
    console.log("⚠️ Goto timeout, retrying...");
    await page.goto(url, { waitUntil: "load" });
  }
}

// --------------------------------------------------
// UNIVERSAL COLLECTOR (kept simple)
// --------------------------------------------------
async function collectUniversal(page: Page, company: string): Promise<JobResult[]> {
  const cards = page.locator(".job-card, [data-testid*='job']");
  const count = await cards.count();

  if (count === 0) return [];

  const results: JobResult[] = [];

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const title = await card.locator("h2, h3").first().innerText().catch(() => "");
    const url = await card.locator("a").first().getAttribute("href").catch(() => null);
    const location = await card.locator("text=/United States|USA|US/").first().innerText().catch(() => "");

    if (!title || !url) continue;

    results.push({
      title,
      company,
      location,
      url: url.startsWith("http") ? url : new URL(url, page.url()).toString(),
      postedText: null,
    });
  }

  return results;
}

// --------------------------------------------------
// GOOGLE-SPECIFIC FALLBACK (THIS IS THE PART THAT FIXES EVERYTHING)
// --------------------------------------------------
async function googleFallback(
  page: Page,
  company: string,
  role: string
): Promise<JobResult[]> {

  console.log("🔁 Running Google Fallback...");

  // Your Google HTML outerHTML shows job cards like:
  // <li class="lLd3Je">
  //    <div jscontroller="snXUJb">
  //       <h3 class="QJPWVe">Job Title</h3>
  //       <a href="./jobs/results/...">
  // So we use exactly those selectors.

  const cardSelector = "li.lLd3Je div[jscontroller='snXUJb']";

  const cards = page.locator(cardSelector);
  const count = await cards.count();

  console.log(`🔍 Google Fallback: Found ${count} potential cards`);

  if (count === 0) {
    console.log("❌ Google fallback found 0 cards — selectors matched nothing.");
    return [];
  }

  const results: JobResult[] = [];

  for (let i = 0; i < count; i++) {

    const card = cards.nth(i);

    const title = await card.locator("h3.QJPWVe").innerText().catch(() => "");
    if (!title) continue;

    const urlRaw = await card.locator("a[href*='/jobs/results']").getAttribute("href").catch(() => null);
    if (!urlRaw) continue;

    const url = urlRaw.startsWith("http")
      ? urlRaw
      : new URL(urlRaw, "https://careers.google.com").toString();

    // Google does NOT provide posted date in your DOM
    const postedText = null;

    // Location often inside nested <div>
    const location = await card.locator("div").nth(3).innerText().catch(() => "");

    results.push({
      title,
      company: "Google",
      location,
      url,
      postedText,
    });
  }

  console.log("🟢 Google fallback extraction complete.");
  return results;
}
