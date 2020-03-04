export type subscription<T> = (message: T) => void;

export class PubSub {
  subscriptions = new Map<string, subscription<any>[]>();

  subscribe<T>(topic: string, callback: subscription<T>) {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, []);
    }

    this.subscriptions.get(topic)?.push(callback);
  }

  publish<T>(topic: string, message: T) {
    if (this.subscriptions.has(topic)) {
      for (let sub of this.subscriptions.get(topic)!) {
        sub(message);
      }
    }
  }
}
