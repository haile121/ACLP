import type { User } from '@/types';

/** Signed-out users may browse; signed-in users need C++ placement before lessons unlock. */
export function canAccessLessonTrack(user: User | null, _lessonId: string): boolean {
  if (!user) return true;
  if (user.cpp_assessment_completed === undefined && user.assessment_completed) return true;
  return Boolean(user.cpp_assessment_completed);
}
