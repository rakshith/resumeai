"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dummyResume, ResumeData } from "@/lib/resumeData";

interface ResumePreviewProps {
    resume?: ResumeData;
    onMaximize?: () => void
    isFullscreen?: boolean
    printRef?: React.RefObject<HTMLDivElement | null>
    resumeLength?: "1" | "2"
}

const A4_PAGE_HEIGHT = "297mm";

export function ResumePreview({ resume, onMaximize, isFullscreen = false, printRef, resumeLength = "1" }: ResumePreviewProps) {
    const displayResume = resume || dummyResume;

    // Split content for 2-page layout
    const midIndex = Math.ceil(displayResume.experience.length / 2);
    const firstPageExperience = resumeLength === "2" ? displayResume.experience.slice(0, midIndex) : displayResume.experience;
    const secondPageExperience = resumeLength === "2" ? displayResume.experience.slice(midIndex) : [];

    const renderHeader = () => (
        <div className="text-center space-y-1.5 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-gray-900 leading-tight">
                {displayResume.name}
            </h1>
            <p className="text-base md:text-lg font-medium text-gray-600">
                {displayResume.title}
            </p>
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
    );

    const renderSkills = () => (
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
    );

    const renderExperience = (experiences: typeof displayResume.experience) => (
        <section className="space-y-4">
            <h2 className="text-[10pt] font-black uppercase tracking-[0.2em] text-gray-900 border-b-[1.5px] border-gray-900/10 pb-1">
                Professional Experience
            </h2>
            {experiences.map((exp, index) => (
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
    );

    const renderProjects = () => (
        displayResume.projects && displayResume.projects.length > 0 && (
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
        )
    );

    const renderEducation = () => (
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
    );

    const renderPageContent = (pageNum: 1 | 2) => (
        <div
            data-print-content="true"
            className="p-8 md:p-12 space-y-5 font-sans text-[11pt] text-gray-900 leading-relaxed print:p-[10mm] print:space-y-4"
            style={{
                minHeight: A4_PAGE_HEIGHT
            }}
        >
            {pageNum === 1 ? (
                <>
                    {renderHeader()}
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

                    {renderSkills()}
                    {resumeLength === "1" && renderExperience(displayResume.experience)}
                    {resumeLength === "1" && renderProjects()}
                    {resumeLength === "1" && renderEducation()}
                    {resumeLength === "2" && renderExperience(firstPageExperience)}
                </>
            ) : (
                <>
                    {renderExperience(secondPageExperience)}
                    {renderProjects()}
                    {renderEducation()}
                </>
            )}
        </div>
    );

    const pageClassName = `${isFullscreen ? 'w-[95%]' : 'w-full max-w-[210mm]'} bg-white shadow-2xl rounded-sm border border-border/50 transition-all duration-300 print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none`;

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

            <style>{`
                @media print {
                    .resume-page {
                        page-break-after: always;
                        break-after: page;
                    }
                    .resume-page:last-child {
                        page-break-after: auto;
                        break-after: auto;
                    }
                    .resume-container {
                        display: block;
                    }
                }
            `}</style>

            {resumeLength === "1" ? (
                // Single page - ref on the page itself
                <div
                    ref={printRef}
                    data-print-container="true"
                    className={pageClassName}
                >
                    {renderPageContent(1)}
                </div>
            ) : (
                // Two pages - wrap in container with ref
                <div ref={printRef} className="w-full flex flex-col items-center resume-container">
                    {/* Page 1 */}
                    <div
                        data-print-container="true"
                        className={`${pageClassName} resume-page mb-4`}
                    >
                        <div className={`px-4 py-1 text-[10px] uppercase tracking-wider font-bold border-b ${isFullscreen ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                            Page 1
                        </div>
                        {renderPageContent(1)}
                    </div>

                    {/* Page 2 */}
                    <div
                        data-print-container="true"
                        className={`${pageClassName} resume-page`}
                    >
                        <div className={`px-4 py-1 text-[10px] uppercase tracking-wider font-bold border-b ${isFullscreen ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                            Page 2
                        </div>
                        {renderPageContent(2)}
                    </div>
                </div>
            )}

            {/* Page indicator (only if not fullscreen) */}
            {!isFullscreen && (
                <div className="mt-3 text-[10px] uppercase tracking-tighter font-bold text-muted-foreground/40">
                    ATS COMPLIANT FORMAT • {resumeLength === "2" ? "PAGE 1 OF 2" : "PAGE 1 OF 1"}
                </div>
            )}
        </div>
    );
}
