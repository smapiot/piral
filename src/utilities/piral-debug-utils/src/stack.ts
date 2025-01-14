export interface StackTraceOptions {
  filter?: (stackFrame: StackFrame) => boolean;
  sourceCache?: SourceCache;
  offline?: boolean;
}

export interface SourceCache {
  [key: string]: string | Promise<string>;
}

export interface StackFrame {
  constructor(object: StackFrame): StackFrame;

  isConstructor?: boolean;
  getIsConstructor(): boolean;
  setIsConstructor(): void;

  isEval?: boolean;
  getIsEval(): boolean;
  setIsEval(): void;

  isNative?: boolean;
  getIsNative(): boolean;
  setIsNative(): void;

  isTopLevel?: boolean;
  getIsTopLevel(): boolean;
  setIsTopLevel(): void;

  columnNumber?: number;
  getColumnNumber(): number;
  setColumnNumber(): void;

  lineNumber?: number;
  getLineNumber(): number;
  setLineNumber(): void;

  fileName?: string;
  getFileName(): string;
  setFileName(): void;

  functionName?: string;
  getFunctionName(): string;
  setFunctionName(): void;

  source?: string;
  getSource(): string;
  setSource(): void;

  args?: any[];
  getArgs(): any[];
  setArgs(): void;

  evalOrigin?: StackFrame;
  getEvalOrigin(): StackFrame;
  setEvalOrigin(): void;

  toString(): string;
}

declare global {
  interface Window {
    StackTrace: {
      fromError(error: Error, options?: StackTraceOptions): Promise<Array<StackFrame>>;
    };
  }
}

let installPromise: Promise<void> | undefined;

export function install() {
  if (!installPromise) {
    installPromise = new Promise<void>((resolve, reject) => {
      const sts = document.createElement('script');
      sts.src = 'https://cdnjs.cloudflare.com/ajax/libs/stacktrace.js/2.0.2/stacktrace.min.js';
      document.head.appendChild(sts);
      sts.onload = () => resolve();
      sts.onerror = () => reject();
    });
  }

  return installPromise;
}

export async function convertError(error: any, start = 0, end = -1) {
  await install();
  const frames = await window.StackTrace.fromError(error);
  return frames
    .slice(start, end)
    .map((sf) => sf.toString())
    .join('\n');
}
