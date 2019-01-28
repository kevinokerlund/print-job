export default class Queue {
	constructor() {
		this.queue = [];
	}

	add(fn) {
		this.queue.push(fn);
	}

	runAll(arg) {
		this.queue.forEach(fn => fn(arg));
	}
}
