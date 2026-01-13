"use server";

import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

/* -------------------- Schemas -------------------- */

const experienceItemSchema = z.object({
    company: z.string(),
    role: z.string(),
    duration: z.string(),
    bullets: z.array(z.string()),
});

const resumeJSONSchema = z.object({
    name: z.string(),
    title: z.string(),
    summary: z.string(),
    skills: z.array(z.string()),
    experience: z.array(experienceItemSchema),
    projects: z.array(z.string()),
    education: z.array(z.string()),
});

const atsInsightsSchema = z.object({
    rejection_reasons: z.array(z.string()),
    fixes_applied: z.array(z.string()),
});

const optimizeResponseSchema = z.object({
    resume: resumeJSONSchema,
    ats_insights: atsInsightsSchema,
    detected_experience_level: z.enum([
        "fresher",
        "mid",
        "senior",
        "staff",
    ]),
});

export type ResumeJSON = z.infer<typeof resumeJSONSchema>;
export type ATSInsights = z.infer<typeof atsInsightsSchema>;
export type OptimizeResponse = z.infer<typeof optimizeResponseSchema>;

/* -------------------- Types -------------------- */

interface FactualResume {
    skills: string[];
    experience: {
        company: string;
        role: string;
        duration: string;
        bullets: string[];
    }[];
    projects: string[];
    education: string[];
}

/* -------------------- Action -------------------- */

export async function optimizeResume(formData: {
    resumeText?: string;
    factualData?: FactualResume;
    goal: string;
    targetRole: string;
    jobDescription: string;
    experienceLevel: string;
    resumeLength: "1" | "2";
    tone: string;
}): Promise<OptimizeResponse> {
    const isChunked = !!formData.factualData;
    const inputData = isChunked
        ? JSON.stringify(formData.factualData, null, 2)
        : formData.resumeText;

    const optimizationPrompt = `
You are an expert ATS resume optimizer.

${isChunked ? "INPUT: Factual resume data." : "INPUT: Raw resume text."}

GOAL: ${formData.goal}
TARGET ROLE: ${formData.targetRole}
EXPERIENCE LEVEL: ${formData.experienceLevel || "auto-detect"}
RESUME LENGTH: ${formData.resumeLength} page(s)
TONE: ${formData.tone}

${formData.jobDescription ? `JOB DESCRIPTION:\n${formData.jobDescription}` : ""}

IMPORTANT:
- Detect experience level automatically:
  fresher (0–2), mid (2–5), senior (5–10), staff (10+)

RULES:
- Never hallucinate experience or education
- Prefer last 8–12 years
- Drop outdated technologies
- Optimize for ATS
- Use quantified impact
- Include JD keywords

${isChunked ? "FACTUAL DATA:" : "RESUME TEXT:"}
${inputData}
`;

    try {
        const result = await generateText({
            model: openai(process.env.NODE_ENV === "production" ? "gpt-5.2" : "gpt-4o-mini"),
            prompt: optimizationPrompt,
            temperature: 0.3,
            output: Output.object({ schema: optimizeResponseSchema }),
        });

        return result.output as OptimizeResponse;
    } catch (error) {
        console.error("Error optimizing resume:", error);

        return {
            resume: {
                name: "Error",
                title: formData.targetRole || "Professional",
                summary: "Failed to optimize resume. Please try again.",
                skills: [],
                experience: [],
                projects: [],
                education: [],
            },
            ats_insights: {
                rejection_reasons: ["AI optimization failed"],
                fixes_applied: [],
            },
            detected_experience_level: "mid",
        };
    }
}
