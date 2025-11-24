import { CompanyConfig } from "../types";

export const FAANG_COMPANIES: CompanyConfig[] = [
  { name: "Google", baseUrl: "https://careers.google.com/jobs/results", queryParam: "q" },
  { name: "Amazon", baseUrl: "https://www.amazon.jobs/search", queryParam: "keyword" },
  { name: "Meta", baseUrl: "https://www.metacareers.com/jobs", queryParam: "q" },
  { name: "Apple", baseUrl: "https://jobs.apple.com/en-us/search", queryParam: "search" },
  { name: "Netflix", baseUrl: "https://jobs.netflix.com/search", queryParam: "q" },
];
