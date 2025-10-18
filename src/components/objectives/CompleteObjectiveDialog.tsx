"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2 } from "lucide-react";

interface CompleteObjectiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (completionNotes?: string) => Promise<void>;
  objectiveTitle: string;
  isLoading?: boolean;
}

export function CompleteObjectiveDialog({
  open,
  onOpenChange,
  onConfirm,
  objectiveTitle,
  isLoading = false,
}: CompleteObjectiveDialogProps) {
  const t = useTranslations("CompleteObjectiveDialog");
  const [completionNotes, setCompletionNotes] = useState("");

  const handleConfirm = async () => {
    await onConfirm(completionNotes.trim() || undefined);
    setCompletionNotes("");
  };

  const handleCancel = () => {
    setCompletionNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-xl">{t("title")}</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            {t("description", { objective: objectiveTitle })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="completion-notes" className="text-sm font-medium">
              {t("notesLabel")}
            </label>
            <Textarea
              id="completion-notes"
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder={t("notesPlaceholder")}
              rows={4}
              className="resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">{t("notesHint")}</p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">{t("whatHappens")}</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>{t("effect1")}</li>
              <li>{t("effect2")}</li>
              <li>{t("effect3")}</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {t("cancelButton")}
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("completing")}
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {t("confirmButton")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
