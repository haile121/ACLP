'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Code2, ArrowRight, Sparkles } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useDialog } from '@/components/ui/DialogProvider';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/cn';

export default function AssessmentTrackPage() {
  const router = useRouter();
  const { show } = useDialog();
  const [loading, setLoading] = useState(false);

  async function continueWithCpp() {
    setLoading(true);
    try {
      await authApi.setPrimaryTrack('cpp');
      router.push('/assessment?track=cpp');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Could not save your choice. Try again.';
      if (message.includes('already')) {
        router.push('/assessment?track=cpp');
        return;
      }
      show({ variant: 'error', title: 'Something went wrong', message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-gray-100/80 dark:from-gray-950 dark:to-[#0a0a12] px-4 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 dark:border-blue-500/30 bg-white/80 dark:bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-4">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Before your placement
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            C++ is the focus here
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            ACLP is a C++ learning platform: bilingual readings, a cloud compiler, quizzes, and certificates—all around
            one curriculum. Continue to the short placement test so we can unlock lessons at the right level for you.
          </p>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => void continueWithCpp()}
          className={cn(
            'relative w-full text-left rounded-2xl border bg-white/90 dark:bg-white/[0.03] backdrop-blur-sm p-6 sm:p-7 transition-all duration-200',
            'hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:ring-offset-gray-950',
            'disabled:opacity-60 disabled:pointer-events-none',
            'from-blue-600/15 to-indigo-600/10 border-blue-200/80 dark:border-blue-500/25 bg-gradient-to-br'
          )}
        >
          <div className="flex items-start gap-4">
            <span
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-gray-900/80 border border-gray-200/80 dark:border-white/10 shadow-sm',
                'text-blue-600 dark:text-blue-400'
              )}
            >
              {loading ? <Spinner size="sm" /> : <Code2 className="h-6 w-6" aria-hidden />}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Continue to placement</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Fifteen multiple-choice questions (~5 minutes). If your account already picked C++, we skip straight to
                the test.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Start
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </div>
        </button>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
          New accounts default to C++; this step is mainly for older sign-ups that have not finished onboarding.
        </p>
      </div>
    </div>
  );
}
