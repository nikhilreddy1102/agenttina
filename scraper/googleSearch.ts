// scraper/googleSearch.ts
import { chromium } from "playwright";
import * as cheerio from "cheerio";

export async function googleSearch(query: string): Promise<string[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.google.com");
  await page.fill("input[name='q']", query);
  await page.keyboard.press("Enter");

  await page.waitForTimeout(2500);

  const html = await page.content();
  await browser.close();

  const $ = cheerio.load(html);
  const links: string[] = [];

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    if (href.startsWith("/url?q=")) {
      const clean = href.replace("/url?q=", "").split("&")[0];
      if (clean.startsWith("http")) links.push(clean);
    }
  });

  return links;
}
