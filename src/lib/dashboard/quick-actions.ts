import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  Map,
  FileText,
  UserCircle,
  Bot,
  CreditCard,
} from "lucide-react";

export interface QuickActionData {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export const QUICK_ACTIONS: QuickActionData[] = [
  {
    id: "start-assessment",
    title: "Start Assessment",
    description: "Begin a new strengths and interests assessment.",
    href: "/dashboard/assessment",
    icon: ClipboardCheck,
  },
  {
    id: "resume-roadmap",
    title: "Resume Roadmap",
    description: "Continue where you left off on the learning roadmap.",
    href: "/dashboard/roadmap",
    icon: Map,
  },
  {
    id: "view-report",
    title: "View AI Report",
    description: "See the latest AI-generated insights and analysis.",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    id: "update-profile",
    title: "Update Profile",
    description: "Keep your child's profile current for better recommendations.",
    href: "/dashboard/profile",
    icon: UserCircle,
  },
  {
    id: "ask-assistant",
    title: "Ask AI Assistant",
    description: "Get quick answers about your child's results and recommendations.",
    href: "/dashboard/ai-assistant",
    icon: Bot,
  },
  {
    id: "manage-subscription",
    title: "Manage Subscription",
    description: "View your plan, upgrade, or check billing history.",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
];