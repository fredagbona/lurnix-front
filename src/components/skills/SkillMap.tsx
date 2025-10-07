"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkillCard } from "./SkillCard";
import { Search, Filter } from "lucide-react";
import type { SkillMap as SkillMapType, SkillStatus } from "@/models/learning";
import { cn } from "@/lib/utils";

interface SkillMapProps {
  skillMap: SkillMapType;
  onSkillClick?: (skillId: string) => void;
}

export function SkillMap({ skillMap, onSkillClick }: SkillMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SkillStatus | "all">("all");

  // Filter skills
  let filteredSkills = skillMap.skills;

  if (searchQuery) {
    filteredSkills = filteredSkills.filter((skill) =>
      skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  if (statusFilter !== "all") {
    filteredSkills = filteredSkills.filter((skill) => skill.status === statusFilter);
  }

  // Group skills by status for better visualization
  const skillsByStatus = {
    mastered: filteredSkills.filter((s) => s.status === "mastered"),
    proficient: filteredSkills.filter((s) => s.status === "proficient"),
    practicing: filteredSkills.filter((s) => s.status === "practicing"),
    learning: filteredSkills.filter((s) => s.status === "learning"),
    struggling: filteredSkills.filter((s) => s.status === "struggling"),
    not_started: filteredSkills.filter((s) => s.status === "not_started"),
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Overall Progress</p>
          <p className="text-3xl font-bold">{skillMap.overallProgress}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Mastered</p>
          <p className="text-3xl font-bold text-amber-600">{skillMap.masteredSkills.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">{skillMap.inProgress.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Struggling</p>
          <p className="text-3xl font-bold text-red-600">{skillMap.strugglingAreas.length}</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "mastered" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("mastered")}
              >
                🏆 Mastered
              </Button>
              <Button
                variant={statusFilter === "proficient" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("proficient")}
              >
                🟢 Proficient
              </Button>
              <Button
                variant={statusFilter === "practicing" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("practicing")}
              >
                🟡 Practicing
              </Button>
              <Button
                variant={statusFilter === "struggling" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("struggling")}
              >
                🔴 Struggling
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Skills by Status */}
      {statusFilter === "all" ? (
        <div className="space-y-6">
          {/* Mastered Skills */}
          {skillsByStatus.mastered.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span>🏆</span>
                <span>Mastered Skills ({skillsByStatus.mastered.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillsByStatus.mastered.map((skill) => (
                  <SkillCard
                    key={skill.skillId}
                    skill={skill}
                    onClick={() => onSkillClick?.(skill.skillId)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Proficient Skills */}
          {skillsByStatus.proficient.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span>🟢</span>
                <span>Proficient Skills ({skillsByStatus.proficient.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillsByStatus.proficient.map((skill) => (
                  <SkillCard
                    key={skill.skillId}
                    skill={skill}
                    onClick={() => onSkillClick?.(skill.skillId)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Practicing Skills */}
          {skillsByStatus.practicing.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span>🟡</span>
                <span>Practicing Skills ({skillsByStatus.practicing.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillsByStatus.practicing.map((skill) => (
                  <SkillCard
                    key={skill.skillId}
                    skill={skill}
                    onClick={() => onSkillClick?.(skill.skillId)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Learning Skills */}
          {skillsByStatus.learning.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span>🟡</span>
                <span>Learning Skills ({skillsByStatus.learning.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillsByStatus.learning.map((skill) => (
                  <SkillCard
                    key={skill.skillId}
                    skill={skill}
                    onClick={() => onSkillClick?.(skill.skillId)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Struggling Skills */}
          {skillsByStatus.struggling.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span>🔴</span>
                <span>Struggling Skills ({skillsByStatus.struggling.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillsByStatus.struggling.map((skill) => (
                  <SkillCard
                    key={skill.skillId}
                    skill={skill}
                    onClick={() => onSkillClick?.(skill.skillId)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Not Started Skills */}
          {skillsByStatus.not_started.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span>⚪</span>
                <span>Not Started ({skillsByStatus.not_started.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skillsByStatus.not_started.map((skill) => (
                  <SkillCard
                    key={skill.skillId}
                    skill={skill}
                    onClick={() => onSkillClick?.(skill.skillId)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.skillId}
              skill={skill}
              onClick={() => onSkillClick?.(skill.skillId)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredSkills.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No skills found matching your criteria</p>
        </Card>
      )}
    </div>
  );
}
