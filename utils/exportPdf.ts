"use client";

import { saveAs } from "file-saver";

export async function exportToPdf(
    htmlElement: HTMLElement | null,
    filename: string = "resume.pdf",
    resumeLength: "1" | "2" = "1"
): Promise<void> {
    if (!htmlElement) {
        console.error("No HTML element provided for PDF export");
        return;
    }

    try {
        const response = await fetch("/api/export-pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                html: htmlElement.innerHTML,
                resumeLength,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate PDF");
        }

        const blob = await response.blob();
        saveAs(blob, filename);
    } catch (error) {
        console.error("PDF export error:", error);
        throw error;
    }
}
