"use client";

import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "Uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
  { label: "Special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const passedCount = RULES.filter((rule) => rule.test(password)).length;
  const strength = passedCount / RULES.length;

  const strengthLabel =
    strength === 0 ? "" : strength < 0.5 ? "Weak" : strength < 1 ? "Medium" : "Strong";
  const strengthColor =
    strength < 0.5 ? "bg-destructive" : strength < 1 ? "bg-warning" : "bg-success";

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        {RULES.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full bg-secondary transition-colors duration-300",
              i < Math.ceil(strength * RULES.length) && strengthColor
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <span
              key={rule.label}
              className={cn(
                "text-xs transition-colors",
                passed ? "text-success" : "text-muted-foreground"
              )}
            >
              {passed ? "✓" : "○"} {rule.label}
            </span>
          );
        })}
      </div>
      {strengthLabel && (
        <p className="text-xs font-medium text-muted-foreground">
          Strength: <span className="text-foreground">{strengthLabel}</span>
        </p>
      )}
    </div>
  );
}