window.DivPrinter = (function () {
	'use strict';


	var CLS = {
		BODY: 'DIVPRINTER__BODY',
		PARENT: 'DIVPRINTER__PARENT',
		PRINT: 'DIVPRINTER__PRINT'
	};

	/**
	 * Printing CSS
	 *
	 * @type {string}
	 */
	var css = '/*PRINTING DIV CSS*/\n@media print{body.' + CLS.BODY + ' > :not(.' + CLS.PRINT + '),body.' + CLS.BODY + ' .' + CLS.PARENT + ' > :not(.' + CLS.PRINT + '){display: none !important;}}';


	/**
	 * New <style> tag to append to <head>
	 *
	 * @type {HTMLElement}
	 */
	var style = document.createElement('style');
	if (style.styleSheet) {
		style.styleSheet.cssText = css;
	}
	else {
		style.appendChild(document.createTextNode(css));
	}


	/**
	 * Reference to document's <head> tag
	 *
	 * @type {HTMLHeadElement|*}
	 */
	var head = document.head || document.getElementsByTagName('head')[0];
	head.appendChild(style);


	/**
	 * Global values are used to keep track of printing queue and current class that is calling "print"
	 *
	 * @type {{currentClass: undefined, printerQueue: FnQueue}}
	 */
	var __ = {
		vars: {
			// The class that is currently using print()
			currentClass: undefined,

			// If other classes instances called print() while a print job is happening, place in queue until ready
			printerQueue: new FnQueue()
		},
		fn: {
			hasClass: function (element, className) {
				return !!element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
			},
			addClass: function (element, className) {
				if (!__.fn.hasClass(element, className)) element.className = (element.className + ' ' + className).trim();
			},
			removeClass: function (element, className) {
				if (__.fn.hasClass(element, className)) {
					var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
					element.className = element.className.replace(reg, ' ').trim();
				}
			}
		}
	};


	/**
	 * Functions to run before and after window.print() event happens.
	 *
	 * @type {{before: Function, after: Function}}
	 */
	var printerEvents = {
		before: function () {
			if (__.vars.currentClass) {
				PrivateFns.printerClasses.add.call(__.vars.currentClass);
				__.fn.addClass(document.body, CLS.BODY);

				__.vars.currentClass._queue.before.all();
			}
		},
		after: function () {
			if (__.vars.currentClass) {
				__.fn.removeClass(document.body, CLS.BODY);
				PrivateFns.printerClasses.remove.call(__.vars.currentClass);

				__.vars.currentClass._queue.after.all();
				__.vars.currentClass = undefined;
				__.vars.printerQueue.one();
			}
		}
	};


	/**
	 * Attach printing events to window immediately
	 */
	if (window.matchMedia) {
		window.matchMedia('print').addListener(function (mql) {
			if (mql.matches) {
				printerEvents.before();
			}
			else {
				printerEvents.after();
			}
		});
	}
	window.addEventListener('beforeprint', printerEvents.before, false);
	window.addEventListener('afterprint', printerEvents.after, false);


	/**
	 * Function Queue Class
	 * This Queue operates on First In First Out (FIFO)
	 *
	 * @constructor
	 */
	function FnQueue() {
		/**
		 * Holds functions placed in queue
		 *
		 * @type {Array}
		 */
		this.queue = [];


		/**
		 * Returns the current length of the queue
		 *
		 * @returns {*}
		 */
		this.getLength = function () {
			return this.queue.length;
		};


		/**
		 * Adds a new function to the queue
		 *
		 * @param fn
		 */
		this.add = function (fn) {
			if (typeof fn === 'function') this.queue.push(fn);
		};


		/**
		 * Remove and fire off only one function from the queue
		 */
		this.one = function () {
			if (this.queue.length > 0) this.queue.shift()();
		};


		/**
		 * Remove and fire off all functions in the queue
		 */
		this.all = function () {
			while (this.queue.length > 0) {
				(this.queue.shift())();
			}
		};
	}


	/**
	 * Functions to be used as "private" for the main print class
	 *
	 * @type {{printerClasses: {add: Function, remove: Function}}}
	 */
	var PrivateFns = {
		printerClasses: {
			add: function () {
				var node = this._source;
				__.fn.addClass(node, CLS.PRINT);
				while (node.parentNode && node.parentNode !== document.body) {
					node = node.parentNode;
					__.fn.addClass(node, CLS.PARENT);
					__.fn.addClass(node, CLS.PRINT);
				}
			},
			remove: function () {
				var node = this._source;
				__.fn.removeClass(node, CLS.PRINT);
				while (node.parentNode && node.parentNode !== document.body) {
					node = node.parentNode;
					__.fn.removeClass(node, CLS.PARENT);
					__.fn.removeClass(node, CLS.PRINT);
				}
			}
		}
	};


	/**
	 * Main Print Class
	 *
	 * @param source
	 * @constructor
	 */
	function Print(source) {
		/**
		 * The div to be printed
		 *
		 * @type {HTMLElement}
		 * @private
		 */
		this._source = document.querySelector(source);


		/**
		 * Holds the functions to run before and after window.print() is called from the class
		 *
		 * @type {{before: FnQueue, after: FnQueue}}
		 * @private
		 */
		this._queue = {
			before: new FnQueue(),
			after: new FnQueue()
		};
	}


	/**
	 * Calls the window.print() method
	 * Handles each printing call to verify that a printing event is not currently in progress
	 *
	 * @returns {window.DivPrinter}
	 */
	Print.prototype.print = function () {
		if (!__.vars.currentClass) {
			__.vars.currentClass = this;
			window.print();
		}
		else {
			console.log('There is a print job open... adding to printing queue.');
			var self = this;
			__.vars.printerQueue.add(function () {
				self.print();
			});
		}
		return this;
	};


	/**
	 * Adds functions that are executed right before window.print() method is called
	 *
	 * @param fn
	 * @returns {window.DivPrinter}
	 */
	Print.prototype.beforePrint = function (fn) {
		this._queue.before.add(fn);
		return this;
	};


	/**
	 * Adds functions that are executed right after window.print() method is called
	 *
	 * @param fn
	 * @returns {window.DivPrinter}
	 */
	Print.prototype.afterPrint = function (fn) {
		this._queue.after.add(fn);
		return this;
	};


	/**
	 * Return the class object
	 */
	return Print;

})();
