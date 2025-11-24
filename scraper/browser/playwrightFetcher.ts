import { chromium } from "playwright";

export async function fetchHtmlWithBrowser(url: string): Promise<string> {
  let browser;
  try {
    console.log("🔥 PLAYWRIGHT IS RUNNING FOR:", url);

    browser = await chromium.launch({ headless: true });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
      viewport: { width: 1280, height: 800 }
    });

    // 🚀 SPEED BOOST — block heavy resources (images, video, fonts, trackers)
    await context.route("**/*", (route) => {
      const req = route.request();
      const resourceType = req.resourceType();
      const reqUrl = req.url();

      // Block obvious heavy / tracking stuff
      if (
        ["image", "media", "font", "stylesheet"].includes(resourceType) ||
        reqUrl.endsWith(".png") ||
        reqUrl.endsWith(".jpg") ||
        reqUrl.endsWith(".jpeg") ||
        reqUrl.endsWith(".gif") ||
        reqUrl.endsWith(".webp") ||
        reqUrl.endsWith(".svg") ||
        reqUrl.endsWith(".mp4") ||
        reqUrl.includes("google-analytics") ||
        reqUrl.includes("doubleclick") ||
        reqUrl.includes("facebook") ||
        reqUrl.includes("tiktok") ||
        reqUrl.includes("ads")
      ) {
        return route.abort();
      }

      return route.continue();
    });

    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 45_000
    });

    // Try to load more results via scroll (infinite scroll / lazy lists)
    await autoScroll(page);

    // ---------- FAANG-SPECIFIC CLICK LOGIC ----------

    // GOOGLE CAREERS
    if (url.includes("careers.google.com")) {
      try {
        await page.waitForSelector(
          "a[data-ga-track*='job'], a[href*='/jobs/results/']",
          { timeout: 15_000 }
        );
        const card =
          (await page.$("a[data-ga-track*='job']")) ||
          (await page.$("a[href*='/jobs/results/']"));

        if (card) {
          await card.click();
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1500);
        }
      } catch {
        console.log("⚠️ Google: no job card clicked, using listing HTML.");
      }
    }

    // AMAZON JOBS
    else if (url.includes("amazon.jobs")) {
      try {
        await page.waitForSelector(
          "div.job-tile, a.jobLink, a[href*='/jobs/']",
          { timeout: 15_000 }
        );

        const card =
          (await page.$("a.jobLink")) ||
          (await page.$("div.job-tile a")) ||
          (await page.$("a[href*='/jobs/']"));

        if (card) {
          await card.click();
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1500);
        }
      } catch {
        console.log("⚠️ Amazon: no job card clicked, using listing HTML.");
      }
    }

    // META CAREERS
    else if (url.includes("metacareers.com")) {
      try {
        await page.waitForSelector("a[href*='/jobs/']", { timeout: 15_000 });
        const card = await page.$("a[href*='/jobs/']");
        if (card) {
          await card.click();
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1500);
        }
      } catch {
        console.log("⚠️ Meta: no job card clicked, using listing HTML.");
      }
    }

    // APPLE JOBS
    else if (url.includes("jobs.apple.com")) {
      // Apple often has description on listing page already.
      // We still scroll to load more, but no mandatory click.
      console.log("ℹ️ Apple: using listing page HTML (no click needed).");
    }

    // NETFLIX JOBS
    else if (url.includes("jobs.netflix.com")) {
      try {
        await page.waitForSelector(
          "a[data-ui='job-card'], a[href^='/jobs/']",
          { timeout: 15_000 }
        );

        const card =
          (await page.$("a[data-ui='job-card']")) ||
          (await page.$("a[href^='/jobs/']"));

        if (card) {
          await card.click();
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1500);
        }
      } catch {
        console.log("⚠️ Netflix: no job card clicked, using listing HTML.");
      }
    }

    // ---------- UNIVERSAL FALLBACK (OTHER COMPANIES LATER) ----------
    // For non-FAANG URLs in future, we still have:
    // - autoScroll loading
    // - resource blocking
    // and we just return the listing HTML.

    const html = await page.content();
    return html;

  } catch (err) {
    console.error("❌ Playwright fetch error:", err);
    return "";
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // ignore close errors
      }
    }
  }
}

// Simple infinite scroll helper (used as pagination for long lists)
async function autoScroll(page: any) {
  try {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 300;

        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight - 2000) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });
  } catch {
    console.log("⚠️ autoScroll: failed (page may not support scrolling).");
  }
}
