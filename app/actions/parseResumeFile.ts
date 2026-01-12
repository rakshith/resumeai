"use server";

import mammoth from "mammoth";

export async function parseResumeFile(file: File): Promise<string> {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    try {
        // Handle PDF files
        if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
            // Call FastAPI PDF parser service
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(
                `${process.env.PDF_PARSER_URL || "http://localhost:8000"}/parse-pdf`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Failed to parse PDF");
            }

            const data = await response.json();
            extractedText = data.text;
        }
        // Handle DOCX files
        else if (
            fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            fileName.endsWith(".docx")
        ) {
            const result = await mammoth.extractRawText({ buffer });
            extractedText = result.value;
        }
        // Handle DOC files (legacy Word format)
        else if (fileType === "application/msword" || fileName.endsWith(".doc")) {
            const result = await mammoth.extractRawText({ buffer });
            extractedText = result.value;
        }
        // Unsupported file type
        else {
            throw new Error(
                "Unsupported file type. Please upload a PDF or DOCX file."
            );
        }

        // Normalize output
        extractedText = extractedText
            .trim()
            .replace(/\n{3,}/g, "\n\n"); // Remove excessive blank lines

        // Check if extracted text is empty (likely a scanned PDF)
        if (!extractedText || extractedText.trim().length === 0) {
            throw new Error(
                "This resume appears to be scanned. Please upload a text-based PDF or DOCX."
            );
        }

        return extractedText;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to parse resume: ${error.message}`);
        }
        throw new Error("Failed to parse resume. Please try again.");
    }
}
