const noop: Logger = () => {
};

export type Logger = (label: string, ...args: any[]) => void

export function createDebugLogger(tag: string): Logger {
  if (import.meta.env.DEV) {
    return (arg0: string, ...args: any[]) => console.debug(`[${tag}] ${arg0}`, ...args);
  } else {
    return noop;
  }
}