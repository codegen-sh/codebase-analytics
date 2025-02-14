import type { Metadata } from "next"
import RepoAnalyticsDashboard from "@/components/repo-analytics-dashboard"

export const metadata: Metadata = {
  title: "Codebase Analytics",
  description: "Analytics dashboard for public GitHub repositories",
}

export default function Page() {
  return <RepoAnalyticsDashboard />
}

