"use server";

import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  Packer,
} from "docx";

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
  } | string>;
}

export async function exportResumeToDocx(
  resume: ResumeData,
  resumeLength: "1" | "2"
): Promise<Blob> {
  try {
    console.log("Starting DOCX generation for:", resume.name);

    // Split experience for 2-page layout
    const midIndex = Math.ceil(resume.experience.length / 2);
    const firstPageExperience =
      resumeLength === "2"
        ? resume.experience.slice(0, midIndex)
        : resume.experience;
    const secondPageExperience =
      resumeLength === "2" ? resume.experience.slice(midIndex) : [];

    // Helper to create section header
    const createSectionHeader = (text: string) =>
      new Paragraph({
        children: [
          new TextRun({
            text: text.toUpperCase(),
            bold: true,
            size: 20,
            font: "Arial",
            characterSpacing: 40,
          }),
        ],
        spacing: { after: 100 },
        border: {
          bottom: {
            color: "E5E7EB",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      });

    // Helper to create experience entry
    const createExperienceEntry = (exp: (typeof resume.experience)[0]) => [
      new Paragraph({
        children: [
          new TextRun({
            text: exp.role,
            bold: true,
            size: 22,
            font: "Arial",
          }),
        ],
        spacing: { after: 40 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: exp.company,
            italics: true,
            size: 22,
            font: "Arial",
            color: "4B5563",
          }),
          new TextRun({ text: "    " }),
          new TextRun({
            text: exp.duration,
            bold: true,
            size: 20,
            font: "Arial",
            color: "6B7280",
          }),
        ],
        spacing: { after: 80 },
      }),
      ...exp.bullets.map(
        (bullet) =>
          new Paragraph({
            children: [
              new TextRun({
                text: "• ",
                size: 21,
                font: "Arial",
              }),
              new TextRun({
                text: bullet,
                size: 21,
                font: "Arial",
                color: "374151",
              }),
            ],
            spacing: { after: 40 },
            indent: { left: 360 },
          })
      ),
    ];

    // Build first page content
    const firstPageContent: Paragraph[] = [
      // Header - Name
      new Paragraph({
        children: [
          new TextRun({
            text: resume.name.toUpperCase(),
            bold: true,
            size: 44,
            font: "Arial",
            characterSpacing: 20,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
      }),
      // Title
      new Paragraph({
        children: [
          new TextRun({
            text: resume.title,
            size: 22,
            font: "Arial",
            color: "4B5563",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),
      // Contact Info
      new Paragraph({
        children: [
          ...(resume.email
            ? [
                new TextRun({
                  text: resume.email,
                  size: 20,
                  font: "Arial",
                  color: "6B7280",
                }),
              ]
            : []),
          ...(resume.phone
            ? [
                new TextRun({
                  text: resume.email ? "  •  " : "",
                  size: 20,
                  font: "Arial",
                  color: "D1D5DB",
                }),
                new TextRun({
                  text: resume.phone,
                  size: 20,
                  font: "Arial",
                  color: "6B7280",
                }),
              ]
            : []),
          ...(resume.location
            ? [
                new TextRun({
                  text: resume.email || resume.phone ? "  •  " : "",
                  size: 20,
                  font: "Arial",
                  color: "D1D5DB",
                }),
                new TextRun({
                  text: resume.location,
                  size: 20,
                  font: "Arial",
                  color: "6B7280",
                }),
              ]
            : []),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      // Separator line
      new Paragraph({
        border: {
          bottom: {
            color: "E5E7EB",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
        spacing: { after: 200 },
      }),
      // Summary Section
      createSectionHeader("Professional Summary"),
      new Paragraph({
        children: [
          new TextRun({
            text: resume.summary,
            size: 21,
            font: "Arial",
            color: "374151",
          }),
        ],
        spacing: { after: 200 },
      }),
      // Skills Section
      createSectionHeader("Technical Skills"),
      new Paragraph({
        children: resume.skills.flatMap((skill, index) => [
          new TextRun({
            text: skill,
            size: 21,
            font: "Arial",
            color: "374151",
          }),
          ...(index < resume.skills.length - 1
            ? [
                new TextRun({
                  text: "  |  ",
                  size: 21,
                  font: "Arial",
                  color: "D1D5DB",
                }),
              ]
            : []),
        ]),
        spacing: { after: 200 },
      }),
    ];

    // Add experience to first page
    if (resumeLength === "1") {
      firstPageContent.push(createSectionHeader("Professional Experience"));
      resume.experience.forEach((exp) => {
        firstPageContent.push(...createExperienceEntry(exp));
        firstPageContent.push(new Paragraph({ spacing: { after: 160 } }));
      });

      // Projects
      if (resume.projects && resume.projects.length > 0) {
        firstPageContent.push(createSectionHeader("Key Projects"));
        resume.projects.forEach((project) => {
          firstPageContent.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "• ",
                  size: 21,
                  font: "Arial",
                }),
                new TextRun({
                  text: project,
                  size: 21,
                  font: "Arial",
                  color: "374151",
                }),
              ],
              spacing: { after: 60 },
              indent: { left: 360 },
            })
          );
        });
        firstPageContent.push(new Paragraph({ spacing: { after: 200 } }));
      }

      // Education
      firstPageContent.push(createSectionHeader("Education"));
      resume.education.forEach((edu) => {
        if (typeof edu === "string") {
          firstPageContent.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu,
                  size: 21,
                  font: "Arial",
                  color: "374151",
                }),
              ],
            })
          );
        } else {
          firstPageContent.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree,
                  bold: true,
                  size: 22,
                  font: "Arial",
                  color: "111827",
                }),
                new TextRun({
                  text: " — ",
                  size: 22,
                  font: "Arial",
                  color: "4B5563",
                }),
                new TextRun({
                  text: edu.institution,
                  size: 22,
                  font: "Arial",
                  color: "4B5563",
                }),
                new TextRun({ text: "    " }),
                new TextRun({
                  text: edu.year,
                  bold: true,
                  size: 20,
                  font: "Arial",
                  color: "6B7280",
                }),
              ],
              spacing: { after: 80 },
            })
          );
        }
      });
    } else {
      // 2-page: Add first half of experience to page 1
      firstPageContent.push(createSectionHeader("Professional Experience"));
      firstPageExperience.forEach((exp) => {
        firstPageContent.push(...createExperienceEntry(exp));
        firstPageContent.push(new Paragraph({ spacing: { after: 160 } }));
      });
    }

    // Build second page content (for 2-page resumes)
    const secondPageContent: Paragraph[] = [];
    if (resumeLength === "2") {
      // Continue experience on page 2
      secondPageExperience.forEach((exp) => {
        secondPageContent.push(...createExperienceEntry(exp));
        secondPageContent.push(new Paragraph({ spacing: { after: 160 } }));
      });

      // Projects
      if (resume.projects && resume.projects.length > 0) {
        secondPageContent.push(createSectionHeader("Key Projects"));
        resume.projects.forEach((project) => {
          secondPageContent.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "• ",
                  size: 21,
                  font: "Arial",
                }),
                new TextRun({
                  text: project,
                  size: 21,
                  font: "Arial",
                  color: "374151",
                }),
              ],
              spacing: { after: 60 },
              indent: { left: 360 },
            })
          );
        });
        secondPageContent.push(new Paragraph({ spacing: { after: 200 } }));
      }

      // Education
      secondPageContent.push(createSectionHeader("Education"));
      resume.education.forEach((edu) => {
        if (typeof edu === "string") {
          secondPageContent.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu,
                  size: 21,
                  font: "Arial",
                  color: "374151",
                }),
              ],
            })
          );
        } else {
          secondPageContent.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree,
                  bold: true,
                  size: 22,
                  font: "Arial",
                  color: "111827",
                }),
                new TextRun({
                  text: " — ",
                  size: 22,
                  font: "Arial",
                  color: "4B5563",
                }),
                new TextRun({
                  text: edu.institution,
                  size: 22,
                  font: "Arial",
                  color: "4B5563",
                }),
                new TextRun({ text: "    " }),
                new TextRun({
                  text: edu.year,
                  bold: true,
                  size: 20,
                  font: "Arial",
                  color: "6B7280",
                }),
              ],
              spacing: { after: 80 },
            })
          );
        }
      });
    }

    // Combine all content
    const allContent: Paragraph[] = [...firstPageContent];
    if (resumeLength === "2") {
      // Add page break as a paragraph
      allContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "",
              break: 1,
            }),
          ],
          pageBreakBefore: true,
        })
      );
      allContent.push(...secondPageContent);
    }

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.75),
                right: convertInchesToTwip(0.75),
                bottom: convertInchesToTwip(0.75),
                left: convertInchesToTwip(0.75),
              },
            },
          },
          children: allContent,
        },
      ],
    });

    // Generate blob
    console.log("Generating DOCX buffer...");
    const buffer = await Packer.toBuffer(doc);
    console.log("Buffer generated, size:", buffer.byteLength);
    
    const uint8Array = new Uint8Array(buffer);
    return new Blob([uint8Array], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
  } catch (error) {
    console.error("DOCX generation error:", error);
    throw error;
  }
}
