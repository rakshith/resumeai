"use client"

import { useState, useRef } from "react"
import { PromptBox } from "@/components/PromptBox"
import { ResumePreview } from "@/components/ResumePreview"
import { ExportActions } from "@/components/ExportActions"
import { ATSInsightsDialog, ATSInsightsButton } from "@/components/ATSInsightsDialog"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { ResumeJSON, ATSInsights as ATSInsightsType } from "@/app/actions/optimizeResume"

export default function Dashboard() {
    const [resumeData, setResumeData] = useState<ResumeJSON | null>(null)
    const [atsInsights, setAtsInsights] = useState<ATSInsightsType | null>(null)
    const [showInsights, setShowInsights] = useState(false)
    const [showFullscreenResume, setShowFullscreenResume] = useState(false)
    const printRef = useRef<HTMLDivElement>(null)

    const handleOptimize = (resume: ResumeJSON, insights: ATSInsightsType) => {
        setResumeData(resume)
        setAtsInsights(insights)
        // Auto-open insights dialog after optimization
        setShowInsights(true)
    }

    return (
        <DashboardLayout>
            <div className="p-4 md:p-6 lg:p-8">
                {/* Page Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Optimize Your Resume
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">
                            AI-powered ATS optimization for modern roles
                        </p>
                    </div>

                    {/* Insights Button */}
                    {atsInsights && (
                        <ATSInsightsButton onClick={() => setShowInsights(true)} />
                    )}
                </div>

                {/* Main Content - Vertical Stack */}
                <div className="space-y-8 max-w-4xl mx-auto">
                    {/* PromptBox Section */}
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <PromptBox onOptimize={handleOptimize} />
                    </div>

                    {/* Resume Preview Section */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                        <ResumePreview
                            resume={resumeData || undefined}
                            onMaximize={() => setShowFullscreenResume(true)}
                            printRef={printRef}
                        />
                    </div>

                    {/* Export Actions Section */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                        <ExportActions
                            resume={resumeData}
                            printRef={printRef}
                        />
                    </div>
                </div>

                {/* Fullscreen Resume Modal */}
                <Dialog open={showFullscreenResume} onOpenChange={setShowFullscreenResume}>
                    <DialogTitle></DialogTitle>
                    <DialogContent className="!max-w-[210mm] !w-[210mm] max-h-[90vh] p-0 overflow-y-auto scrollbar-glass bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl sm:rounded-2xl">
                        <div className="py-10 px-4 md:px-10 flex justify-center">
                            <ResumePreview
                                resume={resumeData || undefined}
                                isFullscreen={true}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                {/* ATS Insights Dialog */}
                {atsInsights && (
                    <ATSInsightsDialog
                        insights={atsInsights}
                        open={showInsights}
                        onOpenChange={setShowInsights}
                    />
                )}
            </div>
        </DashboardLayout>
    )
}
