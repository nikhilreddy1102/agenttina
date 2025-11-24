import { ResumeData } from "./types";

// We keep the function signature SAME.
// Later this function will use resume titles → auto-matching mode.
export function extractKeywords(resume: ResumeData): string[] {
  const ROLE_KEYWORDS = [
    "Software Engineer",
    "Backend Developer",
    "Software Developer",
    "Full Stack Developer",
    "Frontend Developer"
  ];

  return ROLE_KEYWORDS;  // temporary override
}
