"use client";

import { useState } from "react";
import { useCreateObjective } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import type { CreateObjectiveInput } from "@/models/learning";

interface CreateObjectiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateObjectiveModal({ open, onOpenChange }: CreateObjectiveModalProps) {
  const createObjective = useCreateObjective();

  const [formData, setFormData] = useState<CreateObjectiveInput>({
    title: "",
    description: "",
    successCriteria: [],
    requiredSkills: [],
    priority: 3,
  });

  const [currentCriterion, setCurrentCriterion] = useState("");
  const [currentSkill, setCurrentSkill] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createObjective.mutateAsync(formData);
      toast.success("Objective created successfully!", {
        description: "Your learning objective has been created.",
      });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error("Failed to create objective", {
        description: error.message || "Please try again.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      successCriteria: [],
      requiredSkills: [],
      priority: 3,
    });
    setCurrentCriterion("");
    setCurrentSkill("");
    setErrors({});
  };

  const handleAddCriterion = () => {
    if (currentCriterion.trim()) {
      setFormData({
        ...formData,
        successCriteria: [...(formData.successCriteria || []), currentCriterion.trim()],
      });
      setCurrentCriterion("");
    }
  };

  const handleRemoveCriterion = (index: number) => {
    setFormData({
      ...formData,
      successCriteria: formData.successCriteria?.filter((_, i) => i !== index) || [],
    });
  };

  const handleAddSkill = () => {
    if (currentSkill.trim()) {
      setFormData({
        ...formData,
        requiredSkills: [...(formData.requiredSkills || []), currentSkill.trim()],
      });
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Learning Objective</DialogTitle>
          <DialogDescription>
            Define your learning goal and we&apos;ll help you create a personalized roadmap.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              placeholder="e.g., Master Java Backend Development"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what you want to learn and why..."
              rows={3}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((priority) => (
                <Button
                  key={priority}
                  type="button"
                  variant={formData.priority === priority ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData({ ...formData, priority })}
                  className="flex-1"
                >
                  {"⭐".repeat(priority)}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Higher priority objectives will be recommended first
            </p>
          </div>

          {/* Success Criteria */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Success Criteria</label>
            <div className="flex gap-2">
              <Input
                value={currentCriterion}
                onChange={(e) => setCurrentCriterion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCriterion();
                  }
                }}
                placeholder="e.g., Build a REST API"
              />
              <Button type="button" onClick={handleAddCriterion} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.successCriteria && formData.successCriteria.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.successCriteria.map((criterion, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {criterion}
                    <button
                      type="button"
                      onClick={() => handleRemoveCriterion(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Required Skills</label>
            <div className="flex gap-2">
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="e.g., Java, Spring Boot"
              />
              <Button type="button" onClick={handleAddSkill} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.requiredSkills && formData.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              disabled={createObjective.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createObjective.isPending}>
              {createObjective.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                "Create Objective"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
