"use client";

import * as React from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type AvatarSelection = File | "remove" | null;

interface AvatarUploadProps {
  currentImage: string | null;
  fallback: string;
  /** null = no change from the current image; "remove" = explicitly clear it; File = replace it. */
  onSelectionChange: (selection: AvatarSelection) => void;
}

export function AvatarUpload({ currentImage, fallback, onSelectionChange }: AvatarUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(currentImage);
  const [error, setError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const objectUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function validateAndSet(file: File) {
    setError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, or WebP images are allowed");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Image must be under 5MB");
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    setPreview(url);
    onSelectionChange(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSet(file);
  }

  function handleRemove() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreview(null);
    setError(null);
    onSelectionChange("remove");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div id="avatar" className="space-y-2">
      <Typography variant="bodySmall" className="font-medium text-foreground">
        Profile photo
      </Typography>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex items-center gap-5 rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-5 transition-colors",
          isDragging && "border-primary bg-primary/5"
        )}
      >
        {preview ? (
          <Avatar alt="Profile preview" fallback={fallback} src={preview} size="xl" />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-secondary">
            <ImageIcon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </span>
        )}

        <div className="flex-1">
          <Typography variant="bodySmall" className="text-muted-foreground">
            Drag & drop an image, or{" "}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="font-medium text-primary hover:underline"
            >
              browse
            </button>
          </Typography>
          <Typography variant="caption" className="mt-1 block text-muted-foreground">
            JPEG, PNG, or WebP — up to 5MB
          </Typography>

          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
            >
              <X className="h-3 w-3" /> Remove image
            </button>
          )}
        </div>

        <Upload className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) validateAndSet(file);
        }}
      />

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}