import { NextRequest, NextResponse } from "next/server";

const PDF_PARSER_URL = process.env.PDF_PARSER_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Forward the file to FastAPI PDF parser
        const pdfFormData = new FormData();
        pdfFormData.append("file", file);

        const response = await fetch(`${PDF_PARSER_URL}/parse-pdf`, {
            method: "POST",
            body: pdfFormData,
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error.detail || "Failed to parse PDF" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("PDF parsing error:", error);
        return NextResponse.json(
            { error: "Failed to connect to PDF parser service" },
            { status: 500 }
        );
    }
}
