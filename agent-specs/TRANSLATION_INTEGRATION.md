# Translation Integration Guide

**Status:** Translation keys added ✅  
**Next Step:** Update components to use translations

---

## ✅ Translation Keys Added

### **English (`en.json`)** ✅
- `Learning.objectives.*` - 20+ keys
- `Learning.objective.*` - 12+ keys
- `Learning.create_objective.*` - 15+ keys
- `Learning.sprint.*` - 20+ keys
- `Learning.sprint_completion.*` - 12+ keys
- `Quiz.*` - 25+ keys
- `Skills.*` - 20+ keys
- `Performance.*` - 12+ keys
- `Dashboard.nav.learning` ✅
- `Dashboard.nav.skills` ✅

### **French (`fr.json`)** ✅
- All keys translated to French
- Navigation items updated

**Total:** ~150+ translation keys added

---

## 🔧 Components to Update

### **Priority 1: Most Visible Components**

#### 1. **Dashboard Page** (`src/app/[lang]/(private)/dashboard/page.tsx`)
```tsx
// Current (hardcoded):
<h2 className="text-2xl font-semibold">Your Learning Objectives</h2>
<p className="text-sm text-muted-foreground mt-1">
  Track your progress and manage your learning goals
</p>

// Update to:
const t = useTranslations("Learning.objectives");
<h2 className="text-2xl font-semibold">{t("title")}</h2>
<p className="text-sm text-muted-foreground mt-1">
  {t("subtitle")}
</p>
```

#### 2. **ObjectivesList** (`src/components/learning/ObjectivesList.tsx`)
Update all text:
- "To Do", "Active", "Completed" → `t("filter_todo")`, etc.
- "Sort by:", "Recent", "Progress" → `t("sort_by")`, etc.
- "No objectives match..." → `t("no_match")`

#### 3. **CreateObjectiveModal** (`src/components/learning/CreateObjectiveModal.tsx`)
Update all form labels and placeholders:
- "Title", "Description", "Priority" → `t("field_title")`, etc.
- All placeholders → `t("placeholder_*")`
- Buttons → `t("create")`, `t("cancel")`

#### 4. **ObjectiveCard** (`src/components/learning/ObjectiveCard.tsx`)
Update status labels:
- "To Do", "In Progress", "Completed" → `t("status.todo")`, etc.
- "View Details" → `t("view_details")`

---

### **Priority 2: Sprint Components**

#### 5. **SprintCard** (`src/components/learning/SprintCard.tsx`)
- "Readiness Quiz Required" → `t("readiness_quiz")`
- "Start Sprint", "Continue Sprint" → `t("start")`, `t("continue")`

#### 6. **SprintDetails Page** (`src/app/.../sprints/[sprintId]/page.tsx`)
- "Tasks", "Projects", "Evidence", "Reflection" → Use translations
- "Complete Sprint" → `t("complete")`

#### 7. **SprintCompletion** (`src/components/learning/SprintCompletion.tsx`)
- "Sprint Completed!" → `t("title")`
- "Skills Mastered!", "Skills Updated" → Use translations

---

### **Priority 3: Quiz Components**

#### 8. **QuizInterface** (`src/components/quiz/QuizInterface.tsx`)
- "Progress", "Passing Score", "Attempts" → Use translations
- "Previous", "Next", "Submit Quiz" → Use translations

#### 9. **QuizQuestion** (`src/components/quiz/QuizQuestion.tsx`)
- "Question {n} of {total}" → `t("question", { current, total })`
- "Select all that apply" → `t("select_all")`

#### 10. **QuizResults** (`src/components/quiz/QuizResults.tsx`)
- "Quiz Passed!", "Quiz Not Passed" → `t("passed")`, `t("not_passed")`
- All labels → Use translations

---

### **Priority 4: Skills Components**

#### 11. **SkillMap** (`src/components/skills/SkillMap.tsx`)
- "Overall Progress", "Mastered", etc. → Use translations
- "Search skills..." → `t("search")`

#### 12. **SkillProgressWidget** (`src/components/skills/SkillProgressWidget.tsx`)
- "Your Skills", "View Skill Map" → Use translations

#### 13. **PerformanceDashboard** (`src/components/skills/PerformanceDashboard.tsx`)
- All labels → Use translations

---

## 📝 Implementation Pattern

### **Step 1: Import useTranslations**
```tsx
import { useTranslations } from "next-intl";
```

### **Step 2: Initialize in component**
```tsx
export function MyComponent() {
  const t = useTranslations("Learning.objectives");
  // ...
}
```

### **Step 3: Replace hardcoded text**
```tsx
// Before:
<h1>Learning Objectives</h1>

// After:
<h1>{t("title")}</h1>
```

### **Step 4: Use with parameters**
```tsx
// For dynamic values:
<p>{t("view_all", { count: objectives.length })}</p>

// For plurals:
<p>{t("duration", { days: sprint.lengthDays, hours: sprint.totalEstimatedHours })}</p>
```

---

## 🎯 Quick Win: Update Dashboard First

The dashboard is the most visible page. Update it first to show immediate i18n support:

```tsx
// src/app/[lang]/(private)/dashboard/page.tsx

export default function DashboardPage() {
  const t = useTranslations("Dashboard.page");
  const tLearning = useTranslations("Learning.objectives");
  
  // ... existing code ...
  
  return (
    <div className="space-y-6">
      {/* ... */}
      
      {hasCompletedProfileTest && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{tLearning("title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {tLearning("subtitle")}
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {tLearning("create")}
            </Button>
          </div>
          <ObjectivesList limit={3} onCreateClick={() => setShowCreateModal(true)} />
        </section>
      )}
    </div>
  );
}
```

---

## 📊 Translation Coverage

| Component | Keys Needed | Status |
|-----------|-------------|--------|
| Dashboard | 3 | ✅ Keys added |
| ObjectivesList | 15 | ✅ Keys added |
| ObjectiveCard | 5 | ✅ Keys added |
| CreateObjectiveModal | 15 | ✅ Keys added |
| SprintCard | 8 | ✅ Keys added |
| SprintDetails | 12 | ✅ Keys added |
| SprintCompletion | 12 | ✅ Keys added |
| QuizInterface | 10 | ✅ Keys added |
| QuizQuestion | 8 | ✅ Keys added |
| QuizResults | 15 | ✅ Keys added |
| SkillMap | 12 | ✅ Keys added |
| SkillProgressWidget | 8 | ✅ Keys added |
| PerformanceDashboard | 12 | ✅ Keys added |

**Total:** ~150 keys across 13 components

---

## 🚀 Implementation Order

### **Phase A: Critical Path (30 min)**
1. ✅ Add translation keys to `en.json` and `fr.json`
2. ⏳ Update Dashboard page
3. ⏳ Update ObjectivesList
4. ⏳ Update CreateObjectiveModal
5. ⏳ Update ObjectiveCard

### **Phase B: Sprint Flow (20 min)**
6. ⏳ Update SprintCard
7. ⏳ Update SprintDetails page
8. ⏳ Update SprintCompletion

### **Phase C: Quiz & Skills (20 min)**
9. ⏳ Update QuizInterface
10. ⏳ Update QuizResults
11. ⏳ Update SkillMap
12. ⏳ Update PerformanceDashboard

**Total Time:** ~70 minutes to fully internationalize

---

## 💡 Tips

### **For Lists/Arrays**
```tsx
const statusOptions = [
  { value: "all", label: t("filter_all") },
  { value: "todo", label: t("filter_todo") },
  { value: "in_progress", label: t("filter_active") },
  { value: "completed", label: t("filter_completed") },
];
```

### **For Dynamic Content**
```tsx
// Use parameters:
t("view_all", { count: objectives.length })
t("day", { number: sprint.dayNumber })
t("answered", { answered: 5, total: 10 })
```

### **For Plurals**
```tsx
// next-intl handles plurals automatically:
t("duration", { days: 1 }) // "1 day"
t("duration", { days: 5 }) // "5 days"
```

---

## ✅ Current Status

- ✅ **Translation keys added** to both `en.json` and `fr.json`
- ✅ **Navigation updated** with "Learning" and "Skills"
- ⏳ **Components need updating** to use `useTranslations()`

---

## 🎯 Next Action

Would you like me to:

**Option A:** Update all components now to use translations (~70 min work)

**Option B:** Update just the dashboard and objectives components (most visible)

**Option C:** Leave as-is for now (translations ready when needed)

The translation keys are ready - components will work in English until updated to use `useTranslations()`.

---

**Translation infrastructure complete!** 🌐
