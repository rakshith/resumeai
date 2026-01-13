import { NextRequest, NextResponse } from "next/server";
// Use require to avoid some ESM/compatibility issues in server context if necessary, 
// but import usually works better in Next.js App Router for types.
// We'll use dynamic import inside the handler or standard import.
import HTMLtoDOCX from "html-to-docx";

export async function POST(req: NextRequest) {
    try {
        const { html } = await req.json();

        if (!html) {
            return NextResponse.json(
                { error: "HTML content is required" },
                { status: 400 }
            );
        }

        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    /* Base Styles */
                    body {
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 11pt;
                        color: #111827; /* gray-900 */
                        line-height: 1.5;
                        margin: 0;
                        padding: 0;
                    }

                    /* Header - Name & Title */
                    h1 {
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 22pt;
                        font-weight: 700;
                        text-align: center;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        color: #111827;
                        margin: 0 0 6px 0;
                        padding: 0;
                    }
                    div.text-center > p {
                        font-size: 11pt;
                        font-weight: 500;
                        text-align: center;
                        color: #4B5563; /* gray-600 */
                        margin: 0 0 12px 0;
                    }

                    /* Contact Info */
                    div.flex-wrap {
                        text-align: center;
                        font-size: 10pt;
                        color: #6B7280; /* gray-500 */
                        margin-bottom: 24px;
                    }

                    /* Section Headings */
                    h2 {
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 10pt;
                        font-weight: 900; /* font-black */
                        text-transform: uppercase;
                        letter-spacing: 0.2em;
                        color: #111827;
                        border-bottom: 1.5px solid #E5E7EB; /* gray-200 */
                        padding-bottom: 4px;
                        margin: 20px 0 12px 0;
                    }

                    /* Experience & Education Titles */
                    h3 {
                        font-size: 11pt;
                        font-weight: 700;
                        color: #111827;
                        margin: 0;
                        padding: 0;
                    }

                    /* Experience Meta (Company, Duration) */
                    .italic {
                        font-style: italic;
                        color: #4B5563;
                    }
                    
                    /* Lists & Bullets */
                    ul {
                        margin: 6px 0 16px 20px;
                        padding: 0;
                    }
                    li {
                        font-size: 10.5pt;
                        color: #374151; /* gray-700 */
                        margin-bottom: 2px;
                    }

                    /* Skills */
                    .text-gray-700 {
                        color: #374151;
                        font-size: 10.5pt;
                    }

                    /* Education */
                    .text-gray-900 { color: #111827; }
                    .text-gray-600 { color: #4B5563; }
                    .text-gray-500 { color: #6B7280; }
                    
                    /* Utility for alignment since Flexbox isn't fully supported in generic docx parsers */
                    p { margin: 0 0 4px 0; }
                    
                    /* Attempt to handle flex row for experience/education dates */
                    div.flex {
                        display: table;
                        width: 100%;
                        margin-bottom: 4px;
                    }
                    div.flex > div {
                        display: table-cell;
                        vertical-align: baseline;
                    }
                    div.flex > span {
                        display: table-cell;
                        text-align: right;
                        white-space: nowrap;
                        vertical-align: baseline;
                        padding-left: 12px;
                    }

                    /* Specific fix for the header flex container (A4 Preview bar) being included? 
                       Actually, the client sends htmlElement.innerHTML which might include the header buttons if we aren't careful.
                       We used printRef on the "A4 Paper Container" so it shouldn't include the buttons.
                    */
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        const fileBuffer = await HTMLtoDOCX(fullHtml, null, {
            table: { row: { cantSplit: true } },
            footer: false,
            header: false,
            pageNumber: false,
            margins: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720,
            },
        });

        // Convert Buffer to correct response
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": 'attachment; filename="resume.docx"',
            },
        });
    } catch (error) {
        console.error("DOCX generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate DOCX" },
            { status: 500 }
        );
    }
}
