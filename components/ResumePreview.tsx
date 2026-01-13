"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const dummyResume = {
    name: "John Doe",
    title: "Frontend Engineer",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    summary:
        "Frontend engineer with 5+ years of experience building scalable web applications using React, TypeScript, and modern frontend tooling. Passionate about creating exceptional user experiences and mentoring junior developers.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "REST APIs", "GraphQL", "Node.js", "Git"],
    experience: [
        {
            company: "Acme Corp",
            role: "Senior Frontend Engineer",
            duration: "2021 – Present",
            bullets: [
                "Led the development of a customer-facing dashboard serving 50K+ daily active users",
                "Built and maintained 20+ reusable UI components using React and TypeScript",
                "Improved application performance by 40% through rendering optimizations",
                "Collaborated with backend engineers to integrate REST and GraphQL APIs"
            ]
        },
        {
            company: "StartupXYZ",
            role: "Frontend Developer",
            duration: "2019 – 2021",
            bullets: [
                "Developed responsive web applications using React and Redux",
                "Implemented automated testing reducing bug reports by 30%",
                "Worked directly with designers to ensure pixel-perfect implementations"
            ]
        }
    ],
    projects: [
        "Internal analytics dashboard with real-time data visualization",
        "Public-facing marketing website using Next.js and Vercel"
    ],
    education: [
        {
            degree: "B.Tech in Computer Science",
            institution: "XYZ University",
            year: "2019"
        }
    ]
};

interface ResumePreviewProps {
    resume?: {
        name: string
        title: string
        email?: string
        phone?: string
        location?: string
        summary: string
        skills: string[]
        experience: Array<{
            company: string
            role: string
            duration: string
            bullets: string[]
        }>
        projects: string[]
        education: Array<{
            degree: string
            institution: string
            year: string
        }> | string[]
    }
    onMaximize?: () => void
    isFullscreen?: boolean
}

export function ResumePreview({ resume, onMaximize, isFullscreen = false }: ResumePreviewProps) {
    const displayResume = resume || dummyResume;

    return (
        <div className={`w-full flex flex-col items-center ${isFullscreen ? 'bg-transparent' : ''}`}>
            {/* Header / Actions */}
            {!isFullscreen && (
                <div className="w-full max-w-[210mm] mb-1.5 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">A4 Preview</span>
                    </div>
                    {onMaximize && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={onMaximize}
                        >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Fullscreen</span>
                        </Button>
                    )}
                </div>
            )}

            {/* A4 Paper Container */}
            <div
                className={`${isFullscreen ? 'w-[90%]' : 'w-full max-w-[210mm]'} bg-white shadow-2xl rounded-sm border border-border/50 transition-all duration-300`}
            >
                {/* Resume Content */}
                <div className="p-8 md:p-12 space-y-5 font-sans text-[11pt] text-gray-900 leading-relaxed">
                    {/* Header Section */}
                    <div className="text-center space-y-1.5 pb-4">
                        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-gray-900 leading-tight">
                            {displayResume.name}
                        </h1>
                        <p className="text-base md:text-lg font-medium text-gray-600">
                            {displayResume.title}
                        </p>
                        {/* Contact Info */}
                        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10pt] text-gray-500 font-medium">
                            {displayResume.email && (
                                <span>{displayResume.email}</span>
                            )}
                            {displayResume.phone && (
                                <span className="flex items-center gap-2"><span className="text-gray-300">•</span> {displayResume.phone}</span>
                            )}
                            {displayResume.location && (
                                <span className="flex items-center gap-2"><span className="text-gray-300">•</span> {displayResume.location}</span>
                            )}
                        </div>
                    </div>

                    <Separator className="bg-gray-200 h-[1.5px]" />

                    {/* Summary Section */}
                    <section className="space-y-2">
                        <h2 className="text-[10pt] font-black uppercase tracking-[0.2em] text-gray-900 border-b-[1.5px] border-gray-900/10 pb-1">
                            Professional Summary
                        </h2>
                        <p className="text-gray-700 text-[10.5pt]">
                            {displayResume.summary}
                        </p>
                    </section>

                    {/* Skills Section */}
                    <section className="space-y-2">
                        <h2 className="text-[10pt] font-black uppercase tracking-[0.2em] text-gray-900 border-b-[1.5px] border-gray-900/10 pb-1">
                            Technical Skills
                        </h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {displayResume.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="text-gray-700 text-[10.5pt] font-medium"
                                >
                                    {skill}{index < displayResume.skills.length - 1 ? <span className="text-gray-300 ml-4 font-normal">|</span> : ''}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Experience Section */}
                    <section className="space-y-4">
                        <h2 className="text-[10pt] font-black uppercase tracking-[0.2em] text-gray-900 border-b-[1.5px] border-gray-900/10 pb-1">
                            Professional Experience
                        </h2>
                        {displayResume.experience.map((exp, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                                    <div>
                                        <h3 className="font-bold text-[11pt] text-gray-900">{exp.role}</h3>
                                        <p className="text-gray-600 italic font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-gray-500 text-[10pt] font-bold tabular-nums shrink-0">{exp.duration}</span>
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700 text-[10.5pt]">
                                    {exp.bullets.map((bullet, i) => (
                                        <li key={i} className="pl-1">{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    {/* Projects Section */}
                    {displayResume.projects && displayResume.projects.length > 0 && (
                        <section className="space-y-2">
                            <h2 className="text-[10pt] font-black uppercase tracking-[0.2em] text-gray-900 border-b-[1.5px] border-gray-900/10 pb-1">
                                Key Projects
                            </h2>
                            <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700 text-[10.5pt]">
                                {displayResume.projects.map((project, index) => (
                                    <li key={index} className="pl-1">{project}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Education Section */}
                    <section className="space-y-2">
                        <h2 className="text-[10pt] font-black uppercase tracking-[0.2em] text-gray-900 border-b-[1.5px] border-gray-900/10 pb-1">
                            Education
                        </h2>
                        <div className="space-y-2">
                            {displayResume.education.map((edu, index) => (
                                <div key={index} className="flex flex-col sm:flex-row sm:justify-between">
                                    {typeof edu === 'string' ? (
                                        <span className="text-gray-700 font-medium">{edu}</span>
                                    ) : (
                                        <>
                                            <div>
                                                <span className="font-bold text-gray-900">{edu.degree}</span>
                                                <span className="text-gray-600 font-medium"> — {edu.institution}</span>
                                            </div>
                                            <span className="text-gray-500 font-bold text-[10pt]">{edu.year}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Page indicator (only if not fullscreen) */}
            {!isFullscreen && (
                <div className="mt-3 text-[10px] uppercase tracking-tighter font-bold text-muted-foreground/40">
                    ATS COMPLIANT FORMAT • PAGE 1 OF 1
                </div>
            )}
        </div>
    );
}
