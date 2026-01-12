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

const factualResumeSchema = z.object({
    skills: z.array(z.string()),
    experience: z.array(experienceItemSchema),
    projects: z.array(z.string()),
    education: z.array(z.string()),
});

type FactualResume = z.infer<typeof factualResumeSchema>;

function splitIntoChunks(text: string, maxChunkSize: number = 2000): string[] {
    const chunks: string[] = [];
    let currentChunk = "";

    const lines = text.split("\n");

    for (const line of lines) {
        if (currentChunk.length + line.length + 1 > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = line;
        } else {
            currentChunk += (currentChunk ? "\n" : "") + line;
        }
    }

    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

function mergeFactualData(chunks: FactualResume[]): FactualResume {
    const merged: FactualResume = {
        skills: [],
        experience: [],
        projects: [],
        education: [],
    };

    const skillsSet = new Set<string>();
    const projectsSet = new Set<string>();
    const educationSet = new Set<string>();
    const experienceMap = new Map<string, z.infer<typeof experienceItemSchema>>();

    for (const chunk of chunks) {
        // Merge skills (deduplicate)
        if (chunk.skills) {
            chunk.skills.forEach((skill) => {
                if (skill && skill.trim()) {
                    skillsSet.add(skill.trim());
                }
            });
        }

        // Merge projects (deduplicate)
        if (chunk.projects) {
            chunk.projects.forEach((project) => {
                if (project && project.trim()) {
                    projectsSet.add(project.trim());
                }
            });
        }

        // Merge education (deduplicate)
        if (chunk.education) {
            chunk.education.forEach((edu) => {
                if (edu && edu.trim()) {
                    educationSet.add(edu.trim());
                }
            });
        }

        // Merge experience (deduplicate by company + role)
        if (chunk.experience) {
            chunk.experience.forEach((exp) => {
                const key = `${exp.company}::${exp.role}`;
                if (experienceMap.has(key)) {
                    const existing = experienceMap.get(key)!;
                    const bulletSet = new Set([...existing.bullets, ...exp.bullets]);
                    existing.bullets = Array.from(bulletSet);
                } else {
                    experienceMap.set(key, { ...exp });
                }
            });
        }
    }

    merged.skills = Array.from(skillsSet);
    merged.projects = Array.from(projectsSet);
    merged.education = Array.from(educationSet);
    merged.experience = Array.from(experienceMap.values());

    return merged;
}

export async function chunkResumeText(resumeText: string): Promise<FactualResume> {
    const chunks = splitIntoChunks(resumeText, 2000);
    const factualChunks: FactualResume[] = [];

    const extractionPrompt = `You are a factual resume parser. Extract ONLY the facts from this resume chunk.

RULES:
- Extract facts exactly as written
- Do NOT rewrite or embellish
- Do NOT add formatting
- Do NOT invent information

Resume chunk:
{chunk}`;

    for (const chunk of chunks) {
        try {
            const { object } = await generateObject({
                model: openai("gpt-4o-mini"),
                prompt: extractionPrompt.replace("{chunk}", chunk),
                schema: factualResumeSchema,
                temperature: 0.1,
            });

            factualChunks.push(object);
        } catch (error) {
            console.error("Error extracting facts from chunk:", error);
        }
    }

    return mergeFactualData(factualChunks);
}
