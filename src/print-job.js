import {getElement} from './utils';
import {IDS, CLASSES, createCSS, createImageCSS} from './styles';


/**
 * Appends a <style> tag containing the PrintJob css to <head>
 *
 * @param css
 */
function addCSSToHead(css) {
	const style = document.head.appendChild(document.createElement('style'));
	style.id = IDS.PRINT_STYLE;
	style.appendChild(document.createTextNode(css));
}


/**
 * Removes the PrintJob <style> from the <head>.
 * We only want these styles applied while jobs from this library are printing, otherwise
 * printing the whole page could be using the CSS from PrintJob
 */
function removeCSSFromhead() {
	const style = document.getElementById(IDS.PRINT_STYLE);
	style.parentNode.removeChild(style);
}


/**
 * Appended to <body>. This sits visibly behind the element to be printed.
 * It has a background color of white to hide all other content
 */
function addCoverToBody() {
	let div = document.createElement('div');
	div.id = IDS.BLANKET;
	document.body.appendChild(div);
}


/**
 * Removes the element that visually sits behind the element to be printed.
 * This is removed after every job.
 */
function removeCoverFromBody() {
	let blanket = document.getElementById(IDS.BLANKET);
	blanket.parentNode.removeChild(blanket);
}


/**
 * Gets the information needed to style surrounding elements.
 * Prepares the document for printing
 *
 * @param elementToPrint
 */
function beforePrint(elementToPrint) {
	const computedStyles = window.getComputedStyle(elementToPrint);
	const elementWidth = parseInt(computedStyles.width);
	const elementHeight = elementToPrint.clientHeight;
	const oldBodyWidth = document.body.style.width;
	let smashedWidth;

	document.body.style.width = 0;
	smashedWidth = parseInt(computedStyles.width);
	document.body.style.width = oldBodyWidth;

	elementToPrint.classList.add(CLASSES.PRINT);

	addCSSToHead(createCSS(elementWidth, smashedWidth, elementHeight));
	addCoverToBody();

	while (elementToPrint.parentNode && elementToPrint.parentNode !== document.body) {
		elementToPrint = elementToPrint.parentNode;
		elementToPrint.classList.add(CLASSES.PARENT);
	}
}


/**
 * Reverses the effects of the beforePrint actions
 *
 * @param elementToPrint
 */
function afterPrint(elementToPrint) {
	elementToPrint.classList.remove(CLASSES.PRINT);

	removeCSSFromhead();
	removeCoverFromBody();

	[].slice
		.call(document.querySelectorAll(`.${CLASSES.PARENT}`))
		.forEach(parent => parent.classList.remove(CLASSES.PARENT));
}


/**
 * Adds the image to the body, and appends the image CSS to <head>
 *
 * @param img
 */
function beforeImagePrint(img) {
	document.body.appendChild(img);
	addCSSToHead(createImageCSS());
}


/**
 * Reverses the effects of the beforeImagePrint actions
 * @param img
 */
function afterImagePrint(img) {
	document.body.removeChild(img);
	removeCSSFromhead();
}


/**
 * Expose static methods
 */
export default {
	print(selectorOrDomNode) {
		const elementToPrint = getElement(selectorOrDomNode);

		if (elementToPrint === document.body) {
			return window.print();
		}

		beforePrint(elementToPrint);
		window.print();
		afterPrint(elementToPrint);
	},

	image(url) {
		const img = document.createElement('img');
		img['onload'] = () => {
			beforeImagePrint(img);
			window.print();
			afterImagePrint(img);
		};

		img.id = IDS.IMAGE;
		img.src = url;
	}
}
