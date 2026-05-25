'use client';

import { useState } from 'react';
import { compilerApi, type CompilerResult } from '@/lib/api';
import { useDialog } from '@/components/ui/DialogProvider';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

const SNIPPET = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`;

export default function CompilerPage() {
  const [code, setCode] = useState(SNIPPET);
  const [result, setResult] = useState<CompilerResult | null>(null);
  const [running, setRunning] = useState(false);
  const { show } = useDialog();

  async function handleRun() {
    setRunning(true);
    setResult(null);
    try {
      const res = await compilerApi.run(code, 'cpp');
      setResult(res.data);
    } catch {
      show({ variant: 'error', title: 'Compiler Error', message: 'Failed to reach the compiler service.' });
    } finally {
      setRunning(false);
    }
  }

  const hasError = result && (result.stderr || result.exitCode !== 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-4 h-[calc(100vh-4rem)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">C++ compiler</h1>
          <span className="text-sm text-gray-600 dark:text-gray-400">GCC in the cloud</span>
        </div>
        <Button onClick={handleRun} disabled={running} size="sm">
          {running ? (
            <>
              <Spinner size="sm" />
              &nbsp;Running…
            </>
          ) : (
            '▶ Run'
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Source code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 font-mono text-sm bg-gray-950 text-green-400 rounded-xl border border-gray-700 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-accent min-h-[200px]"
          />
        </div>

        <div className="flex-1 flex flex-col min-h-0 gap-3">
          <div className="flex flex-col min-h-0 flex-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
              Output
            </label>
            <div
              className={`flex-1 font-mono text-sm rounded-xl border p-4 overflow-auto whitespace-pre-wrap min-h-[120px] ${
                result?.timedOut
                  ? 'border-yellow-500 bg-yellow-950 text-yellow-300'
                  : hasError
                    ? 'border-red-500 bg-red-950 text-red-300'
                    : 'border-gray-700 bg-gray-950 text-gray-200'
              }`}
            >
              {!result && !running && (
                <span className="text-gray-600">Run your code to see output here.</span>
              )}
              {running && <span className="text-gray-500">Running…</span>}
              {result?.timedOut && (
                <span className="text-yellow-400">⏱ Execution timed out (10s limit exceeded)</span>
              )}
              {result && !result.timedOut && (
                <>
                  {result.stdout && <span className="text-gray-200">{result.stdout}</span>}
                  {result.stderr && <span className="text-red-400">{result.stderr}</span>}
                  {!result.stdout && !result.stderr && (
                    <span className="text-gray-500">(no output)</span>
                  )}
                </>
              )}
            </div>
            {result && !result.timedOut && (
              <p className="text-xs text-gray-500 mt-1">
                Exit code:{' '}
                <span className={result.exitCode === 0 ? 'text-green-400' : 'text-red-400'}>
                  {result.exitCode}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
