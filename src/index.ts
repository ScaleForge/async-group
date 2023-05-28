import { randomBytes } from 'crypto';

const PROCESS_ID = randomBytes(4);

function generateId() {
  return Buffer.concat([
    PROCESS_ID,
    randomBytes(6),
  ]).toString('base64url');
}

export default class AsyncGroup {
  private promises: Map<string, Promise<unknown>> = new Map();

  private static instance: AsyncGroup | null = null;

  public async add<T = unknown>(promise: Promise<T>): Promise<T> {
    const id = generateId();

    this.promises.set(
      id,
      promise
        .finally(() => {
          this.promises.delete(id);
        })
    );
  
    return promise;
  }

  public async wait(): Promise<void> {
    while (this.promises.size > 0) {

      const promises = Array.from(this.promises.values());
      this.promises.clear();

      await Promise.all(promises);
    }
  }

  public get size(): number {
    return this.promises.size;
  }

  public static async add<T = unknown>(promise: Promise<T>): Promise<T> {
    if (!this.instance) {
      this.instance = new AsyncGroup();
    }

    return this.instance.add(promise);
  }

  public static async wait(): Promise<void> {
    if (!this.instance) {
      return;
    }

    await this.instance.wait();
  }

  public static get size() {
    if (this.instance) {
      return this.instance.size;
    }

    return 0;
  }
}