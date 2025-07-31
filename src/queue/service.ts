import { AsyncTask } from "./types";

export class QueueService {
  private static queue: Array<AsyncTask> = [];
  private static started = false;

  private constructor() {}

  static add(task: AsyncTask) {
    if (this.queue.length >= 100_000) {
      return;
    }

    this.queue.push(task);

    if (this.started) return;
    this.started = true;

    const tick = async () => {
      const task = this.queue.shift();

      if (task) await task();

      if (this.queue.length === 0) {
        return (this.started = false);
      }

      setTimeout(tick, 1000);
    };

    setTimeout(tick, 1000);
  }
}
