"use client";

import { useSearchParams } from "next/navigation";
import { useUserSkills, useUserPerformance } from "@/hooks";
import { SkillMap, PerformanceDashboard } from "@/components/skills";
import { Loader } from "@/components/ui/loader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Map } from "lucide-react";

export default function SkillsPage() {
  const searchParams = useSearchParams();
  const objectiveId = searchParams.get("objectiveId") || undefined;

  const {
    data: skillMap,
    isLoading: skillsLoading,
    error: skillsError,
  } = useUserSkills(objectiveId);
  const { data: performance, isLoading: perfLoading, error: perfError } = useUserPerformance();

  if (skillsLoading || perfLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (skillsError || perfError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-sm text-destructive">Failed to load skills data. Please try again.</p>
      </div>
    );
  }

  if (!skillMap || !performance) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No skills data available yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Complete your first sprint to start tracking skills!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skills & Performance</h1>
        <p className="text-muted-foreground mt-2">
          Track your skill development and learning progress
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Skill Map
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          <SkillMap skillMap={skillMap} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceDashboard performance={performance} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
