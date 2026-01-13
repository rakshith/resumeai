"use client"

import * as React from "react"
import { optimizeResume, type ResumeJSON, type ATSInsights } from "@/app/actions/optimizeResume"
import { parseResumeFile } from "@/app/actions/parseResumeFile"
import { chunkResumeText } from "@/app/actions/chunkResume"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Settings2, Paperclip, Zap, Loader2, Info } from "lucide-react"

interface PromptBoxProps {
    onOptimize?: (resume: ResumeJSON, insights: ATSInsights) => void
}

export function PromptBox({ onOptimize }: PromptBoxProps) {
    const [file, setFile] = React.useState<File | null>(null)
    const [resumeText, setResumeText] = React.useState("")
    const [goal, setGoal] = React.useState("fix")
    const [targetRole, setTargetRole] = React.useState("")
    const [jobDescription, setJobDescription] = React.useState("")
    const [experienceLevel, setExperienceLevel] = React.useState("")
    const [resumeLength, setResumeLength] = React.useState<"1" | "2">("1")
    const [tone, setTone] = React.useState("professional")
    const [isLoading, setIsLoading] = React.useState(false)
    const [isParsing, setIsParsing] = React.useState(false)
    const [isChunking, setIsChunking] = React.useState(false)
    const [showAdvanced, setShowAdvanced] = React.useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const uploadedFile = e.target.files[0]
            setFile(uploadedFile)
            setResumeText("")

            setIsParsing(true)
            try {
                const extractedText = await parseResumeFile(uploadedFile)
                setResumeText(extractedText)
            } catch (error) {
                alert(error instanceof Error ? error.message : "Failed to parse file")
                setFile(null)
                setResumeText("")
                e.target.value = ""
            } finally {
                setIsParsing(false)
            }
        }
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResumeText(e.target.value)
        if (e.target.value.length > 0) {
            setFile(null)
        }
    }

    const isFileUploadDisabled = resumeText.length > 0 && file === null
    const isTextDescriptionDisabled = file !== null

    const hasContent = resumeText.trim().length > 0
    const isFormValid = hasContent && goal && !isParsing

    const handleSubmit = async () => {
        if (!isFormValid || isLoading) return

        setIsLoading(true)
        try {
            const isLongResume = resumeText.length > 8000
            let result

            if (isLongResume) {
                setIsChunking(true)
                const factualData = await chunkResumeText(resumeText)
                setIsChunking(false)

                result = await optimizeResume({
                    factualData,
                    goal,
                    targetRole,
                    jobDescription,
                    experienceLevel,
                    resumeLength,
                    tone,
                })
            } else {
                result = await optimizeResume({
                    resumeText,
                    goal,
                    targetRole,
                    jobDescription,
                    experienceLevel,
                    resumeLength,
                    tone,
                })
            }

            if (onOptimize) {
                onOptimize(result.resume, result.ats_insights)
            }
        } catch (error) {
            console.error("Failed to optimize resume:", error)
        } finally {
            setIsChunking(false)
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full border shadow-lg overflow-hidden bg-card rounded-2xl py-0">
            <CardContent className="p-0">
                <div className="flex flex-col">
                    {/* Main Input Area */}
                    <div className="p-4 md:p-5 space-y-4">
                        <Textarea
                            id="resume-text"
                            placeholder="Paste your resume here or upload a file..."
                            className="min-h-[80px] md:min-h-[100px] w-full resize-none border-0 bg-transparent p-0 text-base md:text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 leading-relaxed"
                            value={resumeText}
                            onChange={handleTextChange}
                            disabled={isTextDescriptionDisabled}
                        />

                        {/* File Chip */}
                        {file && (
                            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 w-fit animate-in fade-in slide-in-from-left-2 duration-300">
                                <Paperclip className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold text-primary truncate max-w-[250px]">
                                    {file.name}
                                </span>
                                <button
                                    onClick={() => { setFile(null); setResumeText(""); }}
                                    className="ml-1 hover:bg-primary/20 rounded-full p-1 transition-colors"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-between px-4 border-t py-2 border-border/50 bg-muted/30">
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* File Upload Trigger */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`rounded-xl h-10 w-10 p-0 hover:bg-background/80 ${isFileUploadDisabled ? 'opacity-50' : ''}`}
                                asChild
                            >
                                <label className="cursor-pointer">
                                    <Paperclip className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={isFileUploadDisabled}
                                    />
                                </label>
                            </Button>

                            {/* Settings Trigger - Now Modal */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAdvanced(true)}
                                className="rounded-xl h-10 px-3 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all"
                            >
                                <Settings2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Settings</span>
                                {(targetRole || experienceLevel || jobDescription) && (
                                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                                )}
                            </Button>

                            {/* Quick Goal Toggle (Always Visible) */}
                            <div className="flex items-center gap-0.5 sm:gap-1 px-1 py-1 rounded-xl bg-background border border-border/50 ml-1 sm:ml-2">
                                <button
                                    type="button"
                                    onClick={() => setGoal("fix")}
                                    className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all ${goal === "fix"
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    Fix ATS
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGoal("generate")}
                                    className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all ${goal === "generate"
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    Generate
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            className="rounded-2xl px-6 h-10 font-black bg-primary hover:bg-primary/90 shadow-lg transition-all gap-2 active:scale-95"
                            disabled={!isFormValid || isLoading || isParsing}
                            onClick={handleSubmit}
                        >
                            {(isParsing || isChunking || isLoading) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Zap className="w-4 h-4 fill-current" />
                            )}
                            <span className="text-xs uppercase tracking-tighter">
                                {isParsing ? "Parsing" : isChunking ? "Analyzing" : isLoading ? "Optimizing" : "Optimize Resume"}
                            </span>
                        </Button>
                    </div>
                </div>

                {/* Advanced Settings Modal */}
                <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
                    <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
                        <DialogHeader className="px-6 py-5 bg-muted/30 border-b border-border/50">
                            <DialogTitle className="text-xl font-black flex items-center gap-2.5">
                                <Settings2 className="w-5 h-5 text-primary" />
                                Optimization Settings
                            </DialogTitle>
                        </DialogHeader>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                {/* Target Role */}
                                <div className="space-y-2">
                                    <Label htmlFor="target-role" className="text-[10px] uppercase tracking-[0.1em] font-black text-muted-foreground flex items-center gap-1.5 px-0.5">
                                        Target Role
                                        <Info className="w-3 h-3 text-muted-foreground/40" />
                                    </Label>
                                    <Input
                                        id="target-role"
                                        placeholder="e.g. Frontend Engineer"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        className="h-10 rounded-xl focus-visible:ring-primary shadow-sm"
                                    />
                                </div>

                                {/* Experience Level */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-[0.1em] font-black text-muted-foreground px-0.5">Experience Level</Label>
                                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                                        <SelectTrigger className="h-10 rounded-xl shadow-sm">
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="fresher">Fresher / Junior</SelectItem>
                                            <SelectItem value="mid">Mid-level</SelectItem>
                                            <SelectItem value="senior">Senior</SelectItem>
                                            <SelectItem value="staff">Staff / Lead</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Tone */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-[0.1em] font-black text-muted-foreground px-0.5">Tone of Voice</Label>
                                    <Select value={tone} onValueChange={setTone}>
                                        <SelectTrigger className="h-10 rounded-xl shadow-sm">
                                            <SelectValue placeholder="Professional" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="professional">Professional</SelectItem>
                                            <SelectItem value="impact">Impact-driven</SelectItem>
                                            <SelectItem value="technical">Technical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Length */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-[0.1em] font-black text-muted-foreground px-0.5">Ideal Length</Label>
                                    <Select value={resumeLength} onValueChange={(v) => setResumeLength(v as "1" | "2")}>
                                        <SelectTrigger className="h-10 rounded-xl shadow-sm">
                                            <SelectValue placeholder="1 Page" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="1">1 Page</SelectItem>
                                            <SelectItem value="2">2 Pages</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="space-y-2">
                                <Label htmlFor="job-description" className="text-[10px] uppercase tracking-[0.1em] font-black text-muted-foreground px-0.5">Job Description (Highly Recommended)</Label>
                                <Textarea
                                    id="job-description"
                                    placeholder="Paste the target job description here for the best ATS matching results..."
                                    className="min-h-[120px] rounded-xl text-sm resize-none bg-muted/20 border-border/40 focus-visible:ring-primary p-4 leading-relaxed"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                            </div>

                            <Button
                                className="w-full h-11 rounded-2xl font-black uppercase tracking-widest text-xs"
                                onClick={() => setShowAdvanced(false)}
                            >
                                Save Settings
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}
