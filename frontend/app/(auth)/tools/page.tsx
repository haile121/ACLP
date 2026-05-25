"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  GraduationCap,
  Quote,
  RefreshCw,
  Plus,
  Trash2,
  Sparkles,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/cn";

/** 4.0 scale — common US-style mapping */
const GRADE_POINTS: { label: string; points: number }[] = [
  { label: "A (4.0)", points: 4.0 },
  { label: "A− (3.85)", points: 3.85 },
  { label: "B+ (3.75)", points: 3.75 },
  { label: "B (3.0)", points: 3.0 },
  { label: "B− (2.67)", points: 2.67 },
  { label: "C+ (2.33)", points: 2.33 },
  { label: "C (2.0)", points: 2.0 },
  { label: "C− (1.67)", points: 1.67 },
  { label: "D (1.0)", points: 1.0 },
  { label: "F (0)", points: 0 },
];

type GpaRow = { id: string; course: string; credits: string; points: number };

function createRow(): GpaRow {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    course: "",
    credits: "3",
    points: 3.0,
  };
}

const ADVICE = [
  {
    en: '"Talk is cheap. Show me the code." — Linus Torvalds',
    am: '"ወሬ ርካሽ ነው። ኮዱን አሳየኝ።" — ላይነስ ቶርቫልድስ',
  },
  {
    en: '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
    am: '"ማንኛውም ሞኝ ኮምፒዩተር ሊረዳው የሚችል ኮድ መጻፍ ይችላል። ጥሩ ፕሮግራም አድራጊዎች ግን ሰዎች ሊረዱት የሚችሉትን ኮድ ይጽፋሉ።" — ማርቲን ፋውለር',
  },
  {
    en: '"First, solve the problem. Then, write the code." — John Johnson',
    am: '"በመጀመሪያ ችግሩን ይፍቱ። ከዚያ ኮዱን ይፃፉ።" — ጆን ጆንሰን',
  },
  {
    en: '"C makes it easy to shoot yourself in the foot; C++ makes it harder, but when you do it blows your whole leg off." — Bjarne Stroustrup',
    am: '"በስተክህተት ራስዎን ለመጉዳት C ቀላል ያደርገዋል፤ C++ የበለጠ ከባድ ያደርገዋል፣ ነገር ግን ይህን ሲያደርጉ እግርዎን በሙሉ ይበጥሰዋል።" — ብጃርኔ ስትሮውስትረፕ',
  },
  {
    en: '"There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton',
    am: '"በኮምፒውተር ሳይንስ ውስጥ ሁለት ከባድ ነገሮች ብቻ አሉ፡ መሸጎጫን (cache) ውድቅ ማድረግ እና ነገሮችን መሰየም።" — ፊል ካርልተን',
  },
  {
    en: '"Code is like humor. When you have to explain it, it’s bad." — Cory House',
    am: '"ኮድ እንደ ቀልድ ነው። ማብራራት ካስፈለገዎት፣ መጥፎ ነው።" — ኮሪ ሃውስ',
  },
  {
    en: '"Experience is the name everyone gives to their mistakes." — Oscar Wilde',
    am: '"ልምድ ማለት ሰዎች ለስህተቶቻቸው የሚሰጡት ስም ነው።" — ኦስካር ዋይልድ',
  },
  {
    en: '"It’s not a bug. It’s an undocumented feature!" — Anonymous',
    am: '"ይህ ችግር (bug) አይደለም። ያልተመዘገበ አዲስ ተግባር ነው!" — ያልታወቀ',
  },
  {
    en: '"Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday\'s code." — Dan Salomon',
    am: '"ከሰኞ ኮድ የተነሳ ሳምንቱን ሙሉ ስህተቶችን ከማረም፣ ሰኞ አልጋ ላይ መዋል ሊሻል ይችላል።" — ዳን ሳሎሞን',
  },
  {
    en: '"Measuring programming progress by lines of code is like measuring airplane building progress by weight." — Bill Gates',
    am: '"የፕሮግራሚንግ እድገትን በኮድ መስመሮች ብዛት መለካት የአውሮፕላን ግንባታን በክብደት እንደመለካት ነው።" — ቢል ጌትስ',
  },
  {
    en: '"Before software can be reusable it first has to be usable." — Ralph Johnson',
    am: '"ሶፍትዌር እንደገና ጥቅም ላይ ከመዋሉ በፊት መጀመሪያ ጠቃሚ መሆን አለበት።" — ራልፍ ጆንሰን',
  },
  {
    en: '"Make it work, make it right, make it fast." — Kent Beck',
    am: '"እንዲሰራ አድርገው፣ ትክክል አድርገው፣ ፈጣን አድርገው።" — ኬንት ቤክ',
  },
  {
    en: '"If debugging is the process of removing software bugs, then programming must be the process of putting them in." — Edsger W. Dijkstra',
    am: '"ስህተትን ማረም (debugging) የሶፍትዌር ችግሮችን የማስወገድ ሂደት ከሆነ፣ ፕሮግራሚንግ ችግሮቹን የማስገባት ሂደት መሆን አለበት።" — ኤድስገር ደብሊው ዲጅክስትራ',
  },
  {
    en: '"Simplicity is the soul of efficiency." — Austin Freeman',
    am: '"ቀለል ማለት የብቃት ነፍስ ነው።" — ኦስቲን ፍሪማን',
  },
  {
    en: '"The best thing about a boolean is even if you are wrong, you are only off by a bit." — Anonymous',
    am: '"ስለ ቡሊያን (boolean) በጣም ጥሩው ነገር ቢሳሳቱም እንኳ ትንሽ (bit) ብቻ መራቅዎ ነው።" — ያልታወቀ',
  },
  {
    en: '"Good code is its own best documentation." — Steve McConnell',
    am: '"ጥሩ ኮድ የራሱ ምርጥ ማብራሪያ (documentation) ነው።" — ስቲቭ ማክኮኔል',
  },
  {
    en: '"Truth can only be found in one place: the code." — Robert C. Martin',
    am: '"እውነት ሊገኝ የሚችለው በአንድ ቦታ ብቻ ነው፡ በኮዱ ውስጥ።" — ሮበርት ሲ. ማርቲን',
  },
  {
    en: '"In programming the hard part isn’t solving problems, but deciding what problems to solve." — Paul Graham',
    am: '"በፕሮግራሚንግ ከባዱ ክፍል ችግሮችን መፍታት ሳይሆን፣ የትኞቹን ችግሮች መፍታት እንዳለብን መወሰን ነው።" — ፖል ግራሃም',
  },
  {
    en: "\"Programming isn't about what you know; it's about what you can figure out.\" — Chris Pine",
    am: '"ፕሮግራሚንግ ስለሚያውቁት ነገር አይደለም፤ ፈትተው ስለሚደርሱበት መፍትሄ ነው።" — ክሪስ ፓይን',
  },
  {
    en: '"You might not think that programmers are artists, but programming is an extremely creative profession. It\'s logic-based creativity." — John Romero',
    am: '"ፕሮግራም አድራጊዎችን እንደ አርቲስቶች ላታስቧቸው ትችላላችሁ፣ ነገር ግን ፕሮግራሚንግ እጅግ በጣም ፈጠራ የተሞላበት ሙያ ነው። በምክንያታዊነት ላይ የተመሠረተ የፈጠራ ስራ ነው።" — ጆን ሮሜሮ',
  },
];

type ToolTab = "gpa" | "calc" | "inspire";

const TABS: {
  id: ToolTab;
  label: string;
  short: string;
  icon: typeof GraduationCap;
}[] = [
  { id: "gpa", label: "GPA calculator", short: "GPA", icon: GraduationCap },
  { id: "calc", label: "Calculator", short: "Calc", icon: Calculator },
  { id: "inspire", label: "Inspiration", short: "Mood", icon: Quote },
];

function GpaPanel() {
  const [rows, setRows] = useState<GpaRow[]>(() => [createRow(), createRow()]);

  const { gpa, totalCredits } = useMemo(() => {
    let weighted = 0;
    let credits = 0;
    for (const r of rows) {
      const c = parseFloat(r.credits);
      if (!Number.isFinite(c) || c <= 0) continue;
      weighted += r.points * c;
      credits += c;
    }
    if (credits <= 0) return { gpa: null as number | null, totalCredits: 0 };
    return { gpa: weighted / credits, totalCredits: credits };
  }, [rows]);

  const update = useCallback((id: string, patch: Partial<GpaRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  return (
    <div className="flex flex-col min-h-0">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        4.0 scale — credits and letter grade per course. Add rows as needed.
      </p>

      <div className="space-y-3 overflow-y-auto max-h-[min(52vh,28rem)] pr-1 -mr-1">
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 px-1">
          <span className="col-span-4">Course (optional)</span>
          <span className="col-span-3">Credits</span>
          <span className="col-span-4">Grade</span>
        </div>
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-12 gap-2 items-center">
            <input
              type="text"
              placeholder="e.g. CS101"
              value={r.course}
              onChange={(e) => update(r.id, { course: e.target.value })}
              className="col-span-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            <input
              type="text"
              inputMode="decimal"
              value={r.credits}
              onChange={(e) => update(r.id, { credits: e.target.value })}
              className="col-span-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm tabular-nums text-gray-900 dark:text-white"
            />
            <select
              value={r.points}
              onChange={(e) =>
                update(r.id, { points: parseFloat(e.target.value) })
              }
              className="col-span-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-2 text-sm text-gray-900 dark:text-white"
            >
              {GRADE_POINTS.map((g) => (
                <option key={g.label} value={g.points}>
                  {g.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                setRows((prev) => prev.filter((x) => x.id !== r.id))
              }
              className="col-span-1 flex justify-center text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2"
              aria-label="Remove row"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setRows((prev) => [...prev, createRow()])}
        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-teal-700 dark:text-teal-400 hover:underline shrink-0"
      >
        <Plus className="h-4 w-4" />
        Add course
      </button>

      <div className="mt-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-900/50 px-4 py-3 flex flex-wrap items-baseline justify-between gap-2 shrink-0">
        <span className="text-sm font-medium text-teal-900 dark:text-teal-200">
          Term / cumulative GPA
        </span>
        <span className="text-2xl font-bold tabular-nums text-teal-800 dark:text-teal-300">
          {gpa !== null ? gpa.toFixed(2) : "—"}
        </span>
        <span className="text-xs text-teal-700/80 dark:text-teal-400/90 w-full sm:w-auto">
          Credits:{" "}
          <strong className="tabular-nums">{totalCredits.toFixed(1)}</strong>
        </span>
      </div>
    </div>
  );
}

function CalcButton({
  label,
  wide,
  onClick,
  variant = "default",
}: {
  label: string;
  wide?: boolean;
  onClick: () => void;
  variant?: "default" | "muted" | "accent";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl py-3 text-lg font-semibold transition-colors active:scale-[0.98]",
        wide && "col-span-2",
        variant === "default" &&
          "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600",
        variant === "muted" &&
          "bg-gray-200/80 dark:bg-gray-600/80 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500",
        variant === "accent" && "bg-teal-600 text-white hover:bg-teal-500",
      )}
    >
      {label}
    </button>
  );
}

function CalculatorPanel() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const applyOp = useCallback((a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b;
      case "−":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  }, []);

  const numPress = (n: string) => {
    if (fresh) {
      setDisplay(n === "." ? "0." : n);
      setFresh(false);
    } else {
      if (n === "." && display.includes(".")) return;
      setDisplay((d) => (d === "0" && n !== "." ? n : d + n));
    }
  };

  const opPress = (op: string) => {
    const cur = parseFloat(display);
    if (Number.isNaN(cur)) return;
    if (stored !== null && pendingOp && !fresh) {
      const res = applyOp(stored, cur, pendingOp);
      setDisplay(
        String(Number.isFinite(res) ? Math.round(res * 1e10) / 1e10 : res),
      );
      setStored(Number.isFinite(res) ? res : null);
    } else {
      setStored(cur);
    }
    setPendingOp(op);
    setFresh(true);
  };

  const equals = () => {
    const cur = parseFloat(display);
    if (stored === null || !pendingOp || Number.isNaN(cur)) return;
    const res = applyOp(stored, cur, pendingOp);
    setDisplay(
      String(Number.isFinite(res) ? Math.round(res * 1e10) / 1e10 : res),
    );
    setStored(null);
    setPendingOp(null);
    setFresh(true);
  };

  const clear = () => {
    setDisplay("0");
    setStored(null);
    setPendingOp(null);
    setFresh(true);
  };

  return (
    <div className="max-w-sm mx-auto w-full">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center sm:text-left">
        Basic + − × ÷ for quick checks.
      </p>
      <div
        className="mb-3 rounded-xl bg-gray-900 dark:bg-gray-950 px-4 py-4 text-right font-mono text-2xl sm:text-3xl text-white tabular-nums min-h-[3.5rem] flex items-center justify-end break-all"
        aria-live="polite"
      >
        {display}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <CalcButton label="C" onClick={clear} variant="muted" />
        <CalcButton
          label="⌫"
          onClick={() =>
            setDisplay((d) => (d.length <= 1 ? "0" : d.slice(0, -1)))
          }
          variant="muted"
        />
        <CalcButton label="÷" onClick={() => opPress("÷")} variant="accent" />
        <CalcButton label="×" onClick={() => opPress("×")} variant="accent" />

        {["7", "8", "9"].map((d) => (
          <CalcButton key={d} label={d} onClick={() => numPress(d)} />
        ))}
        <CalcButton label="−" onClick={() => opPress("−")} variant="accent" />

        {["4", "5", "6"].map((d) => (
          <CalcButton key={d} label={d} onClick={() => numPress(d)} />
        ))}
        <CalcButton label="+" onClick={() => opPress("+")} variant="accent" />

        {["1", "2", "3"].map((d) => (
          <CalcButton key={d} label={d} onClick={() => numPress(d)} />
        ))}
        <CalcButton label="=" onClick={equals} variant="accent" />

        <CalcButton label="0" onClick={() => numPress("0")} wide />
        <CalcButton label="." onClick={() => numPress(".")} />
      </div>
    </div>
  );
}

function InspirationPanel() {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * ADVICE.length),
  );

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % ADVICE.length);
  }, []);

  const quote = ADVICE[index];

  return (
    <div className="flex flex-col items-stretch">
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/80 dark:border-amber-800/60 bg-amber-50/90 dark:bg-amber-950/40 px-4 py-2 text-sm font-medium text-amber-900 dark:text-amber-200 hover:bg-amber-100/90 dark:hover:bg-amber-900/40 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Next quote
        </button>
      </div>
      <blockquote className="space-y-4">
        <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-100 leading-relaxed font-medium">
          &ldquo;{quote.en}&rdquo;
        </p>
        <p className="text-sm sm:text-base text-amber-900/90 dark:text-amber-200/95 leading-relaxed border-l-2 border-amber-400/60 pl-4">
          {quote.am}
        </p>
      </blockquote>
    </div>
  );
}

export default function ToolsPage() {
  const [tab, setTab] = useState<ToolTab>("gpa");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 text-teal-800 dark:text-teal-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-3">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          More tools
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          Utilities &amp; motivation
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-xl">
          Pick a tool below — everything stays in one place without long
          scrolling.
        </p>
        <Link
          href="/assessment"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ClipboardList className="h-4 w-4" />
          Placement &amp; track assessments
        </Link>
      </div>

      {/* Tab buttons — horizontal pill group */}
      <div
        className="flex flex-wrap sm:flex-nowrap gap-2 p-1.5 rounded-2xl bg-gray-100/95 dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-700/90 shadow-inner"
        role="tablist"
        aria-label="Tool selector"
      >
        {TABS.map(({ id, label, short, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              id={`tab-${id}`}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className={cn(
                "flex-1 min-w-[5.5rem] sm:min-w-0 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 sm:py-3.5 text-sm font-semibold transition-all",
                active
                  ? "bg-white dark:bg-gray-800 text-teal-800 dark:text-teal-300 shadow-md shadow-gray-200/80 dark:shadow-black/40 ring-1 ring-gray-200/80 dark:ring-white/10"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  active ? "text-teal-600 dark:text-teal-400" : "",
                )}
                aria-hidden
              />
              <span className="hidden sm:inline">{label}</span>
              <span className="inline sm:hidden">{short}</span>
            </button>
          );
        })}
      </div>

      {/* Single panel — matches active tab */}
      <div
        className={cn(
          "mt-6 rounded-2xl border border-gray-200/90 dark:border-gray-700/90 bg-white dark:bg-gray-800/80 p-5 sm:p-8 shadow-sm",
          tab === "inspire" &&
            "border-amber-200/90 dark:border-amber-900/35 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-amber-950/20 dark:via-gray-800/80 dark:to-orange-950/10",
        )}
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700/80">
          {tab === "gpa" && (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-700 dark:text-teal-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                GPA calculator
              </h2>
            </>
          )}
          {tab === "calc" && (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-400">
                <Calculator className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Calculator
              </h2>
            </>
          )}
          {tab === "inspire" && (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300">
                <Quote className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Inspiration
              </h2>
            </>
          )}
        </div>

        {tab === "gpa" && <GpaPanel />}
        {tab === "calc" && <CalculatorPanel />}
        {tab === "inspire" && <InspirationPanel />}
      </div>
    </div>
  );
}
