"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Lock, Loader2 } from "lucide-react";
import { exportToDocx } from "@/utils/exportDocx";
import { exportToPdf } from "@/utils/exportPdf";
import { ResumeData } from "@/lib/resumeData";

interface ExportActionsProps {
    printRef: React.RefObject<HTMLDivElement | null>;
    resumeLength?: "1" | "2";
    resume?: Omit<ResumeData, 'email' | 'phone' | 'location'> & Partial<Pick<ResumeData, 'email' | 'phone' | 'location'>>;
}

export function ExportActions({ printRef, resumeLength = "1", resume }: ExportActionsProps) {
    // Simulated Pro status - set to false for paywall gating
    const isPro = true;
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [isExportingDocx, setIsExportingDocx] = useState(false);

    const handleExportPDF = async () => {
        if (!isPro) return;
        
        setIsExportingPdf(true);
        try {
            await exportToPdf(printRef.current, "resume.pdf", resumeLength);
        } catch (error) {
            console.error("Failed to export PDF:", error);
        } finally {
            setIsExportingPdf(false);
        }
    };

    const handleExportDOCX = async () => {
        if (!isPro || !resume) return;

        setIsExportingDocx(true);
        try {
            // Convert to full ResumeData with optional fields
            const fullResume: ResumeData = {
                ...resume,
                email: resume.email || '',
                phone: resume.phone || '',
                location: resume.location || ''
            };
            await exportToDocx(fullResume, "resume.docx", resumeLength);
        } catch (error) {
            console.error("Failed to export DOCX:", error);
        } finally {
            setIsExportingDocx(false);
        }
    };

    return (
        <div className="w-full max-w-[210mm] mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-4">
                <Button
                    variant="outline"
                    size="lg"
                    disabled={!isPro || isExportingPdf}
                    onClick={handleExportPDF}
                    className="w-full sm:w-auto gap-2"
                >
                    {!isPro && <Lock className="h-4 w-4" />}
                    {isExportingPdf ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <FileDown className="h-4 w-4" />
                    )}
                    {isExportingPdf ? "Generating..." : "Export PDF"}
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    disabled={!isPro || isExportingDocx}
                    onClick={handleExportDOCX}
                    className="w-full sm:w-auto gap-2"
                >
                    {!isPro && <Lock className="h-4 w-4" />}
                    {isExportingDocx ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <FileText className="h-4 w-4" />
                    )}
                    {isExportingDocx ? "Generating..." : "Export DOCX"}
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
