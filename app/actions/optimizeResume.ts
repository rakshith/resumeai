"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

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
});

export type ResumeJSON = z.infer<typeof resumeJSONSchema>;
export type ATSInsights = z.infer<typeof atsInsightsSchema>;
export type OptimizeResponse = z.infer<typeof optimizeResponseSchema>;

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

    const optimizationPrompt = `You are an expert ATS resume optimizer.

${isChunked ? "INPUT: Factual resume data extracted from a long resume." : "INPUT: Raw resume text."}

GOAL: ${formData.goal}
TARGET ROLE: ${formData.targetRole}
EXPERIENCE LEVEL: ${formData.experienceLevel}
RESUME LENGTH: ${formData.resumeLength} page(s)
TONE: ${formData.tone}
${formData.jobDescription ? `JOB DESCRIPTION:\n${formData.jobDescription}` : ""}

RULES:
- Never hallucinate new experience
- Never invent education
- Prefer last 8–12 years of experience
- Drop outdated technologies automatically
- Condense content to fit ${formData.resumeLength} page(s)
- Rank relevance based on target role
- Optimize for ATS compliance
- Use action verbs + task + quantifiable results
- Include high-value keywords from job description

${isChunked ? "FACTUAL DATA:" : "RESUME TEXT:"}
${inputData}`;

    try {
        const { object } = await generateObject({
            model: openai("gpt-4o"),
            prompt: optimizationPrompt,
            schema: optimizeResponseSchema,
            temperature: 0.3,
        });

        return object;
    } catch (error) {
        console.error("Error optimizing resume:", error);

        // Fallback response
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
        };
    }
}
