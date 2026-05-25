/**
 * Seeds course_track_quizzes + course_track_quiz_questions (run from backend/: npm run seed:course-track-quizzes).
 */
import mysql, { type RowDataPacket } from 'mysql2/promise';
import { loadBackendEnv } from './loadBackendEnv';

loadBackendEnv();

type QuizMeta = {
  id: string;
  track: 'cpp';
  chapter_slug: string;
  title_en: string;
  title_am: string;
  xp_reward: number;
  coin_reward: number;
  is_final: 0 | 1;
  pass_threshold: number;
  cert_min_score: number | null;
};

type QRow = {
  id: string;
  quiz_id: string;
  sort_order: number;
  question_en: string;
  question_am: string;
  options: string[];
  correct_answer: string;
};

const QUIZZES: QuizMeta[] = [
  { id: 'cpp-ch1', track: 'cpp', chapter_slug: 'chapter-1', title_en: 'Chapter 1 quiz: Getting started', title_am: 'ምዕራፍ 1 ፈተና', xp_reward: 15, coin_reward: 5, is_final: 0, pass_threshold: 70, cert_min_score: null },
  { id: 'cpp-ch2', track: 'cpp', chapter_slug: 'chapter-2', title_en: 'Chapter 2 quiz: Control flow', title_am: 'ምዕራፍ 2 ፈተና', xp_reward: 15, coin_reward: 5, is_final: 0, pass_threshold: 70, cert_min_score: null },
  { id: 'cpp-ch3', track: 'cpp', chapter_slug: 'chapter-3', title_en: 'Chapter 3 quiz: Functions & data', title_am: 'ምዕራፍ 3 ፈተና', xp_reward: 15, coin_reward: 5, is_final: 0, pass_threshold: 70, cert_min_score: null },
  { id: 'cpp-ch4', track: 'cpp', chapter_slug: 'chapter-4', title_en: 'Chapter 4 quiz: Functions', title_am: 'ምዕራፍ 4 ፈተና: ተግባራት', xp_reward: 15, coin_reward: 5, is_final: 0, pass_threshold: 70, cert_min_score: null },
  { id: 'cpp-ch5', track: 'cpp', chapter_slug: 'chapter-5', title_en: 'Chapter 5 quiz: Arrays', title_am: 'ምዕራፍ 5 ፈተና', xp_reward: 15, coin_reward: 5, is_final: 0, pass_threshold: 70, cert_min_score: null },
  {
    id: 'cpp-final',
    track: 'cpp',
    chapter_slug: 'cpp-final',
    title_en: 'C++ final exam — all chapters',
    title_am: 'C++ የመጨረሻ ፈተና — ሁሉም ምዕራፎች',
    xp_reward: 40,
    coin_reward: 15,
    is_final: 1,
    pass_threshold: 70,
    cert_min_score: 90,
  },
];

function mc(
  quiz_id: string,
  n: number,
  en: string,
  am: string,
  options: [string, string, string, string],
  correct: string
): QRow {
  return {
    id: `${quiz_id}-q${n}`,
    quiz_id,
    sort_order: n,
    question_en: en,
    question_am: am,
    options: [...options],
    correct_answer: correct,
  };
}

/** Comprehensive final: 4 questions per chapter (Ch.1–5), 20 total. Replaced on each seed run. */
const FINAL_EXAM_QUESTIONS: QRow[] = [
  mc('cpp-final', 1, 'Which function is the conventional entry point of a C++ program?', 'የC++ ፕሮግራም መደበኛ መግቢያ ነጥብ የትኛው ነው?', ['main()', 'start()', 'init()', 'program()'], 'main()'),
  mc('cpp-final', 2, 'Which type is most appropriate for storing a whole number like 42?', '42 ያለ አካል ቁጥር ለማከማቸት የትኛው ዓይነት ተስማሚ ነው?', ['int', 'float', 'char', 'bool'], 'int'),
  mc('cpp-final', 3, 'Which header is commonly included to use std::cout?', 'std::cout ለመጠቀም ብዙውን ጊዜ የትኛውን ራስጌ ያካትታሉ?', ['<iostream>', '<fstream>', '<vector>', '<string>'], '<iostream>'),
  mc(
    'cpp-final',
    4,
    'A compiler differs from an interpreter mainly because a compiler…',
    'ኮምፓይለር ከኢንተርፕሪተር የተለየው በዋናው ምክንያት ኮምፓይለር…',
    ['Translates the whole program before execution', 'Runs line-by-line only at runtime', 'Never produces machine code', 'Only works with Python'],
    'Translates the whole program before execution'
  ),
  mc('cpp-final', 5, 'What is the purpose of #include in a C++ source file?', '#include በC++ ምንጭ ፋይል ውስጥ ዓላማው ምንድን ነው?', ['Bring in declarations from a header', 'Start the program', 'Declare main only', 'End the program'], 'Bring in declarations from a header'),
  mc('cpp-final', 6, 'In C++, the stream insertion operator used with std::cout is…', 'በC++ ከ std::cout ጋር የሚጠቀመው የማስገባት ኦፕሬተር…', ['<<', '>>', '==', '&&'], '<<'),
  mc('cpp-final', 7, 'Single-line comments in C++ begin with…', 'በC++ አንድ-መስመር አስተያየቶች ይጀምራሉ በ…', ['//', '/*', '#', '--'], '//'),
  mc('cpp-final', 8, 'A function in C++ is best described as…', 'በC++ ውስጥ ተግባር በጥሩ ሁኔታ ይገለጻል እንደ…', ['A named block of code you can call', 'A type of variable only', 'A preprocessor directive', 'A comment style'], 'A named block of code you can call'),
  mc('cpp-final', 9, 'Which keyword starts a conditional block in C++?', 'በC++ ውስጥ የ Konditional ብሎክ የሚጀመረው በየትኛው ቁልፍ ቃል ነው?', ['if', 'loop', 'switching', 'check'], 'if'),
  mc('cpp-final', 10, 'A for loop is most often used when…', 'የfor ዙረት ብዙውን ጊዜ ያገለግላል ሲ…', ['You know how many iterations you need', 'You never need to iterate', 'You only read files', 'You avoid variables'], 'You know how many iterations you need'),
  mc('cpp-final', 11, 'What does break; do inside a switch statement?', 'ከswitch ውስጥ break; ምን ያደርጋል?', ['Exits the switch (or loop if applicable)', 'Starts the next case always', 'Repeats the case', 'Deletes variables'], 'Exits the switch (or loop if applicable)'),
  mc('cpp-final', 12, 'Which loop checks the condition at the bottom at least once?', 'የትኛው ዙረት ኮንዲሽኑን ቢያንስ አንድ ጊዜ በታች ያረጋግጣል?', ['do-while', 'for', 'while', 'foreach'], 'do-while'),
  mc('cpp-final', 13, 'What is a function prototype?', 'የተግባር ፕሮቶታይፕ ምንድን ነው?', ['A declaration showing name, parameters, and return type', 'The compiled binary', 'A comment only', 'A type of loop'], 'A declaration showing name, parameters, and return type'),
  mc(
    'cpp-final',
    14,
    'Passing a large object by reference avoids…',
    'ትልቅ ነገር በሪፈረንስ ማስተላለፍ ያስወግዳል…',
    ['Copying the whole object by default', 'All errors', 'The need for functions', 'Using headers'],
    'Copying the whole object by default'
  ),
  mc('cpp-final', 15, 'If a function is declared void f(), what does void mean here?', 'void f() ከተዘጋጀ void እዚህ ምን ያመለክታል?', ['No return value to the caller', 'Returns any type', 'Returns only int', 'Undefined behavior'], 'No return value to the caller'),
  mc(
    'cpp-final',
    16,
    'Default function arguments in C++ must be specified from…',
    'በC++ ነባሪ የተግባር ክርክሮች መቀመጥ አለባቸው ከ…',
    ['The rightmost parameter toward the left', 'Any parameter in any order', 'Only the first parameter', 'Global variables only'],
    'The rightmost parameter toward the left'
  ),
  mc('cpp-final', 17, 'What is an array in C++?', 'በ C++ ውስጥ አሬይ (array) ምንድን ነው?', ['A list of values of the same type', 'A single value only', 'A pointer to any type', 'A loop statement'], 'A list of values of the same type'),
  mc('cpp-final', 18, 'If an array has N elements, what is the last valid index?', 'አሬይ ውስጥ N ኤለመንቶች ካሉ የመጨረሻ ትክክለኛ ኢንዴክስ ምንድን ነው?', ['N - 1', 'N', '1', '0 always'], 'N - 1'),
  mc('cpp-final', 19, 'To sum all elements of an int array, you typically use…', 'የ int አሬይ ሁሉንም ኤለመንቶች ለመድምር በተለምዶ ምን ይጠቀሙ?', ['A loop over indices', 'A single assignment', 'Only input/output', 'A break statement'], 'A loop over indices'),
  mc(
    'cpp-final',
    20,
    'A multidimensional array like int m[R][C] is best thought of as…',
    'int m[R][C] ያለ ባለብዙ ልኬት አሬይ እንደምን ነው?',
    ['An array of arrays (a grid/table)', 'A single linear list only', 'A function', 'A pointer type alone'],
    'An array of arrays (a grid/table)'
  ),
];

const CHAPTER_QUESTIONS: QRow[] = [
  ...[
    mc('cpp-ch1', 1, 'Which function is the conventional entry point of a C++ program?', 'የC++ ፕሮግራም መደበኛ መግቢያ ነጥብ የትኛው ነው?', ['main()', 'start()', 'init()', 'program()'], 'main()'),
    mc('cpp-ch1', 2, 'Which type is most appropriate for storing a whole number like 42?', '42 ያለ አካል ቁጥር ለማከማቸት የትኛው ዓይነት ተስማሚ ነው?', ['int', 'float', 'char', 'bool'], 'int'),
    mc('cpp-ch1', 3, 'Which header is commonly included to use std::cout?', 'std::cout ለመጠቀም ብዙውን ጊዜ የትኛውን ራስጌ ያካትታሉ?', ['<iostream>', '<fstream>', '<vector>', '<string>'], '<iostream>'),
    mc('cpp-ch1', 4, 'What does std::endl often do when sent to std::cout?', 'ወደ std::cout ሲላክ std::endl ብዙውን ጊዜ ምን ያደርጋል?', ['Inserts a newline and may flush the stream', 'Clears the screen', 'Closes the program', 'Declares a variable'], 'Inserts a newline and may flush the stream'),
  ],
  ...[
    mc('cpp-ch2', 1, 'Which keyword starts a conditional block in C++?', 'በC++ ውስጥ የ Konditional ብሎክ የሚጀመረው በየትኛው ቁልፍ ቃል ነው?', ['if', 'loop', 'switching', 'check'], 'if'),
    mc('cpp-ch2', 2, 'A for loop is most often used when…', 'የfor ዙረት ብዙውን ጊዜ ያገለግላል ሲ…', ['You know how many iterations you need', 'You never need to iterate', 'You only read files', 'You avoid variables'], 'You know how many iterations you need'),
    mc('cpp-ch2', 3, 'What does break; do inside a switch statement?', 'ከswitch ውስጥ break; ምን ያደርጋል?', ['Exits the switch (or loop if applicable)', 'Starts the next case always', 'Repeats the case', 'Deletes variables'], 'Exits the switch (or loop if applicable)'),
    mc('cpp-ch2', 4, 'Which loop checks the condition at the bottom at least once?', 'የትኛው ዙረት ኮንዲሽኑን ቢያንስ አንድ ጊዜ በታች ያረጋግጣል?', ['do-while', 'for', 'while', 'foreach'], 'do-while'),
  ],
  ...[
    mc('cpp-ch3', 1, 'What is a function prototype?', 'የተግባር ፕሮቶታይፕ ምንድን ነው?', ['A declaration showing name, parameters, and return type', 'The compiled binary', 'A comment only', 'A type of loop'], 'A declaration showing name, parameters, and return type'),
    mc('cpp-ch3', 2, 'In C++, arrays are indexed starting at…', 'በC++ ውስጥ አረይዎች ከየት ይጀምራሉ?', ['0', '1', '-1', '2'], '0'),
    mc('cpp-ch3', 3, 'Passing a large object by reference avoids…', 'ትልቅ ነገር በሪፈረንስ ማስተላለፍ ያስወግዳል…', ['Copying the whole object by default', 'All errors', 'The need for functions', 'Using headers'], 'Copying the whole object by default'),
    mc('cpp-ch3', 4, 'std::vector is preferred over raw C arrays for many tasks because it…', 'std::vector በብዙ ስራዎች ከንጹህ C አረይዎች ይመረጣል ምክንያቱ…', ['Manages size and reallocation safely', 'Cannot store numbers', 'Has no iterators', 'Is always slower'], 'Manages size and reallocation safely'),
  ],
  ...[
    mc('cpp-ch4', 1, 'What does the address-of operator & produce for a variable x?', 'ለx ተለዋዋጭ ለአድራሻ-የሚመዘግበው ኦፕሬተር & ምን ያመርታል?', ['A pointer to x', 'The value of x doubled', 'A reference count', 'A random number'], 'A pointer to x'),
    mc('cpp-ch4', 2, 'Dereferencing a valid pointer typically uses…', 'ትክክለኛ ጠቋሚን ማውጣት ብዙውን ጊዜ ይጠቀማል…', ['The * operator', 'The + operator', 'sizeof only', 'delete only'], 'The * operator'),
    mc('cpp-ch4', 3, 'In OOP, encapsulation often means…', 'በOOP ውስጥ መከታተል ብዙውን ጊዜ ያመለክታል…', ['Hiding internal state behind an interface', 'Removing all functions', 'Using only global variables', 'Disabling classes'], 'Hiding internal state behind an interface'),
    mc('cpp-ch4', 4, 'A class member function is also called a…', 'የክላስ አባል ተግባር ደግሞ ይባላል…', ['Method', 'Macro', 'Header', 'Literal'], 'Method'),
  ],
  ...[
    mc('cpp-ch5', 1, 'What is an array in C++?', 'በ C++ ውስጥ አሬይ (array) ምንድን ነው?', ['A list of values of the same type', 'A single value only', 'A pointer to any type', 'A loop statement'], 'A list of values of the same type'),
    mc('cpp-ch5', 2, 'If an array has N elements, what is the last valid index?', 'አሬይ ውስጥ N ኤለመንቶች ካሉ የመጨረሻ ትክክለኛ ኢንዴክስ ምንድን ነው?', ['N - 1', 'N', '1', '0 always'], 'N - 1'),
    mc('cpp-ch5', 3, 'To sum all elements of an int array, you typically use…', 'የ int አሬይ ሁሉንም ኤለመንቶች ለመድምር በተለምዶ ምን ይጠቀሙ?', ['A loop over indices', 'A single assignment', 'Only input/output', 'A break statement'], 'A loop over indices'),
    mc('cpp-ch5', 4, 'A multidimensional array like int m[R][C] is best thought of as…', 'int m[R][C] ያለ ባለብዙ ልኬት አሬይ እንደምን ነው?', ['An array of arrays (a grid/table)', 'A single linear list only', 'A function', 'A pointer type alone'], 'An array of arrays (a grid/table)'),
  ],
];

const QUESTIONS: QRow[] = [...CHAPTER_QUESTIONS, ...FINAL_EXAM_QUESTIONS];

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'amharic_cpp_platform',
    charset: 'utf8mb4',
  });

  try {
    await conn.beginTransaction();

    for (const q of QUIZZES) {
      await conn.query(
        `INSERT IGNORE INTO course_track_quizzes
         (id, track, chapter_slug, title_en, title_am, xp_reward, coin_reward, is_final, pass_threshold, cert_min_score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          q.id,
          q.track,
          q.chapter_slug,
          q.title_en,
          q.title_am,
          q.xp_reward,
          q.coin_reward,
          q.is_final,
          q.pass_threshold,
          q.cert_min_score,
        ]
      );
    }

    for (const row of CHAPTER_QUESTIONS) {
      await conn.query(
        `INSERT IGNORE INTO course_track_quiz_questions
         (id, quiz_id, sort_order, question_en, question_am, options_json, correct_answer)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          row.id,
          row.quiz_id,
          row.sort_order,
          row.question_en,
          row.question_am,
          JSON.stringify(row.options),
          row.correct_answer,
        ]
      );
    }

    const finalMeta = QUIZZES.find((q) => q.id === 'cpp-final');
    if (finalMeta) {
      await conn.query(
        `UPDATE course_track_quizzes
         SET title_en = ?, title_am = ?, xp_reward = ?, coin_reward = ?, pass_threshold = ?, cert_min_score = ?
         WHERE id = 'cpp-final'`,
        [
          finalMeta.title_en,
          finalMeta.title_am,
          finalMeta.xp_reward,
          finalMeta.coin_reward,
          finalMeta.pass_threshold,
          finalMeta.cert_min_score,
        ]
      );
    }

    await conn.query('DELETE FROM course_track_quiz_questions WHERE quiz_id = ?', ['cpp-final']);
    for (const row of FINAL_EXAM_QUESTIONS) {
      await conn.query(
        `INSERT INTO course_track_quiz_questions
         (id, quiz_id, sort_order, question_en, question_am, options_json, correct_answer)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          row.id,
          row.quiz_id,
          row.sort_order,
          row.question_en,
          row.question_am,
          JSON.stringify(row.options),
          row.correct_answer,
        ]
      );
    }

    await conn.commit();
    console.log(
      `Seeded ${QUIZZES.length} quizzes, ${CHAPTER_QUESTIONS.length} chapter questions, and ${FINAL_EXAM_QUESTIONS.length} final exam questions.`
    );
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
