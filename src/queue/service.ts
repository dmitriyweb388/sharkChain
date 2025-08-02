import { LoggerService } from "../logger/service";
import { AsyncFn } from "./types";

export class QueueService {
  private constructor() {}

  private static queue: Array<AsyncFn> = [];
  private static started = false;

  static push(fn: AsyncFn) {
    if (this.queue.length >= 100_000) {
      return;
    }

    this.queue.push(fn);

    if (this.started) return;
    this.started = true;

    const tick = async () => {
      const fn = this.queue.shift();

      if (fn) {
        try {
          await fn();
        } catch (e) {
          LoggerService.logError("Error: " + JSON.stringify(e));
        }
      }

      if (this.queue.length === 0) {
        return (this.started = false);
      }

      setTimeout(tick, 1000);
    };

    setTimeout(tick, 1000);
  }
}
