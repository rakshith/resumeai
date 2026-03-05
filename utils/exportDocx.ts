"use client";

import { saveAs } from "file-saver";
import { toast } from "sonner";
import { exportResumeToDocx } from "@/app/actions/exportResume";
import { ResumeData } from "@/lib/resumeData";

export async function exportToDocx(
  resume: ResumeData,
  filename: string = "resume.docx",
  resumeLength: "1" | "2" = "1"
): Promise<void> {
  if (!resume) {
    toast.error("No resume data available");
    return;
  }

  try {
    const blob = await exportResumeToDocx(resume, resumeLength);
    saveAs(blob, filename);
    toast.success("Resume exported successfully!");
  } catch (error) {
    console.error("DOCX export error:", error);
    toast.error("Failed to export resume. Please try again.");
    throw error;
  }
}
