import type { Metadata } from "next"
import RepoAnalyticsDashboard from "@/components/repo-analytics-dashboard"

export const metadata: Metadata = {
  title: "Repository Analytics Dashboard",
  description: "Analytics dashboard for public GitHub repositories",
}

export default function Page() {
  return <RepoAnalyticsDashboard />
}

