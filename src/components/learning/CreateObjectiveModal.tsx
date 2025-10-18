"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import { X, Plus, Flag, TrendingUp, Zap, Flame, Rocket } from "lucide-react";
import { toast } from "sonner";
import type { CreateObjectiveInput } from "@/models/learning";

interface CreateObjectiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function CreateObjectiveModal({ open, onOpenChange, onCreated }: CreateObjectiveModalProps) {
  const t = useTranslations("Objectives.modal");
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
      onCreated?.();
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
          <DialogTitle>{t("title", { default: "Create New Learning Objective" })}</DialogTitle>
          <DialogDescription>
            {t("description", {
              default:
                "Define your learning goal and we'll help you create a personalized roadmap.",
            })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              {t("fields.title.label", { default: "Title" })}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              placeholder={t("fields.title.placeholder", {
                default: "e.g., Master Java Backend Development",
              })}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              {t("fields.description.label", { default: "Description" })}
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("fields.description.placeholder", {
                default: "Describe what you want to learn and why...",
              })}
              rows={3}
            />
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              {t("fields.priority.label", { default: "Priority Level" })}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                {
                  value: 1,
                  label: t("fields.priority.low", { default: "Low" }),
                  icon: Flag,
                  color: "text-gray-500",
                },
                {
                  value: 2,
                  label: t("fields.priority.medium", { default: "Medium" }),
                  icon: TrendingUp,
                  color: "text-blue-500",
                },
                {
                  value: 3,
                  label: t("fields.priority.high", { default: "High" }),
                  icon: Zap,
                  color: "text-yellow-500",
                },
                {
                  value: 4,
                  label: t("fields.priority.urgent", { default: "Urgent" }),
                  icon: Flame,
                  color: "text-orange-500",
                },
                {
                  value: 5,
                  label: t("fields.priority.critical", { default: "Critical" }),
                  icon: Rocket,
                  color: "text-red-500",
                },
              ].map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: value })}
                  className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    formData.priority === value
                      ? "border-primary bg-primary/10 shadow-md scale-105"
                      : "border-border hover:border-primary/50 hover:bg-accent"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${formData.priority === value ? "text-primary" : color}`}
                  />
                  <span
                    className={`text-xs font-medium ${formData.priority === value ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {label}
                  </span>
                  {formData.priority === value && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="h-3 w-3 text-primary-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              💡{" "}
              {t("fields.priority.hint", {
                default:
                  "Higher priority objectives will be recommended first in your learning roadmap",
              })}
            </p>
          </div>

          {/* Success Criteria */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("fields.successCriteria.label", { default: "Success Criteria" })}
            </label>
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
                placeholder={t("fields.successCriteria.placeholder", {
                  default: "e.g., Build a REST API",
                })}
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
            <label className="text-sm font-medium">
              {t("fields.requiredSkills.label", { default: "Required Skills" })}
            </label>
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
                placeholder={t("fields.requiredSkills.placeholder", {
                  default: "e.g., Java, Spring Boot",
                })}
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
              {t("buttons.cancel", { default: "Cancel" })}
            </Button>
            <Button type="submit" disabled={createObjective.isPending}>
              {createObjective.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t("buttons.creating", { default: "Creating..." })}
                </div>
              ) : (
                t("buttons.create", { default: "Create Objective" })
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
