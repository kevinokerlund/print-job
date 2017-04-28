/**
 * Checks to see if the argument is a DOM element
 *
 * @param obj
 * @returns {*|boolean}
 */
export function isDom(obj) {
	return (obj && obj instanceof HTMLElement);
}


/**
 * Gets an element if a selector is passed.
 * If an element is passed, then just return the element.
 * This allows users to print a node directly, or pass in
 * a selector to find the element
 *
 * @param selectorOrNode
 * @returns {*}
 */
export function getElement(selectorOrNode) {
	if (isDom(selectorOrNode)) {
		return selectorOrNode;
	}
	return document.querySelector(selectorOrNode);
}


/**
 * Finds the highest z-index used on the page
 *
 * @returns {number}
 */
export function highestZIndex() {
	return Math.max(...[].slice.call(document.querySelectorAll('body *'))
		.map(el => {
			let css = window.getComputedStyle(el);
			return parseInt(css.zIndex) || 1;
		}));
}
