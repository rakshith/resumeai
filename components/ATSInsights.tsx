import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react"; // Assuming lucide-react is available, or use text if not
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ATSInsightsProps {
    insights: {
        rejection_reasons: string[];
        fixes_applied: string[];
    };
}

export function ATSInsights({ insights }: ATSInsightsProps) {
    const [isOpen, setIsOpen] = React.useState(true);

    return (
        <Card className="w-full mt-6 border-l-4 border-l-blue-500 shadow-sm">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            ATS Insights
                        </CardTitle>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-9 p-0">
                                {isOpen ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent className="space-y-6">
                        {/* Why Rejected */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-red-600 flex items-center gap-2">
                                ⚠️ Why Your Resume Was Getting Rejected
                            </h3>
                            <ul className="list-disc list-outside ml-5 space-y-1 text-sm text-muted-foreground">
                                {insights.rejection_reasons.map((reason, i) => (
                                    <li key={i}>{reason}</li>
                                ))}
                            </ul>
                        </div>

                        {/* What We Fixed */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-green-600 flex items-center gap-2">
                                ✅ What We Fixed
                            </h3>
                            <ul className="list-disc list-outside ml-5 space-y-1 text-sm text-muted-foreground">
                                {insights.fixes_applied.map((fix, i) => (
                                    <li key={i}>{fix}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
