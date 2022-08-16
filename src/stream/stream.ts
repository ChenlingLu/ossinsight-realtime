export interface Publisher {
  request: () => void;
  stop: () => void;
}

export interface Subscriber<T> {
  onReceive: (item: T) => void;
  onEnd?: () => void;
}

export interface StreamSubscriber {
  stop: () => void;
  start: () => void;
}

export class Stream<T> implements Publisher {
  private publisher: Publisher;
  private subscribers: Set<Subscriber<T>>;

  constructor(publisher: Publisher) {
    this.publisher = publisher;
    this.subscribers = new Set();
  }

  request() {
    this.publisher.request();
  }

  stop() {
    this.subscribers.forEach(s => s.onEnd?.())
    this.subscribers.clear();
  }

  provide(items: T[]) {
    items.forEach(item => {
      this.subscribers.forEach(subscriber => subscriber.onReceive(item));
    });
  }

  subscribe(onReceive: (item: T) => void, onEnd?: () => void): StreamSubscriber {
    const subscriber = {
      onReceive,
      onEnd,
    };
    this.subscribers.add(subscriber);
    return {
      stop: () => {
        this.subscribers.delete(subscriber);
        subscriber.onEnd?.()
        if (this.subscribers.size === 0) {
          this.stop();
        }
      },
      start: () => {
        this.publisher.request();
      },
    };
  }

  map<R>(mapper: (item: T) => R): Stream<R> {
    const stream = new Stream<R>(this);
    this.subscribe(item => {
      stream.provide([mapper(item)]);
    });

    return stream;
  }

  flatMap<R>(mapper: (item: T) => R[]): Stream<R> {
    const stream = new Stream<R>(this);
    this.subscribe(item => {
      stream.provide(mapper(item));
    });
    return stream;
  }

  // end ops
  forEach(handler: (item: T) => void): void {
    const subscriber = this.subscribe(handler);
    subscriber.start();
  }

  async collect(n: number, timeout?: number): Promise<T[]> {
    if (n <= 0) {
      return [];
    }
    return new Promise((resolve, reject) => {
      const result: T[] = [];
      let handle: ReturnType<typeof setTimeout> | undefined = undefined;
      if (timeout) {
        handle = setTimeout(() => {
          reject(new Error('timeout'));
          this.stop();
        }, timeout);
      }
      this.subscribe(item => {
        result.push(item);
        if (result.length >= n) {
          resolve(result);
          this.stop();
          clearTimeout(handle);
        }
      });
      this.request();
    });
  }
}
