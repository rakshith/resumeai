export interface ResumeData {
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
    }> | string[];
}

export const dummyResume: ResumeData = {
    name: "John Doe",
    title: "Frontend Engineer",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    summary:
        "Frontend engineer with 5+ years of experience building scalable web applications using React, TypeScript, and modern frontend tooling. Passionate about creating exceptional user experiences and mentoring junior developers.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "REST APIs", "GraphQL", "Node.js", "Git"],
    experience: [
        {
            company: "Acme Corp",
            role: "Senior Frontend Engineer",
            duration: "2021 – Present",
            bullets: [
                "Led the development of a customer-facing dashboard serving 50K+ daily active users",
                "Built and maintained 20+ reusable UI components using React and TypeScript",
                "Improved application performance by 40% through rendering optimizations",
                "Collaborated with backend engineers to integrate REST and GraphQL APIs"
            ]
        },
        {
            company: "StartupXYZ",
            role: "Frontend Developer",
            duration: "2019 – 2021",
            bullets: [
                "Developed responsive web applications using React and Redux",
                "Implemented automated testing reducing bug reports by 30%",
                "Worked directly with designers to ensure pixel-perfect implementations"
            ]
        }
    ],
    projects: [
        "Internal analytics dashboard with real-time data visualization",
        "Public-facing marketing website using Next.js and Vercel"
    ],
    education: [
        {
            degree: "B.Tech in Computer Science",
            institution: "XYZ University",
            year: "2019"
        }
    ]
};
