"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ObjectivesList, CreateObjectiveModal } from "@/components/learning";

export default function ObjectivesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Objectives</h1>
          <p className="text-muted-foreground mt-2">
            Manage your learning goals and track your progress
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          New Objective
        </Button>
      </div>

      {/* Objectives List */}
      <ObjectivesList onCreateClick={() => setShowCreateModal(true)} />

      {/* Create Modal */}
      <CreateObjectiveModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  );
}
