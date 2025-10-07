# Brain-Adaptive Learning System - Implementation Plan

**Created:** 2025-10-03  
**Project:** Lurnix Frontend  
**Reference:** learning-system.md

---

## 📋 Overview

This document outlines the step-by-step implementation plan for integrating the brain-adaptive learning system into the Lurnix frontend. The implementation is divided into 4 major phases, each with incremental, testable steps.

**Tech Stack:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- TanStack Query (React Query)
- Tailwind CSS + shadcn/ui
- Lucide React (icons)
- Axios (HTTP client)

---

## 🎯 Implementation Strategy

### Core Principles
1. **Incremental Development**: Build small, testable pieces
2. **Type Safety**: Define TypeScript types first
3. **Reusable Components**: Create modular, composable UI components
4. **API-First**: Service layer before UI components
5. **User Experience**: Smooth transitions and feedback

### File Organization
```
src/
├── models/
│   ├── learning.ts          # Objectives, Sprints, Skills types
│   └── quiz.ts              # Quiz types (update existing)
├── services/
│   ├── learningService.ts   # Objectives & Sprints API
│   ├── skillService.ts      # Skills API
│   └── quizService.ts       # Quiz API (update existing)
├── hooks/
│   ├── use-objectives.ts    # Objectives hooks
│   ├── use-sprints.ts       # Sprints hooks
│   ├── use-skills.ts        # Skills hooks
│   └── use-quizzes.ts       # Quiz hooks
├── components/
│   ├── learning/
│   │   ├── ObjectiveCard.tsx
│   │   ├── ObjectivesList.tsx
│   │   ├── CreateObjectiveModal.tsx
│   │   ├── SprintCard.tsx
│   │   ├── SprintDetails.tsx
│   │   ├── SprintCompletion.tsx
│   │   └── NotificationSystem.tsx
│   ├── quiz/
│   │   ├── QuizInterface.tsx
│   │   ├── QuizQuestion.tsx
│   │   ├── QuizResults.tsx
│   │   └── QuizTimer.tsx
│   └── skills/
│       ├── SkillMap.tsx
│       ├── SkillProgressWidget.tsx
│       ├── SkillCard.tsx
│       └── PerformanceDashboard.tsx
└── app/[lang]/(private)/
    ├── objectives/
    │   ├── page.tsx
    │   └── [objectiveId]/
    │       ├── page.tsx
    │       └── sprints/
    │           └── [sprintId]/
    │               └── page.tsx
    └── skills/
        └── page.tsx
```

---

## 📦 Phase 1: Foundation - Objectives & Basic Sprint Display

**Goal:** Users can view and create objectives, see current sprints  
**Estimated Time:** 6-8 hours  
**Priority:** HIGH

### Step 1.1: Create Core Models and Types
**File:** `src/models/learning.ts`

**Tasks:**
- [ ] Define `Objective` interface
- [ ] Define `Sprint` interface
- [ ] Define `SkillUpdate` interface
- [ ] Define `BrainAdaptiveData` interface
- [ ] Define `Notification` interface
- [ ] Define API response types
- [ ] Export all types

**Key Types:**
```typescript
interface Objective {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  currentSprintId: string | null;
  currentSprint: Sprint | null;
  progressPercentage: number;
  // ... (see learning-system.md line 52-88)
}

interface Sprint {
  id: string;
  objectiveId: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'not_started' | 'in_progress' | 'completed';
  // ... (see learning-system.md line 199-233)
}
```

**Acceptance Criteria:**
- All types match backend API responses
- Proper TypeScript strict mode compliance
- Exported from `src/models/index.ts`

---

### Step 1.2: Create API Service Layer
**Files:** 
- `src/services/learningService.ts`
- Update `src/services/index.ts`

**Tasks:**
- [ ] Create `objectivesService` with methods:
  - `getObjectives()` - GET /api/objectives
  - `getObjective(id)` - GET /api/objectives/:id
  - `createObjective(data)` - POST /api/objectives
  - `updateObjective(id, data)` - PATCH /api/objectives/:id
  - `deleteObjective(id)` - DELETE /api/objectives/:id
- [ ] Create `sprintsService` with methods:
  - `getSprint(id)` - GET /api/sprints/:id
  - `completeSprint(id, data)` - POST /api/sprints/:id/complete
  - `getSprintReadiness(id)` - GET /api/sprints/:id/readiness
  - `getSprintValidation(id)` - GET /api/sprints/:id/validation
- [ ] Add proper error handling
- [ ] Add TypeScript return types
- [ ] Export from services index

**Example:**
```typescript
export const learningService = {
  async getObjectives(): Promise<ApiResponse<Objective[]>> {
    return apiClient.get('/objectives');
  },
  // ...
};
```

**Acceptance Criteria:**
- All endpoints properly typed
- Uses existing `apiClient` from `src/services/api.ts`
- Proper error handling with `ApiError`
- Exported and accessible

---

### Step 1.3: Create Custom React Hooks
**Files:**
- `src/hooks/use-objectives.ts`
- `src/hooks/use-sprints.ts`
- Update `src/hooks/index.ts`

**Tasks:**
- [ ] Create `useObjectives()` hook for listing objectives
- [ ] Create `useObjective(id)` hook for single objective
- [ ] Create `useCreateObjective()` mutation hook
- [ ] Create `useSprint(id)` hook
- [ ] Create `useCompleteSprint()` mutation hook
- [ ] Configure proper cache invalidation
- [ ] Add loading and error states

**Example:**
```typescript
export function useObjectives() {
  return useQuery({
    queryKey: ['objectives'],
    queryFn: () => learningService.getObjectives(),
  });
}

export function useCreateObjective() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: learningService.createObjective,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectives'] });
    },
  });
}
```

**Acceptance Criteria:**
- Uses TanStack Query (React Query)
- Proper cache management
- Optimistic updates where appropriate
- TypeScript generics properly used

---

### Step 1.4: Build ObjectivesList Component
**File:** `src/components/learning/ObjectivesList.tsx`

**Tasks:**
- [ ] Create component with objectives grid/list view
- [ ] Show loading skeleton
- [ ] Show empty state
- [ ] Show error state
- [ ] Add "Create Objective" button
- [ ] Filter by status (todo, in_progress, completed)
- [ ] Sort options (recent, progress, priority)

**UI Features:**
- Grid layout (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- Each objective shows:
  - Title and description
  - Progress percentage
  - Current sprint title (if exists)
  - Status badge
  - Priority indicator

**Acceptance Criteria:**
- Responsive design
- Accessible (keyboard navigation, ARIA labels)
- Uses existing UI components (Card, Button, Badge)
- Proper loading states

---

### Step 1.5: Build ObjectiveCard Component
**File:** `src/components/learning/ObjectiveCard.tsx`

**Tasks:**
- [ ] Create card component with objective data
- [ ] Show progress bar
- [ ] Show current sprint info
- [ ] Show difficulty indicator
- [ ] Add click to view details
- [ ] Show status badge
- [ ] Show estimated completion

**UI Design:**
```
┌─────────────────────────────────────┐
│ Master Java Backend Development     │
│ Priority: ⭐⭐⭐                      │
├─────────────────────────────────────┤
│ Progress: [████████░░] 80%          │
│                                     │
│ Current Sprint:                     │
│ Day 5: Java OOP - Inheritance       │
│ Difficulty: Medium (55/100) 📊     │
│                                     │
│ 📅 Est. completion: Dec 15, 2025    │
│                                     │
│ [View Details →]                    │
└─────────────────────────────────────┘
```

**Acceptance Criteria:**
- Matches design system
- Hover effects
- Click navigates to objective details
- Shows all key metrics

---

### Step 1.6: Build CreateObjectiveModal Component
**File:** `src/components/learning/CreateObjectiveModal.tsx`

**Tasks:**
- [ ] Create modal using shadcn Dialog
- [ ] Add form fields:
  - Title (required)
  - Description (optional)
  - Success criteria (array input)
  - Required skills (array input)
  - Priority (1-5 slider)
- [ ] Add form validation
- [ ] Handle submission
- [ ] Show loading state
- [ ] Show success/error feedback

**Form Fields:**
- Title: Text input (min 3 chars)
- Description: Textarea
- Success Criteria: Dynamic list input
- Required Skills: Tag input
- Priority: Radio buttons or slider (1-5)

**Acceptance Criteria:**
- Form validation with error messages
- Accessible form
- Uses existing Dialog component
- Proper error handling
- Success toast notification

---

### Step 1.7: Integrate Objectives into Dashboard
**File:** `src/app/[lang]/(private)/dashboard/page.tsx`

**Tasks:**
- [ ] Import ObjectivesList component
- [ ] Add objectives section to dashboard
- [ ] Show "Active Objectives" count
- [ ] Show "Create First Objective" CTA if none exist
- [ ] Add link to full objectives page
- [ ] Update sidebar navigation (add "Learning" menu item)

**UI Integration:**
```tsx
{/* After profile sections */}
<section className="space-y-4">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-semibold">Your Learning Objectives</h2>
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="h-4 w-4 mr-2" />
      New Objective
    </Button>
  </div>
  <ObjectivesList limit={3} />
  <Link href="/objectives">
    <Button variant="outline">View All Objectives →</Button>
  </Link>
</section>
```

**Acceptance Criteria:**
- Seamlessly integrated into existing dashboard
- Responsive layout
- Proper spacing and typography
- Navigation works

---

## 🚀 Phase 2: Sprint Management & Brain-Adaptive Feedback

**Goal:** Users can complete sprints and see skill updates  
**Estimated Time:** 8-10 hours  
**Priority:** HIGH

### Step 2.1: Create SprintCard Component
**File:** `src/components/learning/SprintCard.tsx`

**Tasks:**
- [ ] Create sprint card with difficulty indicator
- [ ] Show skill tags
- [ ] Show readiness quiz badge (if required)
- [ ] Show validation quiz badge (if required)
- [ ] Add "Start Sprint" button
- [ ] Add "Continue Sprint" button (if in progress)
- [ ] Show completion status

**UI Design:**
```
┌─────────────────────────────────────┐
│ Day 5: Java OOP - Inheritance       │
│                                     │
│ Difficulty: Medium (55/100) 📊     │
│ Skills: Inheritance, Polymorphism   │
│                                     │
│ 📝 Readiness Quiz Required          │
│ [Take Quiz First]                   │
└─────────────────────────────────────┘
```

**Acceptance Criteria:**
- Shows all relevant sprint info
- Difficulty visualized (color + number)
- Quiz requirements clearly indicated
- Proper button states

---

### Step 2.2: Build SprintDetails Page
**File:** `src/app/[lang]/(private)/objectives/[objectiveId]/sprints/[sprintId]/page.tsx`

**Tasks:**
- [ ] Create sprint details page
- [ ] Show sprint title and description
- [ ] Show difficulty and skills
- [ ] List micro-tasks with checkboxes
- [ ] Show projects section
- [ ] Add evidence upload section
- [ ] Add reflection textarea
- [ ] Add "Complete Sprint" button
- [ ] Handle sprint completion

**Page Sections:**
1. **Header**: Title, difficulty, day number
2. **Skills**: Skill tags
3. **Tasks**: Checklist of micro-tasks
4. **Projects**: Project cards
5. **Evidence**: File upload area
6. **Reflection**: Textarea for learner notes
7. **Actions**: Complete button

**Acceptance Criteria:**
- All sprint data displayed
- Task completion tracked
- Form validation before completion
- Proper loading states

---

### Step 2.3: Create SprintCompletion Component
**File:** `src/components/learning/SprintCompletion.tsx`

**Tasks:**
- [ ] Create completion modal/page
- [ ] Display completion celebration
- [ ] Show skill updates with animations
- [ ] Display before/after skill levels
- [ ] Show mastered skills with special badge
- [ ] Display brain-adaptive notifications
- [ ] Show next sprint preview
- [ ] Add "Continue" button

**UI Design:**
```
┌─────────────────────────────────────┐
│ 🎉 Sprint Completed!                │
├─────────────────────────────────────┤
│ Score: 92/100                       │
│                                     │
│ Skills Updated:                     │
│ ✅ Java Inheritance: 45 → 60 🟡     │
│    Status: Practicing               │
│                                     │
│ 🏆 Java Polymorphism: 75 → 90      │
│    Status: MASTERED!                │
│                                     │
│ [Continue to Next Sprint →]         │
└─────────────────────────────────────┘
```

**Acceptance Criteria:**
- Celebratory animations (confetti for mastery)
- Clear skill progression visualization
- Smooth transitions
- Proper data display

---

### Step 2.4: Build Notification System
**File:** `src/components/learning/NotificationSystem.tsx`

**Tasks:**
- [ ] Create notification component
- [ ] Handle different notification types:
  - `skill_mastered` - Celebration
  - `difficulty_increased` - Info
  - `difficulty_decreased` - Support
  - `review_needed` - Warning
- [ ] Add notification queue
- [ ] Add dismiss functionality
- [ ] Add notification history
- [ ] Integrate with sprint completion

**Notification Types:**
```typescript
type NotificationType = 
  | 'skill_mastered'
  | 'difficulty_increased'
  | 'difficulty_decreased'
  | 'review_needed'
  | 'sprint_completed';
```

**Acceptance Criteria:**
- Uses existing toast system (sonner)
- Different styles per type
- Auto-dismiss with timer
- Manual dismiss option
- Accessible (screen reader support)

---

## 🧪 Phase 3: Quiz System Integration

**Goal:** Users can take pre-sprint and post-sprint quizzes  
**Estimated Time:** 10-12 hours  
**Priority:** MEDIUM

### Step 3.1: Create Quiz Models and API Service
**Files:**
- Update `src/models/quiz.ts`
- Update `src/services/quizService.ts`

**Tasks:**
- [ ] Update Quiz interface with new fields
- [ ] Add QuizQuestion interface with all question types
- [ ] Add QuizAttempt interface
- [ ] Add QuizResult interface
- [ ] Create API methods:
  - `getQuiz(id)` - GET /api/quizzes/:id
  - `submitQuiz(id, answers)` - POST /api/quizzes/:id/submit
  - `getQuizAttempts(id)` - GET /api/quizzes/:id/attempts

**Question Types:**
- `multiple_choice` - Radio buttons
- `multiple_select` - Checkboxes
- `true_false` - True/False buttons
- `code_output` - Text input
- `code_completion` - Code editor
- `short_answer` - Textarea

**Acceptance Criteria:**
- All question types supported
- Proper TypeScript types
- API methods working
- Error handling

---

### Step 3.2: Build QuizInterface Component
**File:** `src/components/quiz/QuizInterface.tsx`

**Tasks:**
- [ ] Create quiz container component
- [ ] Add quiz header with title and timer
- [ ] Add question navigation (prev/next)
- [ ] Add progress indicator
- [ ] Create QuizQuestion sub-component
- [ ] Handle different question types
- [ ] Add answer validation
- [ ] Add submit confirmation
- [ ] Handle quiz submission

**Sub-components:**
- `QuizTimer.tsx` - Countdown timer
- `QuizQuestion.tsx` - Individual question renderer
- `QuizProgress.tsx` - Progress bar

**UI Design:**
```
┌─────────────────────────────────────┐
│ Readiness Check: OOP Basics         │
│ Time: 12:45 / 15:00                 │
│ Question 3 of 5                     │
├─────────────────────────────────────┤
│ What is inheritance in OOP?         │
│                                     │
│ ○ A. Option A                       │
│ ○ B. Option B                       │
│ ○ C. Option C                       │
│ ○ D. Option D                       │
│                                     │
│ [Previous] [Next]                   │
└─────────────────────────────────────┘
```

**Acceptance Criteria:**
- All question types render correctly
- Timer works properly
- Navigation smooth
- Answer persistence
- Accessible

---

### Step 3.3: Create QuizResults Component
**File:** `src/components/quiz/QuizResults.tsx`

**Tasks:**
- [ ] Create results display component
- [ ] Show overall score with pass/fail
- [ ] Display skill-level performance
- [ ] Show correct/incorrect breakdown
- [ ] Display recommendations
- [ ] Show attempts remaining
- [ ] Add "Retake" button (if failed)
- [ ] Add "Continue" button (if passed)

**UI Design:**
```
┌─────────────────────────────────────┐
│ Quiz Results                        │
├─────────────────────────────────────┤
│ Score: 85% ✅ PASSED                │
│                                     │
│ 4 / 5 correct                       │
│ Time: 3:00                          │
│                                     │
│ Skill Performance:                  │
│ • Java Inheritance: 90% 🟢          │
│ • Java Polymorphism: 80% 🟡         │
│                                     │
│ Recommendations:                    │
│ • Great job! You're ready to start. │
│ • Review polymorphism concepts.     │
│                                     │
│ [Start Sprint]                      │
└─────────────────────────────────────┘
```

**Acceptance Criteria:**
- Clear pass/fail indication
- Skill breakdown visible
- Recommendations displayed
- Proper action buttons
- Celebratory for pass, supportive for fail

---

### Step 3.4: Integrate Quiz Flows
**Files:**
- Update `src/app/[lang]/(private)/objectives/[objectiveId]/sprints/[sprintId]/page.tsx`
- Create `src/app/[lang]/(private)/quizzes/[quizId]/page.tsx`

**Tasks:**
- [ ] Add pre-sprint quiz check
- [ ] Block sprint start if quiz required
- [ ] Add "Take Quiz" button
- [ ] Create quiz page
- [ ] Handle quiz completion
- [ ] Unlock sprint after passing
- [ ] Add post-sprint quiz check
- [ ] Block progression if validation required

**Flow:**
1. User views sprint
2. Check if readiness quiz required
3. If yes, show "Take Quiz" button
4. User takes quiz
5. If pass, unlock sprint
6. User completes sprint
7. Check if validation quiz required
8. If yes, show "Take Validation Quiz"
9. User takes quiz
10. If pass, unlock next sprint

**Acceptance Criteria:**
- Quiz requirements properly checked
- Sprint locked/unlocked correctly
- Smooth flow between quiz and sprint
- Proper error handling

---

## 📊 Phase 4: Skills Tracking & Performance Dashboard

**Goal:** Users can view skill progress and performance analytics  
**Estimated Time:** 10-12 hours  
**Priority:** MEDIUM

### Step 4.1: Create SkillMap Visualization
**File:** `src/components/skills/SkillMap.tsx`

**Tasks:**
- [ ] Create skill map component
- [ ] Display skills in hierarchical tree
- [ ] Show skill levels with progress bars
- [ ] Color-code by status (struggling, learning, proficient, mastered)
- [ ] Add "Needs Review" badges
- [ ] Make skills clickable for details
- [ ] Add filter by status
- [ ] Add search functionality

**UI Design:**
```
┌─────────────────────────────────────┐
│ Skill Map - Java Backend            │
├─────────────────────────────────────┤
│ Java Fundamentals                   │
│ ├─ Syntax [████████░░] 80% 🟢      │
│ ├─ Variables [██████████] 100% 🏆  │
│ └─ Methods [████████░░] 85% 🟢     │
│                                     │
│ OOP                                 │
│ ├─ Classes [██████░░░░] 60% 🟡     │
│ ├─ Inheritance [████░░░░░░] 40% 🟡 │
│ └─ Polymorphism [██████████] 90% 🏆│
│                                     │
│ Collections                         │
│ └─ Lists [██░░░░░░░░] 20% 🔴       │
│    ⚠️ Needs Review                  │
└─────────────────────────────────────┘
```

**Acceptance Criteria:**
- Hierarchical display
- Progress bars accurate
- Color coding clear
- Interactive elements
- Responsive design

---

### Step 4.2: Build SkillProgressWidget
**File:** `src/components/skills/SkillProgressWidget.tsx`

**Tasks:**
- [ ] Create compact widget for dashboard
- [ ] Show skill counts by status
- [ ] Show overall progress percentage
- [ ] Add "View Skill Map" link
- [ ] Add recent skill updates
- [ ] Show next review date

**UI Design:**
```
┌─────────────────────────────────────┐
│ Your Skills                         │
├─────────────────────────────────────┤
│ 🏆 Mastered (2)                     │
│ 🟢 Proficient (3)                   │
│ 🟡 Practicing (5)                   │
│ 🔴 Struggling (1)                   │
│                                     │
│ Overall Progress: 45%               │
│ [View Skill Map]                    │
└─────────────────────────────────────┘
```

**Acceptance Criteria:**
- Compact design
- Clear metrics
- Links to full skill map
- Updates in real-time

---

### Step 4.3: Create PerformanceDashboard
**File:** `src/components/skills/PerformanceDashboard.tsx`

**Tasks:**
- [ ] Create performance analytics component
- [ ] Add score trend chart (line graph)
- [ ] Show average score
- [ ] Display trend indicator (improving/stable/declining)
- [ ] Show current difficulty level
- [ ] Display learning velocity
- [ ] Show estimated completion date
- [ ] List struggling skills with practice buttons
- [ ] List mastered skills with celebration

**Charts:**
- Use a simple charting library (recharts or chart.js)
- Line chart for score trends
- Bar chart for skill levels

**UI Design:**
```
┌─────────────────────────────────────┐
│ Your Performance                    │
├─────────────────────────────────────┤
│ Average Score: 88.5% 📈 Improving   │
│                                     │
│ [Score Chart: 85, 87, 92, 88, 90]  │
│                                     │
│ Current Difficulty: 55/100          │
│ Learning Pace: 1.0x                 │
│                                     │
│ Estimated Completion: Dec 15, 2025  │
│                                     │
│ Struggling: Java Collections 🔴     │
│ [Practice Now]                      │
└─────────────────────────────────────┘
```

**Acceptance Criteria:**
- Charts render correctly
- Data accurate
- Responsive design
- Interactive elements

---

### Step 4.4: Add Skill Detail Pages
**File:** `src/app/[lang]/(private)/skills/[skillId]/page.tsx`

**Tasks:**
- [ ] Create skill detail page
- [ ] Show skill name and level
- [ ] Display practice history
- [ ] Show related sprints
- [ ] Add practice recommendations
- [ ] Show next review date
- [ ] Add "Practice Now" button
- [ ] Display skill mastery criteria

**Page Sections:**
1. **Header**: Skill name, level, status
2. **Progress**: Visual progress indicator
3. **History**: Practice attempts timeline
4. **Related Content**: Sprints that covered this skill
5. **Recommendations**: What to practice next
6. **Actions**: Practice button

**Acceptance Criteria:**
- Comprehensive skill information
- Clear practice path
- Related content linked
- Actionable recommendations

---

### Step 4.5: Final Integration, Testing, and Polish
**Tasks:**
- [ ] Add skills page to navigation
- [ ] Integrate SkillProgressWidget into dashboard
- [ ] Add PerformanceDashboard to dashboard or separate page
- [ ] Test all flows end-to-end
- [ ] Add loading skeletons everywhere
- [ ] Add error boundaries
- [ ] Add empty states
- [ ] Optimize performance
- [ ] Add analytics tracking
- [ ] Write documentation
- [ ] Create user guide

**Testing Checklist:**
- [ ] Create objective flow
- [ ] View objective details
- [ ] Start sprint (with/without quiz)
- [ ] Complete sprint
- [ ] View skill updates
- [ ] Take quiz (all question types)
- [ ] View skill map
- [ ] View performance dashboard
- [ ] Mobile responsiveness
- [ ] Accessibility (keyboard, screen reader)
- [ ] Error handling
- [ ] Loading states

**Acceptance Criteria:**
- All features working
- No console errors
- Responsive on all devices
- Accessible
- Performant
- Well documented

---

## 🎨 Design System Integration

### Colors
Use existing Tailwind theme colors:
- **Primary**: Main brand color
- **Success**: Green for mastered skills, passed quizzes
- **Warning**: Yellow for practicing skills
- **Danger**: Red for struggling skills
- **Info**: Blue for notifications

### Status Colors
```typescript
const statusColors = {
  struggling: 'text-red-600 bg-red-50',
  learning: 'text-yellow-600 bg-yellow-50',
  practicing: 'text-yellow-600 bg-yellow-50',
  proficient: 'text-green-600 bg-green-50',
  mastered: 'text-amber-600 bg-amber-50',
};
```

### Icons (Lucide React)
- **Objectives**: Target
- **Sprints**: Calendar, Zap
- **Skills**: Award, TrendingUp
- **Quizzes**: FileQuestion, CheckCircle
- **Difficulty**: Gauge, BarChart
- **Mastery**: Trophy, Star
- **Review**: RotateCw, AlertCircle

### Typography
- **Headings**: font-semibold
- **Body**: font-normal
- **Metrics**: font-medium, tracking-tight

---

## 🔧 Technical Considerations

### State Management
- Use TanStack Query for server state
- Use React Context for UI state (modals, notifications)
- Avoid prop drilling with composition

### Performance
- Lazy load quiz components
- Virtualize long skill lists
- Optimize images
- Code splitting by route

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### Error Handling
- API error boundaries
- User-friendly error messages
- Retry mechanisms
- Offline support (optional)

### Testing Strategy
- Unit tests for utilities
- Integration tests for hooks
- E2E tests for critical flows
- Manual testing for UX

---

## 📝 Implementation Notes

### Dependencies to Add
```json
{
  "recharts": "^2.10.0",  // For charts (optional)
  "react-confetti": "^6.1.0"  // For celebrations (optional)
}
```

### Environment Variables
```env
NEXT_PUBLIC_BASE_URL=https://api.lurnix.tech/api
```

### API Endpoints Reference
See `learning-system.md` for complete API documentation.

---

## 🚦 Progress Tracking

### Phase 1: Foundation ⏳
- [ ] Step 1.1: Models
- [ ] Step 1.2: Services
- [ ] Step 1.3: Hooks
- [ ] Step 1.4: ObjectivesList
- [ ] Step 1.5: ObjectiveCard
- [ ] Step 1.6: CreateObjectiveModal
- [ ] Step 1.7: Dashboard Integration

### Phase 2: Sprint Management ⏳
- [ ] Step 2.1: SprintCard
- [ ] Step 2.2: SprintDetails
- [ ] Step 2.3: SprintCompletion
- [ ] Step 2.4: Notifications

### Phase 3: Quiz System ⏳
- [ ] Step 3.1: Quiz Models & Services
- [ ] Step 3.2: QuizInterface
- [ ] Step 3.3: QuizResults
- [ ] Step 3.4: Quiz Integration

### Phase 4: Skills & Performance ⏳
- [ ] Step 4.1: SkillMap
- [ ] Step 4.2: SkillProgressWidget
- [ ] Step 4.3: PerformanceDashboard
- [ ] Step 4.4: Skill Details
- [ ] Step 4.5: Final Polish

---

## 🎯 Success Criteria

### MVP (Minimum Viable Product)
- Users can create and view objectives
- Users can view and complete sprints
- Skill updates are displayed after sprint completion
- Basic notifications work

### Full Feature Set
- All quiz types working
- Skill map visualization complete
- Performance dashboard with charts
- Mobile responsive
- Fully accessible

### Polish
- Smooth animations
- Celebration effects
- Comprehensive error handling
- Loading states everywhere
- Empty states
- User documentation

---

## 📚 Resources

- **API Documentation**: `learning-system.md`
- **Design System**: shadcn/ui components
- **Icons**: Lucide React
- **State Management**: TanStack Query docs
- **TypeScript**: Strict mode enabled

---

## 🤝 Next Steps

1. **Review this plan** with the team
2. **Start with Phase 1.1** (Create models)
3. **Work incrementally** through each step
4. **Test frequently** after each step
5. **Commit often** with descriptive messages
6. **Document as you go** (JSDoc comments)

---

**Ready to start building! 🚀**
