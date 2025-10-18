"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ObjectivesList, CreateObjectiveModal } from "@/components/learning";

export default function ObjectivesPage() {
  const t = useTranslations("Objectives");
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("page.title", { default: "Learning Objectives" })}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            {t("page.description", {
              default: "Manage your learning goals and track your progress",
            })}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} size="lg" className="w-full sm:w-auto">
          <Plus className="h-5 w-5 mr-2" />
          {t("page.newObjective", { default: "New Objective" })}
        </Button>
      </div>

      {/* Objectives List */}
      <ObjectivesList onCreateClick={() => setShowCreateModal(true)} />

      {/* Create Modal */}
      <CreateObjectiveModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  );
}
