"use client";

import { saveAs } from "file-saver";

export async function exportToDocx(
    htmlElement: HTMLElement | null,
    filename: string = "resume.docx"
): Promise<void> {
    if (!htmlElement) {
        console.error("No HTML element provided for DOCX export");
        return;
    }

    try {
        // Prepare styles to include in the request
        // We reuse the basic styles logic but pass just the innerHTML or structural HTML to the API
        // For simplicity, let's pass the innerHTML and let the server wrap it with the full document structure
        // including the styles we want.

        // Actually, for best WYSIWYG, we need to pass the styles too. 
        // But the API I wrote adds the styles. So I just send the innerHTML.

        const response = await fetch("/api/export-docx", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                html: htmlElement.innerHTML,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate DOCX");
        }

        const blob = await response.blob();
        saveAs(blob, filename);
    } catch (error) {
        console.error("DOCX export error:", error);
        throw error;
    }
}
