"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronUp, MessageCircle, Plus, Filter, Star, Wrench, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { FeatureCategory, FeatureRequest } from "@/models";

export default function FeaturesPage() {
  const t = useTranslations("Features");
  const [features, setFeatures] = useState<FeatureRequest[]>([]);
  const [sortBy, setSortBy] = useState("trending");
  const [categories, setCategories] = useState<FeatureCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Failed to vote:", error);
      // TODO: Afficher une notification d'erreur à l'utilisateur
    }
  };

  const handleSubmitIdea = () => {
    // TODO: Implement submit idea modal
    console.log("Submit idea clicked");
  };

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
            <p className="text-gray-600">{t("subtitle")}</p>
          </div>
          <Button onClick={handleSubmitIdea} className="bg-pink-600 hover:bg-pink-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            {t("submitIdea")}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={loading}>
            <SelectTrigger className="w-48">
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
        ) : features.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">No features found.</div>
          </div>
        ) : (
          features.map((feature) => (
            <Card key={feature.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleVote(feature.id)}
                      className={`p-2 rounded-lg border-2 transition-colors ${
                        feature.userVoted
                          ? "border-pink-500 bg-pink-50 text-pink-600"
                          : "border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-gray-700">
                      {feature.votesCount}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{feature.excerpt}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{new Date(feature.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="text-blue-600">{t(`categories.${feature.category}`)}</span>
                      <div className="flex gap-2">
                        {feature.tags.map((tag, index) => (
                          <span key={index} className="text-blue-600">
                            #{tag}
                          </span>
                        ))}
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
                          } border`}
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
