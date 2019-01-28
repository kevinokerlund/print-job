export default class Deferred {
	constructor() {
		this.resolve = null;
		this.reject = null;

		let scope = this;
		this.promise = new Promise(function (resolve, reject) {
			scope.resolve = resolve;
			scope.reject = reject;
		})
	}
}
