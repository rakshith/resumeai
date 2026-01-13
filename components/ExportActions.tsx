"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Lock } from "lucide-react";

interface ResumeData {
    name: string;
    title: string;
    email?: string;
    phone?: string;
    location?: string;
    summary: string;
    skills: string[];
    experience: Array<{
        company: string;
        role: string;
        duration: string;
        bullets: string[];
    }>;
    projects: string[];
    education: Array<{
        degree: string;
        institution: string;
        year: string;
    }> | string[];
}

interface ExportActionsProps {
    resume: ResumeData | null;
    printRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportActions({ resume, printRef }: ExportActionsProps) {
    // Simulated Pro status - set to false for paywall gating
    const isPro = true;

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "resume",
    });

    const handleExportPDF = () => {
        if (!isPro) return;
        handlePrint();
    };

    const handleExportDOCX = async () => {
        if (!isPro || !resume) return;

        // Build document sections
        const children: Paragraph[] = [];

        // Name
        children.push(
            new Paragraph({
                text: resume.name,
                heading: HeadingLevel.TITLE,
                spacing: { after: 100 },
            })
        );

        // Title
        children.push(
            new Paragraph({
                text: resume.title,
                spacing: { after: 200 },
            })
        );

        // Contact info
        const contactParts: string[] = [];
        if (resume.email) contactParts.push(resume.email);
        if (resume.phone) contactParts.push(resume.phone);
        if (resume.location) contactParts.push(resume.location);
        if (contactParts.length > 0) {
            children.push(
                new Paragraph({
                    text: contactParts.join(" | "),
                    spacing: { after: 300 },
                })
            );
        }

        // Summary
        children.push(
            new Paragraph({
                text: "PROFESSIONAL SUMMARY",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
            })
        );
        children.push(
            new Paragraph({
                text: resume.summary,
                spacing: { after: 200 },
            })
        );

        // Skills
        children.push(
            new Paragraph({
                text: "TECHNICAL SKILLS",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
            })
        );
        children.push(
            new Paragraph({
                text: resume.skills.join(" | "),
                spacing: { after: 200 },
            })
        );

        // Experience
        children.push(
            new Paragraph({
                text: "PROFESSIONAL EXPERIENCE",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
            })
        );
        for (const exp of resume.experience) {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.role, bold: true }),
                        new TextRun({ text: ` at ${exp.company}` }),
                    ],
                    spacing: { before: 100 },
                })
            );
            children.push(
                new Paragraph({
                    text: exp.duration,
                    spacing: { after: 50 },
                })
            );
            for (const bullet of exp.bullets) {
                children.push(
                    new Paragraph({
                        text: `• ${bullet}`,
                        spacing: { after: 50 },
                    })
                );
            }
        }

        // Projects
        if (resume.projects && resume.projects.length > 0) {
            children.push(
                new Paragraph({
                    text: "KEY PROJECTS",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 200, after: 100 },
                })
            );
            for (const project of resume.projects) {
                children.push(
                    new Paragraph({
                        text: `• ${project}`,
                        spacing: { after: 50 },
                    })
                );
            }
        }

        // Education
        children.push(
            new Paragraph({
                text: "EDUCATION",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
            })
        );
        for (const edu of resume.education) {
            if (typeof edu === "string") {
                children.push(
                    new Paragraph({
                        text: edu,
                        spacing: { after: 50 },
                    })
                );
            } else {
                children.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: edu.degree, bold: true }),
                            new TextRun({ text: ` — ${edu.institution}` }),
                        ],
                    })
                );
                children.push(
                    new Paragraph({
                        text: edu.year,
                        spacing: { after: 100 },
                    })
                );
            }
        }

        const doc = new Document({
            sections: [
                {
                    children,
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, "resume.docx");
    };

    return (
        <div className="w-full max-w-[210mm] mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-4">
                <Button
                    variant="outline"
                    size="lg"
                    disabled={!isPro}
                    onClick={handleExportPDF}
                    className="w-full sm:w-auto gap-2"
                >
                    {!isPro && <Lock className="h-4 w-4" />}
                    <FileDown className="h-4 w-4" />
                    Export PDF
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    disabled={!isPro}
                    onClick={handleExportDOCX}
                    className="w-full sm:w-auto gap-2"
                >
                    {!isPro && <Lock className="h-4 w-4" />}
                    <FileText className="h-4 w-4" />
                    Export DOCX
                </Button>
            </div>

            {!isPro && (
                <p className="text-center text-sm text-muted-foreground pb-2">
                    Upgrade to Pro to export your resume
                </p>
            )}
        </div>
    );
}
