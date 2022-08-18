export interface Cancelable {
  cancel(reason?: any): void;
}

export interface CancellableFetchPromise<T> extends Promise<T>, Cancelable {
}

export function cancellableFetch(input: RequestInfo | URL, init?: RequestInit): CancellableFetchPromise<Response> {
  const controller = new AbortController();

  const cancellableInit: RequestInit = Object.assign({}, init);
  if (cancellableInit.signal) {
    throw new Error('signal must be not set');
  }
  cancellableInit.signal = controller.signal;

  const result = fetch(input, init) as CancellableFetchPromise<Response>;
  result.cancel = controller.abort.bind(controller);

  return result;
}
