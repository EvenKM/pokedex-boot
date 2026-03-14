export type CacheEntry<T> = {
	createdAt: number,
	val: T
}

export class Cache {
	#cache = new Map<string, CacheEntry<any>>();
	#reapIntervalId: NodeJS.Timeout | undefined = undefined;
	#interval: number;

	constructor (inval: number) {
		this.#interval = inval;

		this.#startReapLoop();
	}

	#reap() {
		this.#cache.forEach((value, key) => {
			if (value.createdAt < (Date.now() - this.#interval)) {
				this.#cache.delete(key);
			}
		});
	}

	#startReapLoop() {
		this.#reapIntervalId = setInterval(() => this.#reap(), this.#interval);
	}

	stopReapLoop() {
		clearInterval(this.#reapIntervalId);
		this.#reapIntervalId = undefined;

	}

	add<T>(key: string, val: T) {
		this.#cache.set(key, {createdAt: Date.now(), val: val});
	}

	get<T>(key: string): T | undefined {
		if (this.#cache.has(key)) {
			let ret = this.#cache.get(key) ?? undefined;
			if (ret) return ret.val;
		}
		return undefined;
	}

}