"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  errorText?: string;
  max?: number;
}

export function TagInput({ label, value, onChange, placeholder, errorText, max = 20 }: TagInputProps) {
  const [draft, setDraft] = React.useState("");

  function addTag() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      setDraft("");
      return;
    }
    if (value.length >= max) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-sm font-medium leading-none text-foreground">{label}</label>}
      <div
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-white px-2.5 py-2 shadow-sm focus-within:ring-2 focus-within:ring-ring",
          errorText && "border-destructive focus-within:ring-destructive"
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="rounded-full hover:bg-primary/20"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-[100px] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {errorText && <p className="text-xs text-destructive">{errorText}</p>}
      <p className="text-xs text-muted-foreground">Press Enter or comma to add</p>
    </div>
  );
}