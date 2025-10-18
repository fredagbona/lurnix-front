"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { featuresService } from "@/services";
import type { FeatureCategory, SubmitFeatureRequest } from "@/models";

interface SubmitIdeaProps {
  categories: FeatureCategory[];
  onFeatureSubmitted: (feature: any) => void;
}

export default function SubmitIdea({ categories, onFeatureSubmitted }: SubmitIdeaProps) {
  const t = useTranslations("Features");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SubmitFeatureRequest>({
    title: "",
    description: "",
    category: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await featuresService.submitFeature(formData);
      onFeatureSubmitted(response.data);

      // Afficher message de succès
      toast.success(t("submitSuccess", { default: "Feature request submitted successfully!" }));

      // Réinitialiser le formulaire
      setFormData({
        title: "",
        description: "",
        category: "",
        tags: [],
      });
      setTagInput("");
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to submit feature:", error);

      // Gérer les erreurs avec toast
      if (error.response?.data?.error?.message) {
        // Structure: { success: false, error: { code: "...", message: "..." } }
        toast.error(error.response.data.error.message);
      } else if (error.response?.data?.error) {
        // Fallback si pas de message
        toast.error(
          t("submitError", { default: "An error occurred while submitting the feature" }),
        );
      } else {
        toast.error(
          t("unexpectedError", { default: "An unexpected error occurred. Please try again." }),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/80 text-white py-2.5">
          {t("submitIdea")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle>{t("submitIdea")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              {t("form.title", { default: "Title" })} *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder={t("form.titlePlaceholder", { default: "Enter feature title" })}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              {t("form.description", { default: "Description" })} *
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder={t("form.descriptionPlaceholder", {
                default: "Describe your feature idea",
              })}
              rows={4}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              {t("form.category", { default: "Category" })} *
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("form.selectCategory", { default: "Select a category" })}
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {t(`categories.${category.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              {t("form.tags", { default: "Tags" })}
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder={t("form.tagPlaceholder", { default: "Enter a tag" })}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {t("form.addTag", { default: "Add" })}
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto"
            >
              {t("form.cancel", { default: "Cancel" })}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting
                ? t("form.submitting", { default: "Submitting..." })
                : t("form.submit", { default: "Submit Feature" })}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
