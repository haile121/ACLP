import { runInSandbox } from "./sandbox";
import type { SandboxWebResult } from "./sandbox-types";

export type CompilerLanguage = "cpp";

export async function runCompiler(
  language: CompilerLanguage,
  sourceCode: string,
): Promise<SandboxWebResult> {
  switch (language) {
    case "cpp":
      return runInSandbox(sourceCode);
    default: {
      const _exhaustive: never = language;
      return _exhaustive;
    }
  }
}
