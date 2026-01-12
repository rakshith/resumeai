import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-16 flex items-center border-b">
        <span className="font-bold text-lg">ResumeAI</span>
        <div className="ml-auto flex gap-4">
          <Link href="/pricing">
            <Button variant="ghost">Pricing</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight lg:text-7xl mb-6">
          Fix Your Resume for ATS.<br className="hidden sm:inline" /> Get More Interviews.
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
          Upload your resume and optimize it for applicant tracking systems in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8">
              Fix My Resume
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 px-8">
              View Pricing
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h3 className="font-semibold text-xl mb-2">ATS-Optimized</h3>
            <p className="text-muted-foreground">Rewrites your resume to pass automated filters.</p>
          </div>
          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h3 className="font-semibold text-xl mb-2">For Software Engineers</h3>
            <p className="text-muted-foreground">Tailored specifically for tech roles and keywords.</p>
          </div>
          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h3 className="font-semibold text-xl mb-2">Instant Export</h3>
            <p className="text-muted-foreground">Download as PDF or DOCX immediately.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
