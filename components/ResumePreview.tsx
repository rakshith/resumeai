"use strict";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const dummyResume = {
    name: "John Doe",
    title: "Frontend Engineer",
    summary:
        "Frontend engineer with experience building scalable web applications using React, TypeScript, and modern frontend tooling.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "REST APIs"],
    experience: [
        {
            company: "Acme Corp",
            role: "Frontend Engineer",
            duration: "2021 – Present",
            bullets: [
                "Built and maintained reusable UI components using React and TypeScript",
                "Improved application performance by optimizing rendering logic",
                "Collaborated with backend engineers to integrate REST APIs"
            ]
        }
    ],
    projects: [
        "Internal dashboard for analytics and reporting",
        "Public-facing marketing website using Next.js"
    ],
    education: [
        "B.Tech in Computer Science – XYZ University"
    ]
};

interface ResumePreviewProps {
    resume?: {
        name: string
        title: string
        summary: string
        skills: string[]
        experience: Array<{
            company: string
            role: string
            duration: string
            bullets: string[]
        }>
        projects: string[]
        education: string[]
    }
}

export function ResumePreview({ resume }: ResumePreviewProps) {
    const displayResume = resume || dummyResume
    return (
        <Card className="h-full shadow-lg">
            <CardHeader className="bg-muted/50">
                <CardTitle className="text-xl font-bold">Resume Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6 font-sans text-sm text-foreground overflow-y-auto max-h-[800px]">
                {/* Header */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold uppercase tracking-wide text-foreground">{displayResume.name}</h1>
                    <p className="text-md font-medium text-muted-foreground">{displayResume.title}</p>
                </div>

                <Separator />

                {/* Summary */}
                <div className="space-y-2">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground border-b pb-1">Summary</h2>
                    <p className="leading-relaxed text-muted-foreground">{displayResume.summary}</p>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground border-b pb-1">Skills</h2>
                    <p className="leading-relaxed text-muted-foreground">{displayResume.skills.join(" • ")}</p>
                </div>

                {/* Experience */}
                <div className="space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground border-b pb-1">Experience</h2>
                    {displayResume.experience.map((exp, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-foreground">{exp.role}</h3>
                                <span className="text-muted-foreground text-xs">{exp.duration}</span>
                            </div>
                            <p className="text-muted-foreground italic">{exp.company}</p>
                            <ul className="list-disc list-outside ml-4 space-y-1 text-muted-foreground mt-2">
                                {exp.bullets.map((bullet, i) => (
                                    <li key={i} className="pl-1">{bullet}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                <div className="space-y-2">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground border-b pb-1">Projects</h2>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-muted-foreground">
                        {displayResume.projects.map((project, index) => (
                            <li key={index} className="pl-1">{project}</li>
                        ))}
                    </ul>
                </div>

                {/* Education */}
                <div className="space-y-2">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground border-b pb-1">Education</h2>
                    <ul className="list-none space-y-1 text-muted-foreground">
                        {displayResume.education.map((edu, index) => (
                            <li key={index}>{edu}</li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
