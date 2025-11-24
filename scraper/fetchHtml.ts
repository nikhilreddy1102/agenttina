export async function fetchHtml(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        // Fake a real Chrome browser
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Upgrade-Insecure-Requests": "1",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      console.error("❌ fetchHtml: HTTP Error", res.status, url);
      return "";
    }

    const html = await res.text();

    // Basic cleaning
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/\s+/g, " ")
      .trim();

  } catch (err) {
    console.error("❌ fetchHtml error:", err);
    return "";
  }
}
