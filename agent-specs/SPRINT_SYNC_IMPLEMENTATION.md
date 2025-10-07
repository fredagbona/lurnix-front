# Sprint Synchronization Implementation

## Overview

This implementation ensures accurate sprint status tracking and automatic generation until objective completion, following the complete learning flow documented in `complete-learning-flow.md`.

## Key Features

### 1. **Accurate Sprint Status Tracking**
- Real-time sprint completion status checking
- Generation status monitoring
- Objective completion detection

### 2. **Automatic Sprint Generation**
- Auto-generates next sprint upon completion
- Handles response with detailed feedback
- Validates generation success

### 3. **Robust Synchronization**
- Proper cache invalidation
- Polling mechanisms for status updates
- Error handling and recovery

### 4. **User Feedback**
- Detailed completion messages
- Status indicators
- Progress tracking

## Implementation Details

### New API Endpoints

#### 1. Sprint Completion Status
```typescript
GET /sprints/{sprintId}/completion-status
```
Returns:
- `isCompleted`: Whether sprint is completed
- `completedAt`: Completion timestamp
- `canComplete`: If sprint can be completed now
- `reason`: Why it can't be completed (if applicable)

#### 2. Generation Status
```typescript
GET /objectives/{objectiveId}/sprints/generation-status
```
Returns:
- `canGenerate`: Whether new sprint can be generated
- `reason`: Why generation is blocked (if applicable)
- `currentSprintId`: Active sprint ID
- `nextSprintDay`: Next day number
- `objectiveCompleted`: If objective is complete

#### 3. Manual Sprint Generation
```typescript
POST /objectives/{objectiveId}/sprints/generate-next
```
Body:
```json
{
  "force": false
}
```

### New Hooks

#### 1. `useSprintCompletionStatus(sprintId)`
Checks if a sprint is completed and can be marked as done.

#### 2. `useGenerationStatus(objectiveId, enablePolling)`
Monitors sprint generation status for an objective. Can enable polling for real-time updates.

#### 3. `useGenerateNextSprint()`
Manually triggers next sprint generation.

#### 4. `useSprintCompletion({ objectiveId, sprintId, onSuccess, onError })`
**Main hook for completing sprints** - handles the entire completion flow:
1. Submits sprint completion
2. Processes response (auto-generation, skill updates, etc.)
3. Shows detailed feedback
4. Invalidates caches
5. Navigates back to objective

### New Components

#### 1. `SprintStatusMonitor`
Real-time status monitor that:
- Auto-refreshes every 5 seconds
- Shows current generation status
- Displays objective completion state
- Provides visual feedback

**Usage:**
```tsx
<SprintStatusMonitor 
  objectiveId={objectiveId}
  onStatusChange={(status) => {
    // Handle status changes
  }}
/>
```

### Updated Components

#### 1. Sprint Details Page (`/objectives/[objectiveId]/sprints/[sprintId]/page.tsx`)

**Changes:**
- Uses `useSprintCompletion` hook for robust completion
- Syncs completed tasks from sprint progress
- Shows detailed completion status
- Handles auto-generation feedback

**Key Features:**
- Task completion tracking
- Progress synchronization
- Reflection requirement
- Evidence upload (placeholder)
- Detailed completion messages

#### 2. Objective Details Page (`/objectives/[objectiveId]/page.tsx`)

**Changes:**
- Added `useGenerationStatus` for real-time status
- Manual refresh button for status sync
- Generation status indicator
- Objective completion card

**Key Features:**
- Shows next sprint day number
- Indicates if objective is complete
- Manual refresh capability
- Clear generation blocking reasons

### Updated Models

#### `MicroTask` Interface
Added optional fields to match API response:
```typescript
interface MicroTask {
  id: string;
  title: string;
  description: string;
  instructions?: string;  // NEW
  completed: boolean;
  estimatedMinutes: number;
  acceptanceTest?: {      // NEW
    spec: string[];
  };
  resources?: string[];   // NEW
}
```

## Complete Flow

### Sprint Completion Flow

```
1. User completes all tasks
   ↓
2. User adds reflection
   ↓
3. User clicks "Complete Sprint"
   ↓
4. useSprintCompletion.complete() called
   ↓
5. POST /sprints/{sprintId}/complete
   ↓
6. Backend processes:
   - Marks sprint complete
   - Updates skills
   - Analyzes performance
   - Auto-generates next sprint (if not at goal)
   ↓
7. Frontend receives response:
   - nextSprintGenerated: true/false
   - nextSprint: { id, dayNumber, lengthDays }
   - brainAdaptive: { skillsUpdated, performanceAnalysis }
   - notifications: []
   ↓
8. Frontend shows detailed toast:
   - "Sprint completed! 🎉"
   - "Next sprint (Day X) generated automatically!"
   - "Y skills updated"
   ↓
9. Cache invalidation:
   - Sprint detail
   - Objective detail
   - Objectives list
   ↓
10. Navigate to objective page
    ↓
11. Page shows new current sprint (auto-generated)
```

### Status Synchronization

```
Objective Page Load
   ↓
useGenerationStatus() fetches status
   ↓
Shows current state:
   - "Ready to generate Day X" (can generate)
   - "Sprint In Progress" (has current sprint)
   - "Objective Completed!" (all done)
   ↓
User can click refresh button to sync
   ↓
Status updates in real-time
```

## Error Handling

### Sprint Completion Errors
- Network failures: Shows error toast, doesn't navigate
- Validation errors: Shows specific error message
- Auto-generation failures: Completes sprint but shows warning

### Status Check Errors
- Graceful degradation
- Manual refresh option
- Clear error messages

## Testing Checklist

- [ ] Complete sprint with all tasks done
- [ ] Verify next sprint auto-generates
- [ ] Check skill updates appear in toast
- [ ] Confirm objective page shows new sprint
- [ ] Test with incomplete tasks (should block)
- [ ] Test without reflection (should block)
- [ ] Verify generation status updates
- [ ] Test manual refresh button
- [ ] Check objective completion detection
- [ ] Verify past sprints display correctly

## API Integration

### Required Backend Endpoints

All endpoints from `complete-learning-flow.md`:
- ✅ `POST /api/objectives` - Create objective
- ✅ `POST /api/objectives/{objectiveId}/sprints/generate` - Generate initial sprint
- ✅ `POST /api/objectives/{objectiveId}/sprints/{sprintId}/expand` - Expand sprint
- ✅ `PUT /api/sprints/{sprintId}/progress` - Update progress
- ✅ `POST /api/objectives/{objectiveId}/sprints/{sprintId}/evidence` - Submit evidence
- ✅ `POST /api/objectives/{objectiveId}/sprints/{sprintId}/review` - Request review
- ✅ `POST /api/sprints/{sprintId}/complete` - Complete sprint (triggers auto-gen)
- ✅ `GET /api/sprints/{sprintId}/completion-status` - Check completion status
- ✅ `GET /api/objectives/{objectiveId}/sprints/generation-status` - Check generation status
- ✅ `POST /api/objectives/{objectiveId}/sprints/generate-next` - Manual generation

## Benefits

1. **No More Sync Issues**: Proper cache invalidation ensures UI always shows correct state
2. **Better UX**: Detailed feedback on what happened during completion
3. **Automatic Flow**: Next sprint generates automatically, user just continues learning
4. **Error Recovery**: Manual refresh and generation options if auto-gen fails
5. **Real-time Status**: Always know if you can generate, are in progress, or completed

## Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Optimistic UI updates for faster perceived performance
- [ ] Batch sprint generation for planning ahead
- [ ] Sprint scheduling and reminders
- [ ] Evidence upload implementation
- [ ] Review system integration
