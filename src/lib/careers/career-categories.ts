import type { LucideIcon } from "lucide-react";
import {
  Cpu,
  Briefcase,
  HeartPulse,
  Cog,
  FlaskConical,
  GraduationCap,
  Palette,
  Landmark,
  Scale,
  Hammer,
  Building2,
  Trophy,
  UtensilsCrossed,
  Megaphone,
} from "lucide-react";

export interface CareerCategoryMeta {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const CAREER_CATEGORIES: CareerCategoryMeta[] = [
  { id: "technology", name: "Technology", icon: Cpu },
  { id: "business", name: "Business", icon: Briefcase },
  { id: "healthcare", name: "Healthcare", icon: HeartPulse },
  { id: "engineering", name: "Engineering", icon: Cog },
  { id: "science", name: "Science", icon: FlaskConical },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "creative", name: "Creative", icon: Palette },
  { id: "finance", name: "Finance", icon: Landmark },
  { id: "law", name: "Law", icon: Scale },
  { id: "trades", name: "Trades", icon: Hammer },
  { id: "government", name: "Government", icon: Building2 },
  { id: "sports", name: "Sports", icon: Trophy },
  { id: "hospitality", name: "Hospitality", icon: UtensilsCrossed },
  { id: "marketing", name: "Marketing", icon: Megaphone },
];

export function getCategoryById(id: string): CareerCategoryMeta | undefined {
  return CAREER_CATEGORIES.find((c) => c.id === id);
}