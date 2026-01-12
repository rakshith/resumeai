import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Pricing() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-6 h-16 flex items-center border-b">
                <Link href="/" className="font-bold text-lg">ResumeAI</Link>
                <div className="ml-auto flex gap-4">
                    <Link href="/dashboard">
                        <Button variant="outline">Dashboard</Button>
                    </Link>
                </div>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center p-8">
                <h1 className="text-3xl font-bold mb-4">Pricing</h1>
                <p className="text-muted-foreground">Pricing will be available soon.</p>
            </main>
        </div>
    );
}
