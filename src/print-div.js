window.printDiv = (function () {

	var printingSource = null;

	var beforePrint = {
		queue: [],
		run: function () {
			while (this.queue.length > 0) {
				(this.queue.shift())();
			}
		}
	};

	var afterPrint = {
		queue: [],
		run: function () {
			while (this.queue.length > 0) {
				(this.queue.shift())();
			}
		}
	};

	if (window.matchMedia) {
		var mediaQueryList = window.matchMedia('print');
		mediaQueryList.addListener(function (mql) {
			if (mql.matches) {
				beforePrint.run();
			}
			else {
				afterPrint.run();
			}
		});
	}
	window.addEventListener('beforeprint', beforePrint.run, false);
	window.addEventListener('afterprint', afterPrint.run, false);

	var _ = {};

	_.hasClass = function (element, className) {
		return !!element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	};

	_.addClass = function (element, className) {
		if (!_.hasClass(element, className)) element.className = (element.className + ' ' + className).trim();
		return this;
	};

	_.removeClass = function (element, className) {
		if (_.hasClass(element, className)) {
			var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
			element.className = element.className.replace(reg, ' ').trim();
		}
		return this;
	};

	_.printerClasses = {
		add: function () {
			var node = printingSource;
			_.addClass(node, 'PRINT');
			while (node.parentNode && node.parentNode !== document.body) {
				node = node.parentNode;
				_.addClass(node, 'PARENT');
				_.addClass(node, 'PRINT');
			}
		},
		remove: function () {
			var node = printingSource;
			_.removeClass(node, 'PRINT');
			while (node.parentNode && node.parentNode !== document.body) {
				node = node.parentNode;
				_.removeClass(node, 'PARENT');
				_.removeClass(node, 'PRINT');
			}
		}
	};

	var publicMethods = {
		print: function (fns) {
			fns = fns || {};
			beforePrint.queue.push(function () {
				_.printerClasses.add();
				_.addClass(document.body, 'printing-time');
			});
			if (typeof fns.before === 'function') beforePrint.queue.push(fns.before);

			afterPrint.queue.push(function () {
				_.printerClasses.remove();
				_.removeClass(document.body, 'printing-time');
			});
			if (typeof fns.after === 'function') afterPrint.queue.push(fns.after);

			window.print();
		}
	};

	return function (selector) {
		printingSource = document.querySelector(selector);
		return publicMethods;
	};

})();
