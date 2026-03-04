import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
    try {
        const { html, resumeLength = "1" } = await req.json();

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
                    @page {
                        size: A4;
                        margin: 20mm;
                    }
                    
                    body {
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 11pt;
                        color: #111827;
                        line-height: 1.5;
                        margin: 0;
                        padding: 0;
                    }

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
                        color: #4B5563;
                        margin: 0 0 12px 0;
                    }

                    div.flex-wrap {
                        text-align: center;
                        font-size: 10pt;
                        color: #6B7280;
                        margin-bottom: 24px;
                    }

                    h2 {
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 10pt;
                        font-weight: 900;
                        text-transform: uppercase;
                        letter-spacing: 0.2em;
                        color: #111827;
                        border-bottom: 1.5px solid #E5E7EB;
                        padding-bottom: 4px;
                        margin: 20px 0 12px 0;
                    }

                    h3 {
                        font-size: 11pt;
                        font-weight: 700;
                        color: #111827;
                        margin: 0;
                        padding: 0;
                    }

                    .italic {
                        font-style: italic;
                        color: #4B5563;
                    }
                    
                    ul {
                        margin: 6px 0 16px 20px;
                        padding: 0;
                    }
                    li {
                        font-size: 10.5pt;
                        color: #374151;
                        margin-bottom: 2px;
                    }

                    .text-gray-700 {
                        color: #374151;
                        font-size: 10.5pt;
                    }

                    .text-gray-900 { color: #111827; }
                    .text-gray-600 { color: #4B5563; }
                    .text-gray-500 { color: #6B7280; }
                    
                    p { margin: 0 0 4px 0; }
                    
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

                    .page-break {
                        page-break-before: always;
                        break-before: page;
                    }
                    
                    section {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    
                    .resume-page {
                        page-break-after: always;
                        break-after: page;
                    }
                    
                    .resume-page:last-child {
                        page-break-after: auto;
                        break-after: auto;
                    }
                    
                    /* Hide page labels in PDF */
                    .resume-page > div:first-child {
                        display: none;
                    }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        // Launch puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ]
        });
        
        const page = await browser.newPage();
        
        // Set shorter timeout
        page.setDefaultTimeout(60000);
        page.setDefaultNavigationTimeout(60000);
        
        // Set content with simpler wait condition
        await page.setContent(fullHtml, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        // Wait for fonts to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
            }
        });
        
        await browser.close();

        // Return PDF - convert Uint8Array to Buffer
        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="resume.pdf"',
            },
        });
    } catch (error) {
        console.error("PDF generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate PDF" },
            { status: 500 }
        );
    }
}
