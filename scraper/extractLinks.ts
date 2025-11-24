// scraper/extractLinks.ts

export const FAANG_DOMAINS = [
  "careers.google.com",
  "amazon.jobs",
  "jobs.apple.com",
  "metacareers.com",
  "jobs.netflix.com",
];

export function filterCareerLinks(links: string[]): string[] {
  return links.filter(url =>
    FAANG_DOMAINS.some(domain => url.includes(domain))
  );
}
