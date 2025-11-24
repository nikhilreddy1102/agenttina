import { CompanyConfig } from "./types";

export function buildUrls(company: CompanyConfig, keywords: string[]): string {
  const query = keywords.join("+");
  return `${company.baseUrl}?${company.queryParam}=${query}`;
}
