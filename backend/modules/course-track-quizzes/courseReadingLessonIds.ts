/** Mirrors frontend course reading lesson ids for progress % and gating. */

export const CPP_LESSON_IDS: readonly string[] = [
  'ch1-p1',
  'ch1-p2',
  'ch1-p3',
  'ch1-p4',
  'ch2-p1',
  'ch2-p2',
  'ch2-p3',
  'ch2-p4',
  'ch3-p1',
  'ch3-p2',
  'ch3-p3',
  'ch3-p4',
  'ch4-p1',
  'ch4-p2',
  'ch4-p3',
  'ch4-p4',
  'ch4-p5',
  'ch4-p6',
  'ch5-p1',
  'ch5-p2',
  'ch5-p3',
  'ch5-p4',
];

/** Chapter slug → lesson ids (reading sessions) covered by that chapter quiz. */
export const CPP_CHAPTER_TO_LESSONS: Record<string, readonly string[]> = {
  'chapter-1': ['ch1-p1', 'ch1-p2', 'ch1-p3', 'ch1-p4'],
  'chapter-2': ['ch2-p1', 'ch2-p2', 'ch2-p3', 'ch2-p4'],
  'chapter-3': ['ch3-p1', 'ch3-p2', 'ch3-p3', 'ch3-p4'],
  'chapter-4': ['ch4-p1', 'ch4-p2', 'ch4-p3', 'ch4-p4', 'ch4-p5', 'ch4-p6'],
  'chapter-5': ['ch5-p1', 'ch5-p2', 'ch5-p3', 'ch5-p4'],
};

export const LESSON_PROGRESS_MIN_FOR_CERT = 0.85;
export const FINAL_SCORE_MIN_FOR_CERT = 90;

/** Must match `course_track_quizzes.id` for the C++ module final (seed). */
export const CPP_TRACK_FINAL_QUIZ_ID = 'cpp-final';
