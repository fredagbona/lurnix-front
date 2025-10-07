# Complete Learning Flow - Frontend Implementation Guide

**Date:** 2025-10-03  
**Version:** 1.0  
**Target:** Frontend Team

---

## 🎯 Overview

This guide provides a **step-by-step walkthrough** of the complete learning journey in Lurnix, from creating an objective to completing sprints with the brain-adaptive learning system. Each step includes the exact API endpoints, payloads, and expected responses.

---

## 📊 Complete User Journey

```
1. Create Objective
   ↓
2. Generate Initial Sprint
   ↓
3. View Sprint Details
   ↓
4. (Optional) Take Pre-Sprint Quiz
   ↓
5. Complete Sprint Tasks
   ↓
6. Submit Sprint Evidence
   ↓
7. (Optional) Take Post-Sprint Quiz
   ↓
8. View Skill Progress Updates
   ↓
9. Expand/Generate Next Sprint
   ↓
10. Repeat from Step 3
```

---

## 🚀 Step-by-Step Flow

### **Step 1: Create Objective**

**Purpose:** User defines their learning goal with success criteria and required skills.

#### Endpoint
```
POST /api/objectives
```

#### Headers
```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

#### Request Payload
```json
{
  "title": "Master DevOps",
  "description": "I want to know everything about DevOps, go from dev to prod with tools like GitHub Actions, Docker, Kubernetes, build CI/CD pipelines",
  "priority": 4,
  "successCriteria": [
    "Automate deployment in many environments like dev, staging and prod",
    "Build CI/CD pipelines with GitHub Actions",
    "Deploy applications using Docker and Kubernetes"
  ],
  "requiredSkills": [
    "GitHub Actions",
    "Docker",
    "Kubernetes",
    "CI/CD"
  ],
  "learnerProfileId": "profile-uuid" // Optional
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "objective": {
      "id": "57ee8658-29cf-4e61-ba3b-e77a810d95dd",
      "title": "Master DevOps",
      "description": "I want to know everything about DevOps...",
      "priority": 4,
      "status": "active",
      "estimatedTotalWeeks": { "min": 12, "max": 16 },
      "estimatedTotalDays": 240,
      "estimatedDailyHours": 2.5,
      "currentDay": 1,
      "completedDays": 0,
      "progressPercentage": 0,
      "successCriteria": [...],
      "requiredSkills": [...],
      "currentSprintId": null,
      "currentSprint": null,
      "pastSprints": [],
      "progress": {
        "sprintsDone": 0,
        "sprintsPlanned": 0,
        "percent": 0
      },
      "totalSprints": 0,
      "learningVelocity": 1.0,
      "currentDifficulty": 50,
      "createdAt": "2025-10-03T12:00:00Z",
      "updatedAt": "2025-10-03T12:00:00Z",
      "limits": {
        "canGenerateSprint": true,
        "sprintsRemaining": 10,
        "reason": null
      }
    },
    "planLimits": {
      "planType": "pro",
      "objectiveCount": 1,
      "maxObjectives": 10,
      "canCreateObjective": true,
      "canGenerateSprint": true,
      "sprintsRemaining": 10
    }
  },
  "timestamp": "2025-10-03T12:00:00Z"
}
```

#### Frontend Actions
- Display success message
- Show estimated timeline (240 days, 2.5 hours/day)
- Show "Generate First Sprint" button
- Display success criteria as checklist
- Show learning velocity (1.0x) and difficulty (50/100)

---

### **Step 2: Generate Initial Sprint**

**Purpose:** AI generates the first day's learning sprint based on the objective.

#### Endpoint
```
POST /api/objectives/:objectiveId/sprints
```

#### Headers
```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

#### Request Payload
```json
{
  "preferLength": 1,  // 1 day sprint
  "mode": "initial"   // or "expansion" for subsequent sprints
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "sprint": {
      "id": "sprint-123",
      "objectiveId": "57ee8658-29cf-4e61-ba3b-e77a810d95dd",
      "dayNumber": 1,
      "title": "DevOps Fundamentals - Day 1",
      "description": "Introduction to DevOps principles and culture",
      "lengthDays": 1,
      "totalEstimatedHours": 2.5,
      "difficulty": "beginner",
      "difficultyScore": 50,
      "status": "planned",
      "targetSkills": ["skill-1", "skill-2"],
      "isReviewSprint": false,
      "projects": [
        {
          "id": "proj-1",
          "title": "DevOps Culture Research",
          "description": "Research and document DevOps principles",
          "estimatedHours": 1.5,
          "deliverables": [
            "Document explaining DevOps culture",
            "List of key DevOps practices"
          ]
        }
      ],
      "microTasks": [
        {
          "id": "task-1",
          "title": "Read DevOps introduction",
          "description": "Read chapters 1-2 of DevOps handbook",
          "estimatedMinutes": 30,
          "completed": false
        },
        {
          "id": "task-2",
          "title": "Watch DevOps overview video",
          "description": "Watch 'What is DevOps' tutorial",
          "estimatedMinutes": 20,
          "completed": false
        }
      ],
      "portfolioCards": [],
      "adaptationNotes": null,
      "progress": {
        "completedTasks": 0,
        "completedDays": 0,
        "scoreEstimate": null
      },
      "startedAt": null,
      "completedAt": null,
      "score": null,
      "metadata": {
        "provider": "groq",
        "model": "llama-3.3-70b-versatile",
        "generatedAt": "2025-10-03T12:05:00Z"
      },
      "evidence": {
        "artifacts": [],
        "selfEvaluation": null
      },
      "review": {
        "status": "not_requested",
        "reviewedAt": null,
        "score": null,
        "summary": null,
        "projectSummaries": [],
        "metadata": null
      },
      "quizzes": []
    },
    "objective": {
      "id": "57ee8658-29cf-4e61-ba3b-e77a810d95dd",
      "currentSprintId": "sprint-123",
      "currentDay": 1,
      "totalSprints": 1,
      "limits": {
        "canGenerateSprint": true,
        "sprintsRemaining": 9
      }
    }
  },
  "timestamp": "2025-10-03T12:05:00Z"
}
```

#### Frontend Actions
- Display sprint title and description
- Show difficulty level (beginner/intermediate/advanced)
- List projects with deliverables
- Show micro-tasks checklist
- Display estimated hours (2.5h)
- Show "Start Sprint" button
- If quiz exists, show "Take Readiness Quiz" button

---

### **Step 3: View Sprint Details**

**Purpose:** User opens the sprint to see all tasks and requirements.

#### Endpoint
```
GET /api/sprints/:sprintId
```

#### Headers
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "sprint": {
      "id": "sprint-123",
      "objectiveId": "57ee8658-29cf-4e61-ba3b-e77a810d95dd",
      "dayNumber": 1,
      "title": "DevOps Fundamentals - Day 1",
      "description": "Introduction to DevOps principles and culture",
      "lengthDays": 1,
      "totalEstimatedHours": 2.5,
      "difficulty": "beginner",
      "difficultyScore": 50,
      "status": "planned",
      "targetSkills": ["skill-1", "skill-2"],
      "isReviewSprint": false,
      "projects": [...],
      "microTasks": [...],
      "portfolioCards": [],
      "quizzes": [
        {
          "id": "quiz-789",
          "type": "pre_sprint",
          "title": "Readiness Check: DevOps Basics",
          "passingScore": 70,
          "attemptsAllowed": 3
        }
      ],
      "progress": {
        "completedTasks": 0,
        "completedDays": 0,
        "scoreEstimate": null
      }
    }
  },
  "timestamp": "2025-10-03T12:10:00Z"
}
```

#### Frontend Actions
- Display sprint overview
- Show difficulty indicator (50/100)
- List all projects and tasks
- If pre-sprint quiz exists, show quiz button
- Show "Start Working" button

---

### **Step 4: (Optional) Take Pre-Sprint Quiz**

**Purpose:** Validate user has prerequisite knowledge before starting sprint.

#### Step 4A: Check Sprint Readiness

**Endpoint:**
```
GET /api/sprints/:sprintId/readiness
```

**Response:**
```json
{
  "success": true,
  "data": {
    "canStart": false,
    "reason": "You must complete the readiness quiz before starting this sprint.",
    "requiredQuiz": {
      "id": "quiz-789",
      "title": "Readiness Check: DevOps Basics",
      "passingScore": 70,
      "attemptsAllowed": 3,
      "attemptsUsed": 0
    }
  },
  "timestamp": "2025-10-03T12:15:00Z"
}
```

#### Step 4B: Get Quiz Questions

**Endpoint:**
```
GET /api/quizzes/:quizId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "quiz": {
      "id": "quiz-789",
      "title": "Readiness Check: DevOps Basics",
      "description": "Test your prerequisite knowledge",
      "passingScore": 70,
      "timeLimit": 15,
      "attemptsAllowed": 3,
      "questions": [
        {
          "id": "q1",
          "type": "multiple_choice",
          "question": "What is the primary goal of DevOps?",
          "options": [
            { "id": "a", "text": "Faster deployment" },
            { "id": "b", "text": "Better collaboration" },
            { "id": "c", "text": "Automated testing" },
            { "id": "d", "text": "All of the above" }
          ],
          "points": 1,
          "sortOrder": 1
        },
        {
          "id": "q2",
          "type": "true_false",
          "question": "DevOps is only about automation tools.",
          "points": 1,
          "sortOrder": 2
        },
        {
          "id": "q3",
          "type": "multiple_select",
          "question": "Which are DevOps practices? (Select all)",
          "options": [
            { "id": "a", "text": "Continuous Integration" },
            { "id": "b", "text": "Continuous Deployment" },
            { "id": "c", "text": "Waterfall Development" },
            { "id": "d", "text": "Infrastructure as Code" }
          ],
          "points": 2,
          "sortOrder": 3
        }
      ]
    }
  },
  "timestamp": "2025-10-03T12:16:00Z"
}
```

#### Step 4C: Submit Quiz

**Endpoint:**
```
POST /api/quizzes/:quizId/submit
```

**Request:**
```json
{
  "answers": [
    { "questionId": "q1", "answer": "d" },
    { "questionId": "q2", "answer": false },
    { "questionId": "q3", "answer": ["a", "b", "d"] }
  ],
  "timeSpent": 180
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "result": {
      "attemptId": "attempt-123",
      "score": 85,
      "passed": true,
      "totalQuestions": 3,
      "correctAnswers": 3,
      "timeSpent": 180,
      "skillScores": {
        "skill-1": 90,
        "skill-2": 80
      },
      "weakAreas": [],
      "recommendations": [
        "Great job! You're ready to start.",
        "Strong understanding of DevOps fundamentals."
      ],
      "attemptsRemaining": 2
    }
  },
  "timestamp": "2025-10-03T12:20:00Z"
}
```

#### Frontend Actions
- Display quiz interface with timer
- Show questions based on type:
  - `multiple_choice`: Radio buttons
  - `multiple_select`: Checkboxes
  - `true_false`: True/False buttons
  - `code_output`: Text input
  - `short_answer`: Text area
- After submission:
  - Show score with pass/fail indicator
  - Display skill-level performance
  - Show recommendations
  - If passed: Enable "Start Sprint"
  - If failed: Show "Try Again" with attempts remaining

---

### **Step 5: Complete Sprint Tasks**

**Purpose:** User works through sprint tasks and marks them complete.

#### Endpoint (Mark Task Complete)
```
PATCH /api/sprints/:sprintId/tasks/:taskId
```

**Request:**
```json
{
  "completed": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task-1",
      "completed": true,
      "completedAt": "2025-10-03T14:30:00Z"
    },
    "progress": {
      "completedTasks": 1,
      "totalTasks": 5,
      "completionPercentage": 20
    }
  },
  "timestamp": "2025-10-03T14:30:00Z"
}
```

#### Frontend Actions
- Update task checkbox
- Update progress bar
- Show completion percentage
- When all tasks done, enable "Submit Sprint" button

---

### **Step 6: Submit Sprint Evidence**

**Purpose:** User submits completed sprint with evidence and self-evaluation.

#### Endpoint
```
POST /api/sprints/:sprintId/complete
```

#### Request Payload
```json
{
  "tasksCompleted": 5,
  "totalTasks": 5,
  "hoursSpent": 2.5,
  "evidenceSubmitted": true,
  "reflection": "Learned a lot about DevOps fundamentals. The CI/CD concepts are clearer now.",
  "artifacts": [
    {
      "type": "repository",
      "title": "DevOps Research Document",
      "url": "https://github.com/user/devops-research",
      "notes": "Comprehensive research on DevOps practices"
    }
  ],
  "selfEvaluation": {
    "confidence": 4,
    "understanding": 4,
    "readyForNext": true
  }
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "sprintCompleted": true,
    "dayCompleted": 1,
    "nextSprintGenerated": false,
    "nextSprint": null,
    "progress": {
      "currentDay": 2,
      "totalDays": 240,
      "progressPercentage": 0.4
    },
    
    // NEW: Brain-adaptive results
    "brainAdaptive": {
      "skillsUpdated": [
        {
          "skillId": "skill-1",
          "skillName": "DevOps Fundamentals",
          "previousLevel": 0,
          "newLevel": 25,
          "statusChanged": true,
          "newStatus": "learning",
          "masteredNow": false
        },
        {
          "skillId": "skill-2",
          "skillName": "CI/CD Basics",
          "previousLevel": 0,
          "newLevel": 20,
          "statusChanged": true,
          "newStatus": "learning",
          "masteredNow": false
        }
      ],
      "performanceAnalysis": {
        "averageScore": 88.5,
        "trend": "stable",
        "recommendedAction": "maintain"
      },
      "adaptationApplied": false,
      "nextSprintAdjusted": false,
      "reviewSprintNeeded": false,
      "notifications": [
        {
          "type": "sprint_completed",
          "title": "Day 1 Complete! 🎉",
          "message": "Great start! Keep up the momentum."
        }
      ]
    },
    
    "notifications": [
      {
        "type": "sprint_completed",
        "title": "Day 1 Complete! 🎉",
        "message": "Score: 88/100"
      }
    ]
  },
  "timestamp": "2025-10-03T16:00:00Z"
}
```

#### Frontend Actions
- Show completion celebration animation
- Display skill progress updates:
  ```
  Skills Updated:
  ✅ DevOps Fundamentals: 0 → 25 (Learning)
  ✅ CI/CD Basics: 0 → 20 (Learning)
  ```
- Show performance trend (stable/improving/declining)
- Display notifications
- Show "Generate Next Sprint" or "Take Validation Quiz" button

---

### **Step 7: (Optional) Take Post-Sprint Quiz**

**Purpose:** Validate knowledge gained during the sprint.

#### Step 7A: Check Sprint Validation

**Endpoint:**
```
GET /api/sprints/:sprintId/validation
```

**Response:**
```json
{
  "success": true,
  "data": {
    "canProgress": false,
    "reason": "You must complete the validation quiz before progressing.",
    "quizScore": null,
    "requiredScore": 80,
    "quiz": {
      "id": "quiz-790",
      "title": "Validation Quiz: DevOps Fundamentals",
      "passingScore": 80
    }
  },
  "timestamp": "2025-10-03T16:05:00Z"
}
```

#### Step 7B: Take Quiz (Same as Step 4B & 4C)

**Get Questions:**
```
GET /api/quizzes/:quizId
```

**Submit Answers:**
```
POST /api/quizzes/:quizId/submit
```

**Response includes skill-level performance and weak areas**

#### Frontend Actions
- Same quiz interface as pre-sprint
- After passing: Enable "Continue to Next Sprint"
- Show skill improvements from quiz results

---

### **Step 8: View Skill Progress Updates**

**Purpose:** User sees their skill map and progress.

#### Endpoint
```
GET /api/users/me/skills?objectiveId=57ee8658-29cf-4e61-ba3b-e77a810d95dd
```

#### Response
```json
{
  "success": true,
  "data": {
    "skillMap": {
      "userId": "user-123",
      "skills": [
        {
          "skillId": "skill-1",
          "skillName": "DevOps Fundamentals",
          "level": 25,
          "status": "learning",
          "successRate": 0.88,
          "practiceCount": 1,
          "lastPracticedAt": "2025-10-03T16:00:00Z",
          "nextReviewAt": "2025-10-04T16:00:00Z",
          "needsReview": false
        },
        {
          "skillId": "skill-2",
          "skillName": "CI/CD Basics",
          "level": 20,
          "status": "learning",
          "successRate": 0.85,
          "practiceCount": 1,
          "lastPracticedAt": "2025-10-03T16:00:00Z",
          "nextReviewAt": "2025-10-04T16:00:00Z",
          "needsReview": false
        }
      ],
      "masteredSkills": [],
      "strugglingAreas": [],
      "inProgress": ["DevOps Fundamentals", "CI/CD Basics"],
      "notStarted": ["Docker", "Kubernetes", "GitHub Actions"],
      "overallProgress": 10
    }
  },
  "timestamp": "2025-10-03T16:10:00Z"
}
```

#### Frontend Actions
- Display skill tree/map visualization
- Show skill levels with progress bars (0-100)
- Color-code by status:
  - 🔴 Struggling (red)
  - 🟡 Learning/Practicing (yellow)
  - 🟢 Proficient (light green)
  - 🏆 Mastered (gold)
- Show "Needs Review" badge for overdue skills
- Display overall progress percentage

---

### **Step 9: Expand/Generate Next Sprint**

**Purpose:** Generate the next day's sprint, potentially with adjusted difficulty.

#### Endpoint
```
POST /api/objectives/:objectiveId/sprints
```

#### Request Payload
```json
{
  "preferLength": 1,
  "mode": "expansion",
  "expansionGoal": "Continue with GitHub Actions basics"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "sprint": {
      "id": "sprint-124",
      "objectiveId": "57ee8658-29cf-4e61-ba3b-e77a810d95dd",
      "dayNumber": 2,
      "title": "GitHub Actions - Introduction",
      "description": "Learn GitHub Actions basics and create first workflow",
      "lengthDays": 1,
      "totalEstimatedHours": 2.5,
      "difficulty": "beginner",
      "difficultyScore": 52,  // Slightly increased from 50
      "status": "planned",
      "targetSkills": ["skill-3", "skill-4"],
      "isReviewSprint": false,
      "adaptedFrom": "maintained",
      "adaptationReason": "Performance is stable, maintaining current difficulty",
      "projects": [...],
      "microTasks": [...],
      "portfolioCards": [],
      "adaptationNotes": null,
      "progress": {
        "completedTasks": 0,
        "completedDays": 0,
        "scoreEstimate": null
      }
    },
    "objective": {
      "id": "57ee8658-29cf-4e61-ba3b-e77a810d95dd",
      "currentSprintId": "sprint-124",
      "currentDay": 2,
      "totalSprints": 2,
      "currentDifficulty": 52,
      "learningVelocity": 1.0,
      "limits": {
        "canGenerateSprint": true,
        "sprintsRemaining": 8
      }
    }
  },
  "timestamp": "2025-10-03T16:15:00Z"
}
```

#### Frontend Actions
- Display new sprint
- Show difficulty adjustment if any
- Highlight adaptation notes
- Show "Start Sprint" button
- Display learning velocity (1.0x = normal pace)

---

## 🔄 Adaptive Learning Scenarios

### **Scenario 1: User Performing Well (3+ High Scores)**

After completing 3 sprints with scores >90%:

**Sprint Completion Response:**
```json
{
  "brainAdaptive": {
    "performanceAnalysis": {
      "averageScore": 93.5,
      "trend": "improving",
      "recommendedAction": "increase_difficulty"
    },
    "adaptationApplied": true,
    "nextSprintAdjusted": true,
    "notifications": [
      {
        "type": "difficulty_increased",
        "title": "Difficulty Increased! 🚀",
        "message": "You're doing great! We've increased the difficulty to challenge you more."
      }
    ]
  }
}
```

**Next Sprint:**
```json
{
  "sprint": {
    "difficultyScore": 65,  // Increased from 50
    "adaptedFrom": "increased",
    "adaptationReason": "User consistently scoring >90%, increased difficulty by 15 points"
  },
  "objective": {
    "currentDifficulty": 65,
    "learningVelocity": 1.2  // 20% faster
  }
}
```

### **Scenario 2: User Struggling (2+ Low Scores)**

After 2 sprints with scores <70%:

**Sprint Completion Response:**
```json
{
  "brainAdaptive": {
    "performanceAnalysis": {
      "averageScore": 65.0,
      "trend": "declining",
      "recommendedAction": "decrease_difficulty"
    },
    "adaptationApplied": true,
    "nextSprintAdjusted": true,
    "notifications": [
      {
        "type": "difficulty_decreased",
        "title": "Pace Adjusted 📚",
        "message": "We've adjusted the pace to help you master the fundamentals."
      }
    ]
  }
}
```

**Next Sprint:**
```json
{
  "sprint": {
    "difficultyScore": 35,  // Decreased from 50
    "adaptedFrom": "decreased",
    "adaptationReason": "User struggling with recent sprints, decreased difficulty by 15 points"
  },
  "objective": {
    "currentDifficulty": 35,
    "learningVelocity": 0.8  // 20% slower, more time to learn
  }
}
```

### **Scenario 3: Review Sprint Needed**

When 3+ skills are overdue for review:

**Sprint Generation Response:**
```json
{
  "sprint": {
    "id": "sprint-125",
    "title": "Review: DevOps & CI/CD Fundamentals",
    "isReviewSprint": true,
    "targetSkills": ["skill-1", "skill-2", "skill-3"],
    "projects": [
      {
        "title": "DevOps Concepts Review",
        "description": "Review and reinforce DevOps fundamentals"
      }
    ]
  },
  "notifications": [
    {
      "type": "review_needed",
      "title": "Review Sprint Recommended 🔄",
      "message": "3 skills are overdue for review to ensure retention."
    }
  ]
}
```

---

## 📊 Performance Dashboard

### View Performance Stats

**Endpoint:**
```
GET /api/users/me/performance?objectiveId=57ee8658-29cf-4e61-ba3b-e77a810d95dd
```

**Response:**
```json
{
  "success": true,
  "data": {
    "performance": {
      "averageScore": 88.5,
      "trend": "improving",
      "recentScores": [85, 87, 92, 88, 90],
      "consistentlyHigh": false,
      "consistentlyLow": false,
      "strugglingSkills": [],
      "masteredSkills": [],
      "recommendedAction": "maintain",
      "currentDifficulty": 52,
      "learningVelocity": 1.0,
      "estimatedCompletion": "2025-12-15"
    }
  },
  "timestamp": "2025-10-03T16:20:00Z"
}
```

**Frontend Display:**
- Line chart of recent scores
- Trend indicator (📈 improving, ➡️ stable, 📉 declining)
- Current difficulty level (0-100)
- Learning velocity (0.5x - 2.0x)
- Estimated completion date
- Struggling skills with "Practice" button
- Mastered skills with celebration icons

---

## 🎯 Key Frontend Components Needed

### 1. **Objective Creation Form**
- Title input
- Description textarea
- Success criteria (dynamic list)
- Required skills (tags/chips)
- Priority selector (1-5)

### 2. **Sprint Card**
```
┌─────────────────────────────────────┐
│ Day 2: GitHub Actions - Introduction│
│                                     │
│ Difficulty: Beginner (52/100) 📊   │
│ Skills: GitHub Actions, CI/CD       │
│ Time: 2.5 hours                     │
│                                     │
│ 📝 Readiness Quiz Required          │
│ [Take Quiz First]                   │
└─────────────────────────────────────┘
```

### 3. **Quiz Interface**
```
┌─────────────────────────────────────┐
│ Readiness Check: DevOps Basics      │
│ Time: 12:45 / 15:00                 │
│ Question 3 of 5                     │
├─────────────────────────────────────┤
│ What is the primary goal of DevOps? │
│                                     │
│ ○ A. Faster deployment              │
│ ○ B. Better collaboration           │
│ ○ C. Automated testing              │
│ ○ D. All of the above               │
│                                     │
│ [Previous] [Next]                   │
└─────────────────────────────────────┘
```

### 4. **Quiz Results**
```
┌─────────────────────────────────────┐
│ Quiz Results                        │
├─────────────────────────────────────┤
│ Score: 85% ✅ PASSED                │
│                                     │
│ 3 / 3 correct                       │
│ Time: 3:00                          │
│                                     │
│ Skill Performance:                  │
│ • DevOps Fundamentals: 90% 🟢       │
│ • CI/CD Basics: 80% 🟡              │
│                                     │
│ Recommendations:                    │
│ • Great job! You're ready to start. │
│                                     │
│ [Start Sprint]                      │
└─────────────────────────────────────┘
```

### 5. **Skill Map**
```
┌─────────────────────────────────────┐
│ Skill Map - Master DevOps           │
├─────────────────────────────────────┤
│ DevOps Fundamentals                 │
│ ├─ Core Concepts [████████░░] 80% 🟢│
│ ├─ CI/CD Basics [██████░░░░] 60% 🟡 │
│ └─ Culture [████████░░] 75% 🟢      │
│                                     │
│ GitHub Actions                      │
│ ├─ Workflows [████░░░░░░] 40% 🟡    │
│ └─ Automation [██░░░░░░░░] 20% 🟡   │
│                                     │
│ Docker                              │
│ └─ Containers [░░░░░░░░░░] 0% ⚪    │
│    Not started                      │
└─────────────────────────────────────┘
```

### 6. **Performance Dashboard**
```
┌─────────────────────────────────────┐
│ Your Performance                    │
├─────────────────────────────────────┤
│ Average Score: 88.5% 📈 Improving   │
│                                     │
│ [Score Chart: 85, 87, 92, 88, 90]  │
│                                     │
│ Current Difficulty: 52/100          │
│ Learning Pace: 1.0x                 │
│                                     │
│ Estimated Completion: Dec 15, 2025  │
└─────────────────────────────────────┘
```

### 7. **Notification Toast**
```
┌─────────────────────────────────────┐
│ 🏆 Skill Mastered!                  │
│ You've mastered DevOps Fundamentals!│
│                                     │
│ [View Skills] [Dismiss]             │
└─────────────────────────────────────┘
```

---

## 🔔 Notification Types to Handle

### 1. **Skill Mastered**
```json
{
  "type": "skill_mastered",
  "title": "Skill Mastered! 🏆",
  "message": "You've mastered DevOps Fundamentals!"
}
```
**Action:** Show celebration animation, confetti

### 2. **Difficulty Increased**
```json
{
  "type": "difficulty_increased",
  "title": "Difficulty Increased! 🚀",
  "message": "You're doing great! We've increased the difficulty."
}
```
**Action:** Show modal explaining adjustment

### 3. **Difficulty Decreased**
```json
{
  "type": "difficulty_decreased",
  "title": "Pace Adjusted 📚",
  "message": "We've adjusted the pace to help you master the fundamentals."
}
```
**Action:** Show supportive message

### 4. **Review Needed**
```json
{
  "type": "review_needed",
  "title": "Review Sprint Recommended 🔄",
  "message": "3 skills are overdue for review."
}
```
**Action:** Highlight next sprint as review sprint

---

## 📝 Error Handling

### Common Errors

#### 1. **Quiz Attempts Exhausted**
```json
{
  "success": false,
  "error": {
    "code": "NO_ATTEMPTS_REMAINING",
    "message": "No attempts remaining for this quiz"
  },
  "timestamp": "2025-10-03T16:30:00Z"
}
```
**Frontend:** Show message with review resources

#### 2. **Sprint Generation Limit Reached**
```json
{
  "success": false,
  "error": {
    "code": "SPRINT_LIMIT_REACHED",
    "message": "You've reached your sprint generation limit for this plan"
  },
  "timestamp": "2025-10-03T16:30:00Z"
}
```
**Frontend:** Show upgrade plan modal

#### 3. **Quiz Not Passed**
```json
{
  "data": {
    "result": {
      "score": 65,
      "passed": false,
      "attemptsRemaining": 2,
      "recommendations": [
        "Review DevOps fundamentals",
        "Focus on CI/CD concepts"
      ]
    }
  }
}
```
**Frontend:** Show retry button with recommendations

---

## ✅ Implementation Checklist

### Phase 1: Basic Flow (Week 1)
- [ ] Objective creation form
- [ ] Sprint generation
- [ ] Sprint display with tasks
- [ ] Task completion tracking
- [ ] Sprint submission
- [ ] Skill progress display

### Phase 2: Quiz System (Week 2)
- [ ] Quiz interface (all question types)
- [ ] Quiz results screen
- [ ] Pre-sprint readiness check
- [ ] Post-sprint validation
- [ ] Attempt tracking

### Phase 3: Adaptive Learning (Week 3)
- [ ] Skill map visualization
- [ ] Performance dashboard
- [ ] Difficulty indicators
- [ ] Adaptation notifications
- [ ] Review sprint handling

### Phase 4: Polish (Week 4)
- [ ] Animations and transitions
- [ ] Error handling
- [ ] Loading states
- [ ] Responsive design
- [ ] Accessibility

---

## 🚀 Summary

**Complete Flow:**
1. ✅ Create Objective → AI estimates duration
2. ✅ Generate Sprint → AI creates personalized learning plan
3. ✅ (Optional) Pre-Quiz → Validate readiness
4. ✅ Complete Tasks → Track progress
5. ✅ Submit Sprint → Get skill updates
6. ✅ (Optional) Post-Quiz → Validate learning
7. ✅ View Progress → See skill improvements
8. ✅ Next Sprint → Difficulty adapts automatically
9. ✅ Repeat → Continue learning journey

**All endpoints are ready!** Frontend just needs to consume them and build the UI. 🎉
