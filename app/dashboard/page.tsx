"use client"

import { useState } from "react"
import { PromptBox } from "@/components/PromptBox"
import { ResumePreview } from "@/components/ResumePreview"
import { ATSInsights } from "@/components/ATSInsights"
import type { ResumeJSON, ATSInsights as ATSInsightsType } from "@/app/actions/optimizeResume"

export default function Dashboard() {
    const [resumeData, setResumeData] = useState<ResumeJSON | null>(null)
    const [atsInsights, setAtsInsights] = useState<ATSInsightsType | null>(null)

    const handleOptimize = (resume: ResumeJSON, insights: ATSInsightsType) => {
        setResumeData(resume)
        setAtsInsights(insights)
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column - PromptBox (40% width on desktop) */}
                <div className="w-full md:w-[40%]">
                    <PromptBox onOptimize={handleOptimize} />
                </div>

                {/* Right Column - Resume Preview (60% width on desktop) */}
                <div className="w-full md:w-[60%] space-y-6">
                    <ResumePreview resume={resumeData || undefined} />

                    {/* ATS Insights - Only show if we have insights */}
                    {atsInsights && (
                        <ATSInsights
                            insights={atsInsights}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
