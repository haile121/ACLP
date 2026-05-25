# Goal Description

The user wants to divide the C++ curriculum roughly into three tiers: Beginner, Intermediate, and Advanced. Instead of treating the entire track as one 0-100% progress journey, the progression should adapt based on the user's current level:
- Both unlocked and tracked progress is tiered. 
- A user starts as Beginner. They see only the Beginner course. To unlock Intermediate, they must complete at least 60% of Beginner.
- Once Intermediate is unlocked, they see both Beginner and Intermediate, but their primary progress tracking (e.g., in overall rings/bars) reflects their Intermediate tier progress. To unlock Advanced, they must complete at least 60% of Intermediate.
- Users who "placed" into an advanced tier (via `user.cpp_level`) will have the respective tiers automatically unlocked and their progress tracking scoped to their placed tier.

## Proposed Changes

### 1. Curriculum Model Update
#### [MODIFY] [frontend/lib/courseCurriculum.ts](file:///d:/Mat/we.b/fyr/frontend/lib/courseCurriculum.ts)
- Update [ChapterInfo](file:///d:/Mat/we.b/fyr/frontend/lib/courseCurriculum.ts#39-50) interface to include an optional `level: 'beginner' | 'intermediate' | 'advanced'` property.
- Assign chapters to levels (Assumed mapping: Ch 1-4 = Beginner, Ch 5-7 = Intermediate, Ch 8-9 = Advanced).

### 2. Core Progression Logic & Hooks
#### [MODIFY] [frontend/lib/courseReadingProgress.ts](file:///d:/Mat/we.b/fyr/frontend/lib/courseReadingProgress.ts) (or similar utility file)
- Implement a helper function `getCurrentActiveLevel()` that calculates:
  1. The percentage complete for Beginner chapters.
  2. If Beginner >= 60% (or `user.cpp_level` is 'intermediate'/'advanced'), Intermediate is unlocked.
  3. The percentage complete for Intermediate chapters.
  4. If Intermediate >= 60% (or `user.cpp_level` is 'advanced'), Advanced is unlocked.
  5. Determines the highest active level and what is unlocked.

### 3. Dashboard UI Update
#### [MODIFY] [frontend/app/(auth)/dashboard/page.tsx](file:///d:/Mat/we.b/fyr/frontend/app/%28auth%29/dashboard/page.tsx)
- Instead of calculating global `cppReading` completion over all 9 chapters, use the helper function to calculate it solely based on the user's highest active tier. 
- Alter text strings (e.g. from "C++" to "C++ (Intermediate)") to indicate which level's progress is being shown.

### 4. Lessons Page UI Update
#### [MODIFY] [frontend/components/lessons/Chapter1LessonList.tsx](file:///d:/Mat/we.b/fyr/frontend/components/lessons/Chapter1LessonList.tsx)
- Update the overall ring graph and horizontal progress bar to represent the statistics of the **Active Tier** rather than the global C++ pool.
- Wrap chapters in locked/unlocked checks based on the unlocking rules (60% threshold). Render locked tiers distinctly (perhaps similarly to the [TrackLockedCard](file:///d:/Mat/we.b/fyr/frontend/components/lessons/Chapter1LessonList.tsx#41-61)).
- Add visual indicators specifying that a chapter belongs to an advanced level that isn't unlocked yet.

## User Review Required

> [!IMPORTANT]
> **Chapter-to-Level Mapping:**  
> Please confirm if mapping chapters 1-4 to Beginner, 5-7 to Intermediate, and 8-9 to Advanced is correct. 

> [!NOTE] 
> **Placement Quizzes:**
> Users might currently start without a `cpp_level`. For those without a level, I assume they start at Beginner.

## Verification Plan

### Manual Verification
1. Open the dev server in the browser.
2. Sign in with a blank user account (0% complete).
3. Verify that only Chapters 1-4 are visible/unlocked on `/lessons` and progress tracks out of those total lessons.
4. Manually trigger progress markers to push Beginner progress to >60%. Check that Intermediate unlocks and the overall progress bar numerator/denominator resets to track Intermediate lessons.
5. Verify the same sequence passing 60% of Intermediate unlocking Advanced.
6. Test a user account placed explicitly into "advanced" tier and ensure all modules are unlocked on load and progress focuses on the advanced pool.
