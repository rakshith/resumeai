"use client"

import * as React from "react"
import { optimizeResume, type ResumeJSON, type ATSInsights } from "@/app/actions/optimizeResume"
import { parseResumeFile } from "@/app/actions/parseResumeFile"
import { chunkResumeText } from "@/app/actions/chunkResume"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const uploadedFile = e.target.files[0]
            setFile(uploadedFile)
            setResumeText("") // Clear text initially

            // Parse the file
            setIsParsing(true)
            try {
                const extractedText = await parseResumeFile(uploadedFile)
                setResumeText(extractedText)
            } catch (error) {
                // Show error and clear file
                alert(error instanceof Error ? error.message : "Failed to parse file")
                setFile(null)
                setResumeText("")
                // Reset file input
                e.target.value = ""
            } finally {
                setIsParsing(false)
            }
        }
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResumeText(e.target.value)
        if (e.target.value.length > 0) {
            setFile(null) // Clear file if text is typed (mutual exclusivity)
        }
    }

    // UX Logic: Mutual Exclusivity
    const isFileUploadDisabled = resumeText.length > 0 && file === null
    const isTextDescriptionDisabled = file !== null

    // UX Logic: CTA Enable/Disable
    const hasContent = resumeText.trim().length > 0
    const isFormValid = hasContent && goal && !isParsing

    const handleSubmit = async () => {
        if (!isFormValid || isLoading) return

        setIsLoading(true)
        try {
            // Check if resume is long and needs chunking
            const isLongResume = resumeText.length > 8000
            let result

            if (isLongResume) {
                // Pass 1: Extract facts from chunks
                setIsChunking(true)
                const factualData = await chunkResumeText(resumeText)
                setIsChunking(false)

                // Pass 2: Optimize using factual data
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
                // Direct optimization for short resumes
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
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    Optimize Your Resume for ATS
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* 1. Resume Input Section */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="resume-upload">Upload Resume</Label>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4">
                                <Input
                                    id="resume-upload"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="cursor-pointer"
                                    onChange={handleFileChange}
                                    disabled={isFileUploadDisabled}
                                // Reset file input if file is null (this is a bit tricky with file inputs, but key prop can force remount or we just accept the state drift visually if not handled via ref)
                                // For now, we will use a key based on file presence to force reset if needed, or just let it be.
                                // Simpler approach: If disabled, it's visibly disabled.
                                />
                            </div>
                            {file && (
                                <p className="text-sm font-medium text-green-600">
                                    Uploaded: {file.name}
                                </p>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            PDF or DOCX supported
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                OR
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="resume-text">Paste Resume Text</Label>
                        <Textarea
                            id="resume-text"
                            placeholder="Paste your resume here..."
                            className="min-h-[120px] max-h-[300px] overflow-y-auto"
                            value={resumeText}
                            onChange={handleTextChange}
                            disabled={isTextDescriptionDisabled}
                        />
                    </div>
                </div>

                <Separator />

                {/* 2. Goal Selector */}
                <div className="space-y-3">
                    <Label>What do you want to do?</Label>
                    <RadioGroup
                        value={goal}
                        onValueChange={setGoal}
                        className="flex flex-col space-y-1"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fix" id="goal-fix" />
                            <Label htmlFor="goal-fix" className="font-normal">
                                Fix existing resume for ATS
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="generate" id="goal-generate" />
                            <Label htmlFor="goal-generate" className="font-normal">
                                Generate resume from prompt
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* 3. Target Role Input */}
                <div className="space-y-2">
                    <Label htmlFor="target-role">Target Role</Label>
                    <Input
                        id="target-role"
                        placeholder="e.g. Frontend Engineer"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                    />
                </div>

                {/* 4. Job Description Input (Optional) */}
                <div className="space-y-2">
                    <Label htmlFor="job-description">Job Description (Optional)</Label>
                    <Textarea
                        id="job-description"
                        placeholder="Paste the job description here..."
                        className="min-h-[100px]"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>

                {/* 5. Experience Level Selector */}
                <div className="space-y-2">
                    <Label>Experience Level</Label>
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fresher">Fresher / Junior</SelectItem>
                            <SelectItem value="mid">Mid-level</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                            <SelectItem value="staff">Staff / Lead</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 6. Resume Length Selector */}
                <div className="space-y-3">
                    <Label>Resume Length</Label>
                    <RadioGroup
                        value={resumeLength}
                        onValueChange={(value) => setResumeLength(value as "1" | "2")}
                        className="flex flex-row space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="length-1" />
                            <Label htmlFor="length-1" className="font-normal">
                                1 Page
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="length-2" />
                            <Label htmlFor="length-2" className="font-normal">
                                2 Pages
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* 7. Tone Selector */}
                <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="impact">Impact-driven</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 8. Primary CTA Button */}
                <Button
                    size="lg"
                    className="w-full text-lg font-semibold h-12"
                    disabled={!isFormValid || isLoading || isParsing}
                    onClick={handleSubmit}
                >
                    {isParsing ? "Parsing file…" : isChunking ? "Analyzing long resume…" : isLoading ? "Optimizing for ATS…" : "Fix My Resume for ATS"}
                </Button>
            </CardContent>
        </Card>
    )
}
