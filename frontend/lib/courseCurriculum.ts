/**
 * All lesson metadata + ordered list for navigation.
 * Text files live under frontend/content/{chapter1|…|chapter5}/partN.txt
 *
 * --- Maintainer source map (not shown to learners) ---
 * ch1-p1, ch1-p2 → study content/ch1/ch1part1.docx (split → content/chapter1/part1.txt, part2.txt)
 * ch1-p3 → study content/ch1/ch1part2 (→ part3.txt)
 * ch1-p4 → study content/ch1/ch1part4.docx (→ part4.txt)
 * ch2-p1…ch2-p4 → content/chapter2/part1.txt … part4.txt (full Ch.2 split into 4 sessions: 2.1–2.4)
 * ch3-p1…ch3-p4 → study content/ch3/ch_3 final(1).docx → chapter3-full.txt, then split-chapter3.cjs → part1.txt … part4.txt
 * ch4-p1…ch4-p6 → study content/ch4/ch4p1.docx + ch4p2.docx + ch4p3.docx → chapter4-full.txt, split-chapter4.cjs → part1…part6
 * ch5-p1…ch5-p4 → study content/ch5/*.docx → content/chapter5/part1.txt … part4.txt
 * After editing Word sources, from frontend/: npm run extract:chapter1 | … | extract:chapter5
 */

export type ContentDir =
  | "chapter1"
  | "chapter2"
  | "chapter3"
  | "chapter4"
  | "chapter5"
  | "chapter6"
  | "chapter7"
  | "chapter8"
  | "chapter9";

export interface CourseLessonMeta {
  id: string;
  /** Set for C++ lessons (Chapters 1–9). */
  chapterNumber?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  part: number;
  contentDir: ContentDir;
  titleEn: string;
  titleAm: string;
  blurbEn: string;
  estMinutes: number;
}

export interface ChapterInfo {
  slug: string;
  track: "cpp";
  /** Chapter number for C++ (1–9). */
  chapterNumber?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  level: "beginner" | "intermediate" | "advanced";
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  lessons: readonly CourseLessonMeta[];
}

export const CHAPTER_1 = {
  slug: "chapter-1",
  track: "cpp" as const,
  chapterNumber: 1 as const,
  level: "beginner" as const,
  titleEn: "Chapter 1: Introduction & foundations",
  titleAm: "ምዕራፍ 1: መግቢያ እና መሠረቶች",
  descriptionEn:
    "A full arc from what programming is to how code becomes a running program: languages, computers, flowcharts, hardware and OS ideas, programming styles, then compilers and interpreters.",
  descriptionAm:
    "ፕሮግራሚንግ ምን እንደሆነ፣ ቋንቋዎች፣ ኮምፒውተር እና ፍሰሮች፣ የኮምፒውተር አካል እና ኦፕሬቲንግ ሲስተም፣ የፕሮግራሚንግ አብዮች እና በመጨረሻም ኮምፓይለር እና ኢንተርፕሪተር፣ እስከ ማስኬድ ድረስ።",
  lessons: [
    {
      id: "ch1-p1",
      chapterNumber: 1,
      part: 1,
      contentDir: "chapter1",
      titleEn: "Chapter 1: Introduction & foundations",
      titleAm: "ምዕራፍ 1: መግቢያ እና መሠረቶች",
      blurbEn:
        "Programming concepts, language generations, syntax, how computers fit in, flowcharts, and exercises: introductory foundations.",
      estMinutes: 45,
    },
    {
      id: "ch1-p2",
      chapterNumber: 1,
      part: 2,
      contentDir: "chapter1",
      titleEn: "Operators & C++ programs",
      titleAm: "ኦፕሬተሮች እና የ C++ ፕሮግራሞች",
      blurbEn:
        "Operators, expressions, conditionals, loops, and sample C++ walkthroughs: moving from ideas to real code.",
      estMinutes: 50,
    },
    {
      id: "ch1-p3",
      chapterNumber: 1,
      part: 3,
      contentDir: "chapter1",
      titleEn: "Computer organization, OS & programming paradigms",
      titleAm: "የኮምፒውተር ድርጅት፣ ኦፕሬቲንግ ሲስተም እና የፕሮግራሚንግ አብዮቶች",
      blurbEn:
        "Memory, CPU, ALU, storage, operating systems, and procedural, structured, and object-oriented ways of thinking about programs.",
      estMinutes: 40,
    },
    {
      id: "ch1-p4",
      chapterNumber: 1,
      part: 4,
      contentDir: "chapter1",
      titleEn: "Compilers & interpreters",
      titleAm: "ኮምፓይለሮች እና ኢንተርፕሪተሮች",
      blurbEn:
        "Language translators, how compilers differ from interpreters, and what “building” or running your code really involves.",
      estMinutes: 30,
    },
  ] satisfies CourseLessonMeta[],
} as const satisfies ChapterInfo;

export const CHAPTER_2 = {
  slug: "chapter-2",
  track: "cpp" as const,
  chapterNumber: 2 as const,
  level: "beginner" as const,
  titleEn: "Chapter 2: Basics of C++",
  titleAm: "ምዕራፍ 2: የ C++ መሰረቶች",
  descriptionEn:
    "Four sessions from program structure to functions: the parts of a program, cout/cin, comments, and a first look at calling your own functions.",
  descriptionAm:
    "ከፕሮግራም መዋቅር እስከ ፋንክሽን፣ አራት ክፍሎች፦ አካላት፣ cout/cin፣ አስተያየት (comment)፣ እና Function መጀመሪያ።",
  lessons: [
    {
      id: "ch2-p1",
      chapterNumber: 2,
      part: 1,
      contentDir: "chapter2",
      titleEn: "2.1: The parts of a C++ program",
      titleAm: "2.1: የ C++ ፕሮግራም አካላት",
      blurbEn:
        "Preprocessor, #include, main(), braces, statements, and cout: the anatomy of a simple C++ program.",
      estMinutes: 35,
    },
    {
      id: "ch2-p2",
      chapterNumber: 2,
      part: 2,
      contentDir: "chapter2",
      titleEn: "2.2: cout and cin",
      titleAm: "2.2: cout እና cin",
      blurbEn:
        "Output and input streams, << and >>, chaining, and a small interactive example.",
      estMinutes: 35,
    },
    {
      id: "ch2-p3",
      chapterNumber: 2,
      part: 3,
      contentDir: "chapter2",
      titleEn: "2.3: Comments in C++",
      titleAm: "2.3: በ C++ አስተያየት (comment)",
      blurbEn:
        "Single-line // and multi-line /* */ comments, plus guidelines for readable code.",
      estMinutes: 25,
    },
    {
      id: "ch2-p4",
      chapterNumber: 2,
      part: 4,
      contentDir: "chapter2",
      titleEn: "2.4: A brief look at functions",
      titleAm: "2.4: አጭር እይታ በ function ላይ",
      blurbEn:
        "What functions are, headers and bodies, parameters vs arguments, return and void, with a demoFunction example.",
      estMinutes: 35,
    },
  ] satisfies CourseLessonMeta[],
} as const satisfies ChapterInfo;

export const CHAPTER_3 = {
  slug: "chapter-3",
  track: "cpp" as const,
  chapterNumber: 3 as const,
  level: "beginner" as const,
  titleEn: "Chapter 3: Program control constructs",
  titleAm: "ምዕራፍ 3: የፕሮግራም መቆጣጠሪያ መዋቅሮች",
  descriptionEn:
    "Flow of control: sequential execution, selection (if, switch), and repetition (for, while, do-while) with examples and practice — the full Chapter Three notes.",
  descriptionAm:
    "የፍሰት ቁጥጥር፦ ቅደም ተከተላዊ፣ ምርጫ (if፣ switch) እና ተደጋጋሚ ስራ (for፣ while፣ do-while) በምሳሌዎች እና በልምምድ ጥያቄዎች።",
  lessons: [
    {
      id: "ch3-p1",
      chapterNumber: 3,
      part: 1,
      contentDir: "chapter3",
      titleEn: "3.1: Flow of control, sequential & the if statement",
      titleAm: "3.1: የፍሰት ቁጥጥር፣ ቅደም ተከተል እና if",
      blurbEn:
        "Intro to flow control, sequential statements, selection overview, and the if statement (simple, if-else, nested).",
      estMinutes: 35,
    },
    {
      id: "ch3-p2",
      chapterNumber: 3,
      part: 2,
      contentDir: "chapter3",
      titleEn: "3.2: The switch statement",
      titleAm: "3.2: የ switch ዓረፍተ ነገር",
      blurbEn:
        "Multiple-choice control flow: switch, case, break, default, and operator examples.",
      estMinutes: 30,
    },
    {
      id: "ch3-p3",
      chapterNumber: 3,
      part: 3,
      contentDir: "chapter3",
      titleEn: "3.3: Repetition — for, while, and do-while",
      titleAm: "3.3: መደጋገም — for፣ while እና do-while",
      blurbEn:
        "The three C++ loops: syntax, execution steps, and typical patterns.",
      estMinutes: 40,
    },
    {
      id: "ch3-p4",
      chapterNumber: 3,
      part: 4,
      contentDir: "chapter3",
      titleEn: "3.4: Loop pitfalls, types, continue & break",
      titleAm: "3.4: የ loop ስህተቶች፣ አይነቶች፣ continue እና break",
      blurbEn:
        "Infinite loops, off-by-one errors, count- vs event-controlled loops, then continue and break.",
      estMinutes: 35,
    },
  ] satisfies CourseLessonMeta[],
} as const satisfies ChapterInfo;

export const CHAPTER_4 = {
  slug: "chapter-4",
  track: "cpp" as const,
  chapterNumber: 4 as const,
  level: "beginner" as const,
  titleEn: "Chapter 4: Functions",
  titleAm: "ምዕራፍ 4: ተግባራት (Functions)",
  descriptionEn:
    "From function basics and prototypes to parameters, scope, static and inline functions, defaults, overloading, and practice exercises.",
  descriptionAm:
    "ከተግባር መሰረቶች እስከ ፓራሜተሮች፣ የክልል ቁጥጥር፣ static እና inline፣ ነባሪ ክርክሮች፣ overloading እና ልምምድ ጥያቄዎች።",
  lessons: [
    {
      id: "ch4-p1",
      chapterNumber: 4,
      part: 1,
      contentDir: "chapter4",
      titleEn: "Foundations: what is a function? Declare, define & call",
      titleAm: "መሰረት፦ ተግባር ምንድን? ማወጃ፣ መግለጽ እና ጥሪ",
      blurbEn:
        "Function purpose, rules, declaring, defining, and calling functions — English notes plus Amharic walkthrough.",
      estMinutes: 35,
    },
    {
      id: "ch4-p2",
      chapterNumber: 4,
      part: 2,
      contentDir: "chapter4",
      titleEn: "Parameters & arguments — pass by value and by reference",
      titleAm: "ፓራሜተሮች — በዋጋ እና በማመሳከሪያ",
      blurbEn:
        "Passing by value vs by reference, with examples and side effects.",
      estMinutes: 30,
    },
    {
      id: "ch4-p3",
      chapterNumber: 4,
      part: 3,
      contentDir: "chapter4",
      titleEn: "Global vs local variables & the scope operator (::)",
      titleAm: "Global እና local variables እና ::",
      blurbEn: "Scope, nested blocks, and using :: to reach the global name.",
      estMinutes: 25,
    },
    {
      id: "ch4-p4",
      chapterNumber: 4,
      part: 4,
      contentDir: "chapter4",
      titleEn: "Automatic vs static variables & inline functions",
      titleAm: "Automatic vs static እና inline functions",
      blurbEn: "Storage duration, static locals, and when to use inline.",
      estMinutes: 30,
    },
    {
      id: "ch4-p5",
      chapterNumber: 4,
      part: 5,
      contentDir: "chapter4",
      titleEn: "Default arguments & function overloading",
      titleAm: "ነባሪ ክርክሮች እና function overloading",
      blurbEn: "Default parameters (right-hand rule) and overload resolution.",
      estMinutes: 30,
    },
    {
      id: "ch4-p6",
      chapterNumber: 4,
      part: 6,
      contentDir: "chapter4",
      titleEn: "Practice exercises & solutions",
      titleAm: "ልምምድ ጥያቄዎች እና መፍትሄዎች",
      blurbEn:
        "Worked examples (e.g. factorial, e approximation, isEven) with full code.",
      estMinutes: 25,
    },
  ] satisfies CourseLessonMeta[],
} as const satisfies ChapterInfo;

export const CHAPTER_5 = {
  slug: "chapter-5",
  track: "cpp" as const,
  chapterNumber: 5 as const,
  level: "intermediate" as const,
  titleEn: "Chapter 5: Arrays",
  titleAm: "ምዕራፍ 5: አሬዮች (Arrays)",
  descriptionEn:
    "Arrays as collections of values: declaring and initializing, accessing elements, multidimensional arrays, and practice with loops and functions.",
  descriptionAm:
    "አሬዮች እንደ እሴቶች ስብስብ፦ ማውጣት እና ማስጀመር፣ ኤለመንቶችን መድረስ፣ ባለብዙ ልኬት አሬዮች እና በሉፕ እና ተግባር ልምምድ።",
  lessons: [
    {
      id: "ch5-p1",
      chapterNumber: 5,
      part: 1,
      contentDir: "chapter5",
      titleEn: "5.1: What is an array? Declare, initialize & store data",
      titleAm: "5.1: አሬይ ምንድን ነው? ማውጣት፣ ማስጀመር እና መረጃ ማከማቸት",
      blurbEn:
        "Why arrays exist, proper declaration, initialization with values or size, and rules for array storage in C++.",
      estMinutes: 40,
    },
    {
      id: "ch5-p2",
      chapterNumber: 5,
      part: 2,
      contentDir: "chapter5",
      titleEn: "5.2: Accessing and processing array elements",
      titleAm: "5.2: የአሬይ ኤለመንቶችን መድረስ እና ማቀናበር",
      blurbEn:
        "Subscripts, reading and modifying elements, loops over arrays, and typical processing patterns.",
      estMinutes: 35,
    },
    {
      id: "ch5-p3",
      chapterNumber: 5,
      part: 3,
      contentDir: "chapter5",
      titleEn: "5.3: Multidimensional arrays",
      titleAm: "5.3: ባለብዙ ልኬት አሬዮች",
      blurbEn:
        "Arrays of arrays, matrices, declaring int matrix[rows][cols], and indexing in two or more dimensions.",
      estMinutes: 35,
    },
    {
      id: "ch5-p4",
      chapterNumber: 5,
      part: 4,
      contentDir: "chapter5",
      titleEn: "5.4: Practice — sum and average with functions",
      titleAm: "5.4: ልምምድ — ድምር እና አማካይ በተግባር",
      blurbEn:
        "Worked example: read n values into an array, compute sum and average using a function and a for loop.",
      estMinutes: 30,
    },
  ] satisfies CourseLessonMeta[],
} as const satisfies ChapterInfo;

export const CHAPTER_6 = {
  slug: "chapter-6",
  track: "cpp" as const,
  chapterNumber: 6 as const,
  level: "intermediate" as const,
  titleEn: "Chapter 6: Strings",
  titleAm: "ምዕራፍ 6: ስትሪንጎች (Strings)",
  descriptionEn:
    "Understanding strings as arrays of characters, string initialization, the C++ string class, and various string manipulation functions.",
  descriptionAm:
    "ስትሪንጎችን (strings) እንደ የቁምፊዎች (characters) ድምር መረዳት፣ string መፍጠር፣ እና የተለያዩ የ string ማነፃፀሪያ እና መፈለጊያ ተግባራት።",
  lessons: [
    {
      id: "ch6-p1",
      chapterNumber: 6,
      part: 1,
      contentDir: "chapter6",
      titleEn: "6.1: What is a string? & Initialization",
      titleAm: "6.1: ስትሪንግ (String) ምንድን ነው? እና አጀማመር",
      blurbEn:
        "Introduction to strings, arrays of characters, the null-terminating character, C-style strings, and the C++ String class.",
      estMinutes: 35,
    },
    {
      id: "ch6-p2",
      chapterNumber: 6,
      part: 2,
      contentDir: "chapter6",
      titleEn: "6.2: Comparing strings (strcmp, strncmp, stricmp)",
      titleAm: "6.2: የStrings ንፅፅር መነፅር (Comparing Strings)",
      blurbEn:
        "Using C-string library functions like strcmp, strncmp, stricmp, and strnicmp to compare strings.",
      estMinutes: 30,
    },
    {
      id: "ch6-p3",
      chapterNumber: 6,
      part: 3,
      contentDir: "chapter6",
      titleEn: "6.3: Search & Character Cases (strchr, strstr, strlwr, strupr)",
      titleAm: "6.3: ፊደላትን መፈለግ እና መቀየር",
      blurbEn:
        "Working with individual characters, finding substrings, and converting string cases using strchr, strstr, strlwr, and strupr.",
      estMinutes: 35,
    },
  ] satisfies CourseLessonMeta[],
} as const satisfies ChapterInfo;

export const CHAPTER_7 = {
  slug: "chapter-7",
  track: "cpp" as const,
  chapterNumber: 7 as const,
  level: "intermediate" as const,
  titleEn: "Chapter 7: Pointers",
  titleAm: "ምዕራፍ 7: ፖይንተሮች (Pointers)",
  descriptionEn:
    "Understanding memory addresses, pointer declaration and initialization, operators (& and *), pointer arithmetic, and dynamic memory allocation.",
  descriptionAm:
    "ስለ ሚሞሪ አድራሻዎች፣ ፖይንተርን መፍጠር፣ የተለያዩ የፖይንተር ኦፕሬተሮች (& እና *)፣ ፖይንተር አሪትሜቲክ፣ እና ዳይናሚክ ሚሞሪ አመዳደብ።",
  lessons: [
    {
      id: "ch7-p1",
      chapterNumber: 7,
      part: 1,
      contentDir: "chapter7",
      titleEn: "7.1: Introduction & Pointer Operators",
      titleAm: "7.1: መግቢያ እና የፖይንተር ኦፕሬተሮች",
      blurbEn:
        "Understand variables in memory, the address-of operator (&), and the dereference operator (*).",
      estMinutes: 35,
    },
    {
      id: "ch7-p2",
      chapterNumber: 7,
      part: 2,
      contentDir: "chapter7",
      titleEn: "7.2: Declaring & Assigning Pointers",
      titleAm: "7.2: ፖይንተርን መግለጽ እና እሴት መስጠት",
      blurbEn:
        "Reserving memory locations for pointer variables, assigning addresses, and introduction to void pointers.",
      estMinutes: 30,
    },
    {
      id: "ch7-p3",
      chapterNumber: 7,
      part: 3,
      contentDir: "chapter7",
      titleEn: "7.3: Pointers and Arrays",
      titleAm: "7.3: ፖይንተሮች እና አሬዮች (Arrays)",
      blurbEn:
        "Using arrays of pointers, comparing arrays and pointers, and understanding array names as constant pointers.",
      estMinutes: 35,
    },
    {
      id: "ch7-p4",
      chapterNumber: 7,
      part: 4,
      contentDir: "chapter7",
      titleEn: "7.4: Pointer Arithmetic & Strings",
      titleAm: "7.4: ጠቋሚ ስሌቶች (Pointer Arithmetic) እና ስትሪንግ",
      blurbEn:
        "Performing arithmetical operations on pointers and interacting with strings using pointers.",
      estMinutes: 30,
    },
    {
      id: "ch7-p5",
      chapterNumber: 7,
      part: 5,
      contentDir: "chapter7",
      titleEn: "7.5: Pointer to Pointer & Dynamic Memory",
      titleAm: "7.5: ፖይንተር ወደ ፖይንተር እና ዳይናሚክ ሚሞሪ",
      blurbEn:
        "Storing addresses of other pointers, and dynamic memory allocation with new and delete operators.",
      estMinutes: 40,
    },
  ] satisfies CourseLessonMeta[],
} as const satisfies ChapterInfo;

export const CHAPTER_8 = {
  slug: "chapter-8",
  track: "cpp" as const,
  chapterNumber: 8 as const,
  level: "advanced" as const,
  titleEn: "Chapter 8: Structures",
  titleAm: "ምዕራፍ 8: ስትራክቸሮች (Structures)",
  descriptionEn:
    "Grouping different variable types under a single name, accessing and initializing structures, creating arrays of structures, and using pointers to structures.",
  descriptionAm:
    "የተለያዩ የዳታ አይነቶችን በአንድ ስም ስር ማሰባሰብ፣ የስትራክቸር መረጃዎችን ማግኘት እና እሴት መስጠት፣ የስትራክቸሮች ድርድር (Arrays) መፍጠር፣ እና ፖይንተር ወደ ስትራክቸር።",
  lessons: [
    {
      id: "ch8-p1",
      chapterNumber: 8,
      part: 1,
      contentDir: "chapter8",
      titleEn: "8.1: Introduction to Structures",
      titleAm: "8.1: ወደ ስትራክቸር መግቢያ",
      blurbEn:
        "Understand what structures are, their syntax, and why they are useful for grouping data.",
      estMinutes: 30,
    },
    {
      id: "ch8-p2",
      chapterNumber: 8,
      part: 2,
      contentDir: "chapter8",
      titleEn: "8.2: Accessing & Initializing Structures",
      titleAm: "8.2: እሴት መስጠት እና ስትራክቸር ማግኘት",
      blurbEn:
        "Learn how to use the dot operator (.) to read, write, and initialize parts of a structure.",
      estMinutes: 35,
    },
    {
      id: "ch8-p3",
      chapterNumber: 8,
      part: 3,
      contentDir: "chapter8",
      titleEn: "8.3: Arrays of Structures",
      titleAm: "8.3: የስትራክቸሮች ድርድር (Arrays of Structures)",
      blurbEn:
        "Storing collections of related data sets using arrays with structure elements.",
      estMinutes: 35,
    },
    {
      id: "ch8-p4",
      chapterNumber: 8,
      part: 4,
      contentDir: "chapter8",
      titleEn: "8.4: Pointers to Structure",
      titleAm: "8.4: ፖይንተር ወደ ስትራክቸር (Pointers to Structure)",
      blurbEn:
        "Using pointer variables that point to structures to navigate arrays and memory efficiently.",
      estMinutes: 30,
    },
  ] satisfies CourseLessonMeta[],
} as const satisfies ChapterInfo;

export const CHAPTER_9 = {
  slug: "chapter-9",
  track: "cpp" as const,
  chapterNumber: 9 as const,
  level: "advanced" as const,
  titleEn: "Chapter 9: File Operations (File I/O)",
  titleAm: "ምዕራፍ 9: የፋይል ስራዎች (File I/O)",
  descriptionEn:
    "Working with disk files in C++: streams, sequential file access, opening and closing files, reading, writing, and appending data.",
  descriptionAm:
    "በC++ ውስጥ በዲስክ ፋይሎች ላይ መስራት፡ ስትሪሞች፣ ተከታታይ የፋይል አጠቃቀም፣ ፋይሎችን መክፈት እና መዝጋት፣ ማንበብ፣ መጻፍ እና መረጃ ማከማቸት።",
  lessons: [
    {
      id: "ch9-p1",
      chapterNumber: 9,
      part: 1,
      contentDir: "chapter9",
      titleEn: "9.1: Introduction & Streams",
      titleAm: "9.1: መግቢያ እና ስትሪሞች (Streams)",
      blurbEn:
        "Introduction to file I/O, the role of disk files instead of variables, and understanding iostream vs fstream.",
      estMinutes: 30,
    },
    {
      id: "ch9-p2",
      chapterNumber: 9,
      part: 2,
      contentDir: "chapter9",
      titleEn: "9.2: Opening & Closing Sequential Files",
      titleAm: "9.2: ፋይሎችን መክፈት እና መዝጋት",
      blurbEn:
        "Learning the types of file access (sequential vs random), and how to open, manage, and safely close disk files.",
      estMinutes: 35,
    },
    {
      id: "ch9-p3",
      chapterNumber: 9,
      part: 3,
      contentDir: "chapter9",
      titleEn: "9.3: Writing to a Sequential File",
      titleAm: "9.3: ወደ ፋይል መጻፍ",
      blurbEn:
        "Using functions like put() and the output redirection operator (<<) to write and append data into text files.",
      estMinutes: 35,
    },
    {
      id: "ch9-p4",
      chapterNumber: 9,
      part: 4,
      contentDir: "chapter9",
      titleEn: "9.4: Reading from a Sequential File",
      titleAm: "9.4: ከፋይል ማንበብ",
      blurbEn:
        "Managing reach to the end of file (EOF), and reading stored file contents using extraction operators (>>) or get().",
      estMinutes: 35,
    },
  ] satisfies CourseLessonMeta[],
} as const satisfies ChapterInfo;

/** C++ only — Chapters 1–9. */
export const CPP_CHAPTERS = [
  CHAPTER_1,
  CHAPTER_2,
  CHAPTER_3,
  CHAPTER_4,
  CHAPTER_5,
  CHAPTER_6,
  CHAPTER_7,
  CHAPTER_8,
  CHAPTER_9,
] as const;

export const CHAPTERS: readonly ChapterInfo[] = [...CPP_CHAPTERS] as const;

export const ALL_LESSONS: CourseLessonMeta[] = [
  ...CHAPTER_1.lessons,
  ...CHAPTER_2.lessons,
  ...CHAPTER_3.lessons,
  ...CHAPTER_4.lessons,
  ...CHAPTER_5.lessons,
  ...CHAPTER_6.lessons,
  ...CHAPTER_7.lessons,
  ...CHAPTER_8.lessons,
  ...CHAPTER_9.lessons,
];

export const ALL_LESSON_IDS = ALL_LESSONS.map((l) => l.id);

/** Backend `course_track_quizzes.id` for each reading chapter (multiple choice after the chapter). */
export const COURSE_CHAPTER_QUIZ_IDS: Record<string, string> = {
  "chapter-1": "cpp-ch1",
  "chapter-2": "cpp-ch2",
  "chapter-3": "cpp-ch3",
  "chapter-4": "cpp-ch4",
  "chapter-5": "cpp-ch5",
  "chapter-6": "cpp-ch6",
  "chapter-7": "cpp-ch7",
  "chapter-8": "cpp-ch8",
  "chapter-9": "cpp-ch9",
};

/** End-of-module final exam quiz id. */
export const COURSE_TRACK_FINAL_QUIZ_IDS = { cpp: "cpp-final" } as const;

/** Legacy local-storage ids — map into current C++ lesson ids. */
export const LEGACY_LESSON_ID_MAP: Record<string, string> = {
  "web-p1": "ch1-p1",
  "web-p2": "ch1-p2",
  "web-p3": "ch1-p3",
  "web-p4": "ch1-p4",
  "web-p5": "ch2-p1",
  "web-p6": "ch2-p2",
};

export function normalizeLegacyLessonId(id: string): string {
  return LEGACY_LESSON_ID_MAP[id] ?? id;
}

/** v2 key; migrates from cpp-course-ch1-completed on first read */
export const STORAGE_KEY_PROGRESS = "cpp-course-lessons-completed";
export const STORAGE_KEY_LEGACY_CH1 = "cpp-course-ch1-completed";

export function getCourseLesson(id: string): CourseLessonMeta | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getCourseLessonIndex(id: string): number {
  return ALL_LESSONS.findIndex((l) => l.id === id);
}

export function getChapterForLesson(lesson: CourseLessonMeta): ChapterInfo {
  return (
    CHAPTERS.find((c) => c.lessons.some((l) => l.id === lesson.id)) ?? CHAPTER_1
  );
}

/** @deprecated use getCourseLesson */
export const getChapter1Lesson = getCourseLesson;
/** @deprecated use getCourseLessonIndex */
export const getChapter1LessonIndex = getCourseLessonIndex;
export type Chapter1LessonMeta = CourseLessonMeta;
