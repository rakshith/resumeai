"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ATSInsightsDialogProps {
    insights: {
        rejection_reasons: string[]
        fixes_applied: string[]
    }
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function ATSInsightsDialog({ insights, open, onOpenChange }: ATSInsightsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        ATS Insights
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Why Rejected */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-red-600 flex items-center gap-2 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Why Your Resume Was Getting Rejected
                        </h3>
                        <ul className="space-y-2">
                            {insights.rejection_reasons.map((reason, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-muted-foreground bg-red-50 dark:bg-red-950/20 p-3 rounded-lg"
                                >
                                    <span className="text-red-500 mt-0.5">•</span>
                                    {reason}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* What We Fixed */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-green-600 flex items-center gap-2 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            What We Fixed
                        </h3>
                        <ul className="space-y-2">
                            {insights.fixes_applied.map((fix, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-muted-foreground bg-green-50 dark:bg-green-950/20 p-3 rounded-lg"
                                >
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    {fix}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Trigger button component for easy use
export function ATSInsightsButton({ onClick }: { onClick: () => void }) {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            className="gap-2"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View ATS Insights
        </Button>
    )
}
