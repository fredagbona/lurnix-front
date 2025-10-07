# Getting Started with the Learning System

**Quick Start Guide** - 5 Minutes to Running System

---

## 🚀 Step 1: Install Dependencies (30 seconds)

```bash
pnpm install
```

This installs the new `@radix-ui/react-tabs` package.

---

## 🏃 Step 2: Start Development Server (10 seconds)

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎯 Step 3: Test the Learning System (4 minutes)

### **A. Create Your First Objective**

1. Navigate to Dashboard
2. Click **"New Objective"** button
3. Fill in the form:
   - **Title**: "Learn React Hooks"
   - **Description**: "Master useState, useEffect, and custom hooks"
   - **Success Criteria**: Add "Build 3 projects using hooks"
   - **Required Skills**: Add "React", "JavaScript"
   - **Priority**: Select 4 stars
4. Click **"Create Objective"**

✅ **Result**: Objective created and visible on dashboard

---

### **B. View Objective Details**

1. Click on your objective card
2. You'll see:
   - Progress stats (0% initially)
   - Success criteria
   - Required skills
   - "Generate Next Sprint" button

---

### **C. Generate a Sprint**

1. Click **"Generate Next Sprint"**
2. Wait for backend to generate sprint
3. Sprint card appears with:
   - Title and description
   - Difficulty level
   - Estimated hours
   - Skills to learn

✅ **Result**: First sprint ready to start

---

### **D. Complete a Sprint**

1. Click **"Start Sprint"** or **"Continue Sprint"**
2. Sprint details page opens
3. Check off tasks as you complete them:
   - Click each task to mark complete
   - Progress bar updates in real-time
4. Add a reflection (required):
   - "Learned about useState and how it manages component state"
5. Click **"Complete Sprint"**

✅ **Result**: Sprint completed, skill updates shown!

---

### **E. View Skill Updates**

After completing sprint, you'll see:
- 🎉 Celebration message
- 📊 Score (e.g., 85/100)
- 📈 Skills updated:
  - React Hooks: 0 → 45 (Learning)
  - JavaScript: 30 → 50 (Practicing)
- 💡 Recommendations

---

### **F. Take a Quiz (If Available)**

If a sprint has a quiz:

1. Click **"Take Quiz First"** (pre-sprint) or **"Take Validation Quiz"** (post-sprint)
2. Answer questions:
   - Multiple choice: Select one option
   - Multiple select: Select multiple
   - True/False: Pick true or false
   - Code questions: Type answer
3. Navigate between questions
4. Click **"Submit Quiz"**
5. View results:
   - Pass/fail status
   - Skill performance breakdown
   - Recommendations

---

### **G. View Skills Progress**

1. Navigate to **Skills** page (sidebar)
2. See your skill map:
   - Skills grouped by status
   - Progress bars per skill
   - Overall progress percentage
3. Switch to **Performance** tab:
   - Score trends
   - Learning velocity
   - Mastered skills
   - Struggling areas

---

## 📱 Navigation Guide

### **Main Pages**

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/dashboard` | Overview, quick access |
| Learning | `/objectives` | All objectives |
| Objective Details | `/objectives/[id]` | Single objective view |
| Sprint Details | `/objectives/[id]/sprints/[id]` | Complete sprint |
| Quiz | `/quizzes/[id]` | Take quiz |
| Skills | `/skills` | Skill map & performance |

### **Sidebar Menu**
- 🏠 **Dashboard** - Home
- 🎯 **Learning** - Objectives
- 📈 **Skills** - Skills & Performance
- 📚 **Roadmap** - Learning roadmap
- ⚡ **Features** - Feature flags
- ⚙️ **Settings** - User settings
- 💳 **Subscription** - Billing

---

## 🎨 UI Components Guide

### **Creating an Objective**
```tsx
import { CreateObjectiveModal } from "@/components/learning";

<CreateObjectiveModal 
  open={showModal} 
  onOpenChange={setShowModal} 
/>
```

### **Displaying Objectives**
```tsx
import { ObjectivesList } from "@/components/learning";

<ObjectivesList 
  limit={3}  // Optional: limit number shown
  onCreateClick={() => setShowModal(true)} 
/>
```

### **Showing a Sprint**
```tsx
import { SprintCard } from "@/components/learning";

<SprintCard 
  sprint={sprint} 
  objectiveId={objectiveId}
  showActions={true} 
/>
```

### **Quiz Interface**
```tsx
import { QuizInterface } from "@/components/quiz";

<QuizInterface 
  quiz={quiz}
  onSubmit={handleSubmit}
  isSubmitting={isSubmitting}
/>
```

### **Skills Widget**
```tsx
import { SkillProgressWidget } from "@/components/skills";

<SkillProgressWidget 
  skillMap={skillMap}
  objectiveId={objectiveId} 
/>
```

---

## 🔧 Configuration

### **Environment Variables**
```env
NEXT_PUBLIC_BASE_URL=https://api.lurnix.tech/api
```

### **API Base URL**
Configured in `src/services/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://api.lurnix.tech/api";
```

---

## 💡 Tips & Tricks

### **For Development**
- Use React Query DevTools to inspect cache
- Check Network tab for API calls
- Use browser console for debugging
- Hot reload works for all changes

### **For Testing**
- Create multiple objectives to test filtering
- Complete sprints to see skill progression
- Take quizzes to test all question types
- Check mobile responsiveness

### **For Debugging**
- Check browser console for errors
- Verify API responses in Network tab
- Use React DevTools to inspect component state
- Check TanStack Query cache

---

## 📊 Data Flow

```
User Action → Component → Hook → Service → API → Backend
                ↓
            TanStack Query Cache
                ↓
            Component Re-render
                ↓
            UI Update
```

### **Example: Creating Objective**
1. User fills form in `CreateObjectiveModal`
2. Clicks "Create Objective"
3. `useCreateObjective()` hook called
4. `objectivesService.createObjective()` makes API call
5. Backend creates objective
6. Response cached by TanStack Query
7. Cache invalidation triggers refetch
8. `ObjectivesList` re-renders with new objective
9. Toast notification shows success

---

## 🎯 Feature Flags

All features are enabled by default. No feature flags needed.

---

## 🔄 State Management

### **Server State (TanStack Query)**
- Objectives data
- Sprints data
- Skills data
- Performance data
- Quiz data

### **Local State (React useState)**
- Modal open/close
- Form inputs
- Current question index
- Task completion checkboxes

### **No Global State Needed**
- Everything is component-scoped or cached
- Clean and maintainable

---

## 🎨 Customization

### **Colors**
Edit `tailwind.config.ts` to change theme colors.

### **Icons**
All icons from Lucide React - easy to swap.

### **Animations**
Tailwind transitions - adjust duration in className.

### **Layout**
Responsive grid - adjust breakpoints as needed.

---

## 📦 Dependencies Added

```json
{
  "@radix-ui/react-tabs": "^1.1.1"
}
```

All other dependencies were already in the project!

---

## ✅ Verification Checklist

After installation, verify:

- [ ] `pnpm install` completed without errors
- [ ] `pnpm dev` starts successfully
- [ ] Dashboard loads without errors
- [ ] Can navigate to `/objectives`
- [ ] Can open create objective modal
- [ ] No TypeScript errors in terminal
- [ ] No console errors in browser

---

## 🎊 You're Ready!

The brain-adaptive learning system is fully implemented and ready to use.

**Start creating objectives and watch the magic happen!** ✨

---

## 📞 Need Help?

- **Implementation Details**: See `IMPLEMENTATION_PLAN.md`
- **API Documentation**: See `learning-system.md`
- **Progress History**: See `PROGRESS.md`
- **Full Documentation**: See `LEARNING_SYSTEM_README.md`

---

**Happy Learning! 🚀**
