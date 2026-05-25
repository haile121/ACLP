/** Shared FAQ copy for the landing page and /faq. */
export type FaqItem = { q: string; a: string; q_am: string; a_am: string };

export const MARKETING_FAQ_ITEMS: FaqItem[] = [
  {
    q: "Is it really free?",
    a: "Yes. All lessons, the live compiler, and the AI tutor are completely free. Certificates are earned by completing levels. No payment ever required.",
    q_am: "በእውነት ነፃ ነው?",
    a_am: "አዎ። ሁሉም ትምህርቶች፣ ላይቭ ኮምፓይለር እና AI አስጠኚ ሙሉ በሙሉ ነፃ ናቸው። ሰርተፊኬቶች ደረጃዎችን በመጨረስ ይገኛሉ:: ክፍያ አያስፈልግም።",
  },
  {
    q: "Do I need prior programming experience?",
    a: "No. The diagnostic assessment places you at the right level automatically. Beginners start from absolute zero: variables, types, and basic I/O.",
    q_am: "ከዚህ በፊት ፕሮግራሚንግ ማወቅ ያስፈልገኛል?",
    a_am: "አያስፈልግም። የመጀመሪያ ፈተናው ትክክለኛው ደረጃ ላይ ይመድብዎታል። ጀማሪዎች ከዜሮ ይጀምራሉ፡ ተለዋዋጮች፣ አይነቶች፣ እና መሰረታዊ I/O።",
  },
  {
    q: "How does the bilingual toggle work?",
    a: "Every lesson page has a language toggle. Switch between Amharic and English at any point without losing your progress or answers.",
    q_am: "የቋንቋ መለዋወጫው እንዴት ይሰራል?",
    a_am: "እያንዳንዱ የትምህርት ገጽ የቋንቋ መቀየሪያ አለው። ያለምንም ችግር መሃል ላይ ከአማርኛ ወደ እንግሊዝኛ መቀየር ይችላሉ።",
  },
  {
    q: "What is the AI tutor?",
    a: "It uses Google Gemini to answer your programming questions in context. Ask in Amharic or English and get a clear, lesson-aware explanation in seconds.",
    q_am: "የAI አስጠኚ ምንድን ነው?",
    a_am: "ለፕሮግራሚንግ ጥያቄዎችዎ መልስ ለመስጠት ጎግል ጀሚናይ ይጠቀማል። በአማርኛ ወይም በእንግሊዝኛ ይጠይቁ እና በፍጥነት ግልፅ ማብራሪያ ያግኙ።",
  },
  {
    q: "How are certificates verified?",
    a: "Each certificate has a unique ID and a public verification URL. Anyone (an employer, university, or colleague) can verify it is genuine.",
    q_am: "ሰርተፊኬቶች እንዴት ይረጋገጣሉ?",
    a_am: "እያንዳንዱ ሰርተፊኬት መለያ እና ማረጋገጫ ሊንክ አለው። ማንም ሰው (አሰሪም ሆነ ዩንቨርስቲ) ትክክለኛነቱን ማረጋገጥ ይችላል።",
  },
  {
    q: "Can I use it on mobile?",
    a: "Yes. The platform is fully responsive. The compiler, lessons, and AI tutor all work on any screen size.",
    q_am: "በሞባይል መጠቀም እችላለሁ?",
    a_am: "አዎ። ኮምፓይለሩ፣ ትምህርቶቹ፣ እና AI አስጠኚው በማንኛውም ስክሪን ላይ በሚገባ ይሰራሉ።",
  },
  {
    q: "How do XP, levels, and streaks work?",
    a: "You earn XP for lessons, quizzes, and other activity on the platform. Your daily streak only counts when you sign in each day—it grows on consecutive login days and is separate from XP.",
    q_am: "XP እና እርከኖች እንዴት ይሰራሉ?",
    a_am: "በትምህርት እና ጥያቄዎች XP ያገኛሉ። የእለት ተከታታይ ቀናትዎት ሎጊን ሲያረጉ ብቻ የሚያድግ እና ከ XP የተለየ ነው።",
  },
  {
    q: "Which browsers are supported?",
    a: "Use a recent version of Chrome, Firefox, Safari, or Edge. Enable cookies so sign-in and the compiler session work reliably.",
    q_am: "የትኞቹ ብራውዘሮች ይሰራሉ?",
    a_am: "የ Chrome፣ Firefox፣ Safari፣ ወይም Edge አዲስ ትውልዶችን ይጠቀሙ።",
  },
  {
    q: "Is my code stored or visible to others?",
    a: "Your submissions are tied to your account for feedback and progress. They are not published on a public gallery unless we explicitly add that feature later.",
    q_am: "የእኔ ኮድ ለሌሎች ይታያል?",
    a_am: "የእርስዎ ስራ ከእርስዎ አካውንት ጋር ብቻ የተገናኘ መሆኑ የተጠበቀ ነው። ለሌሎች በመድረክ ላይ አይታይም።",
  },
  {
    q: "Who can I contact for help?",
    a: "Use the Contact page for bugs, partnerships, or account issues. For quick product questions, this FAQ is the best place to start.",
    q_am: "ለእርዳታ ማንን ላነጋግር?",
    a_am: "ችግር ካጋጠመዎት የዕውቂያ ገጹን ይጠቀሙ። ለጥያቄዎች ግን ይሄኛው FAQ ተመራጭ ነው።",
  },
];
