export class PubSub<T> {
    private subscribers = new Set<(data: T) => void | PromiseLike<void>>();
    private queue: T[] = [];
    private isRunning = false;

    subscribe(callback: (data: T) => void | PromiseLike<void>) {
        this.subscribers.add(callback);
    }

    private async runCallbacks() {
        this.isRunning = true;
        while (this.queue.length) {
            const data = this.queue.shift()!;
            for (const subscriber of this.subscribers) {
                await subscriber(data);
            }
        }
        this.isRunning = false;
    }

    publish(data: T) {
        this.queue.push(data);
        if (!this.isRunning) {
            this.runCallbacks();
        }
    }
}