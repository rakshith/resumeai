"use client";

import React from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Lock } from "lucide-react";
import { exportToDocx } from "@/utils/exportDocx";

interface ExportActionsProps {
    printRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportActions({ printRef }: ExportActionsProps) {
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
        if (!isPro) return;

        try {
            await exportToDocx(printRef.current, "resume.docx");
        } catch (error) {
            console.error("Failed to export DOCX:", error);
        }
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
