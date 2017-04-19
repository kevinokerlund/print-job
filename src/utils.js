export function isDom(obj) {
	return (obj && obj instanceof HTMLElement);
}

export function getElements(selectorOrNode) {
	if (isDom(selectorOrNode)) {
		return [selectorOrNode];
	}
	return document.querySelectorAll(selectorOrNode);
}

export function getElement(selectorOrNode) {
	if (isDom(selectorOrNode)) {
		return selectorOrNode;
	}
	return document.querySelector(selectorOrNode);
}

export function highestZIndex() {
	return Math.max(...[].slice.call(document.querySelectorAll('body *'))
		.map(el => {
			let css = window.getComputedStyle(el);
			return parseInt(css.zIndex) || 1;
		}));
}
