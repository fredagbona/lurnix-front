"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ChevronUp, Star, Wrench, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { featuresService } from "@/services";
import SubmitIdea from "@/components/SubmitIdea";
import type { FeatureCategory, FeatureRequest } from "@/models";

export default function FeaturesPage() {
  const t = useTranslations("Features");
  const [features, setFeatures] = useState<FeatureRequest[]>([]);
  const [categories, setCategories] = useState<FeatureCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const filteredFeatures = features.filter((feature) => {
    if (selectedCategory === "all") return true;
    return feature.category === selectedCategory;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, featuresResponse] = await Promise.all([
          featuresService.getCategories(),
          featuresService.getFeatures(),
        ]);
        setCategories(categoriesResponse.data);
        setFeatures(featuresResponse.data.items);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVote = async (featureId: string) => {
    try {
      const response = await featuresService.toggleVote(featureId);

      // Mettre à jour l'état local avec la réponse de l'API
      setFeatures((prev) =>
        prev.map((feature) => {
          if (feature.id === featureId) {
            return {
              ...feature,
              votesCount: response.data.votesCount,
              userVoted: response.data.userVoted,
            };
          }
          return feature;
        }),
      );
    } catch (error: any) {
      console.error("Failed to vote:", error);

      // Gérer les erreurs avec toast
      if (error.response?.data?.error?.message) {
        toast.error(error.response.data.error.message);
      } else if (error.response?.data?.error) {
        // Fallback si pas de message
        toast.error("Failed to vote on this feature");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleFeatureSubmitted = (newFeature: FeatureRequest) => {
    setFeatures((prev) => [newFeature, ...prev]);
  };

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
            <p className="text-gray-600 text-sm sm:text-base">{t("subtitle")}</p>
          </div>
          <div className="flex-shrink-0">
            <SubmitIdea categories={categories} onFeatureSubmitted={handleFeatureSubmitted} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={loading}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {t(`categories.${category.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Loading features...</div>
          </div>
        ) : filteredFeatures.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">
              {selectedCategory === "all"
                ? "No features found."
                : `No features found in ${t(`categories.${selectedCategory}`)} category.`}
            </div>
          </div>
        ) : (
          filteredFeatures.map((feature) => (
            <Card key={feature.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleVote(feature.id)}
                      className={`p-2 rounded-lg border-2 transition-colors ${
                        feature.userVoted
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-gray-700">
                      {feature.votesCount}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">
                      {feature.excerpt}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-2">
                        <span>{new Date(feature.createdAt).toLocaleDateString()}</span>
                        <span className="hidden sm:inline">•</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">{t(`categories.${feature.category}`)}</span>
                        <div className="flex gap-2 flex-wrap">
                          {feature.tags?.map((tag, index) => (
                            <span key={index} className="text-blue-600">
                              #{tag}
                            </span>
                          )) || []}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${
                            feature.status === "open"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : feature.status === "closed"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                          } border text-xs`}
                        >
                          {feature.status === "open" ? (
                            <Star className="h-3 w-3 mr-1" />
                          ) : feature.status === "closed" ? (
                            <Clock className="h-3 w-3 mr-1" />
                          ) : (
                            <Wrench className="h-3 w-3 mr-1" />
                          )}
                          <span className="ml-1 capitalize">{feature.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
