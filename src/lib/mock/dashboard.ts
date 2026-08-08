import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, UserCircle, Users, ClipboardCheck, Briefcase, Map, FileText, Bot, CreditCard, Settings } from "lucide-react";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const SIDEBAR_NAV: SidebarNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/dashboard/profile", icon: UserCircle },
  { label: "Children", href: "/dashboard/children", icon: Users },
  { label: "Career Assessment", href: "/dashboard/assessment", icon: ClipboardCheck },
  { label: "Careers", href: "/dashboard/careers", icon: Briefcase },
  { label: "Learning Roadmap", href: "/dashboard/roadmap", icon: Map },
  { label: "AI Reports", href: "/dashboard/reports", icon: FileText },
  { label: "AI Assistant", href: "/dashboard/ai-assistant", icon: Bot },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];