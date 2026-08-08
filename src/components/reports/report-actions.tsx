"use client";

import { useState } from "react";
import { Download, Printer, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface ReportActionsProps {
  recommendationId: string;
  pdfPath?: string | null;
}

export function ReportActions({
  recommendationId,
  pdfPath = null,
}: ReportActionsProps) {
  const { showToast } = useToast();
  const [isPrinting, setIsPrinting] = useState(false);

  function handlePrint() {
    setIsPrinting(true);

    // Give the browser a moment to update the printing state
    // before opening the print dialog.
    window.setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  }

  function handleDownloadUnavailable() {
    showToast(
      `PDF for report ${recommendationId} is still being generated — try again in a moment, or use Print instead.`,
      "error"
    );
  }

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      {pdfPath ? (
        <Button
          variant="primary"
          size="md"
          leftIcon={<Download className="h-4 w-4" />}
          asChild
        >
          <a
            href={pdfPath}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF
          </a>
        </Button>
      ) : (
        <Button
          variant="primary"
          size="md"
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onClick={handleDownloadUnavailable}
        >
          PDF Pending
        </Button>
      )}

      <Button
        variant="outline"
        size="md"
        leftIcon={<Printer className="h-4 w-4" />}
        onClick={handlePrint}
        loading={isPrinting}
      >
        Print
      </Button>
    </div>
  );
}