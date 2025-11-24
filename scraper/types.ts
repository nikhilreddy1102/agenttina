export interface ResumeData {
  skills: string[];
  technologies: string[];
}

export interface ScrapedJob {
  company: string;
  title: string;
  location: string;
  url: string;
  description: string;
}

export interface CompanyConfig {
  name: string;
  baseUrl: string;
  queryParam: string;
}
