import {highestZIndex} from './utils';


/**
 * Strings used for various IDs on the page
 *
 * @type {object}
 */
export const IDS = {
	BLANKET: '__PRINT_JOB_BLANKET__',
	PRINT_STYLE: '__PRINT_JOB_MEDIA_CSS__',
	IMAGE: '__PRINT_JOB_IMAGE__'
};


/**
 * Strings used for various classes on the page
 *
 * @type {object}
 */
export const CLASSES = {
	PRINT: '__PRINT_JOB_PRINT__',
	PARENT: '__PRINT_JOB_PARENT__'
};


/**
 * Create the CSS specific to the element being printed
 */
export function createCSS(elementToPrint) {
	const zIndex = highestZIndex();
	const originalBodyWidth = document.body.style.width;
	const originalBodyPosition = document.body.style.position;

	const computedStyles = window.getComputedStyle(elementToPrint);
	const elementHeight = parseInt(computedStyles.height);

	const calculatedWidth = parseInt(computedStyles.width);
	let difference = Math.abs(calculatedWidth - elementToPrint.offsetWidth);
	let calculatedMinWidth;
	let calculatedMaxWidth;
	let widthString = '';

	document.body.style.position = 'relative';
	document.body.style.width = '0';
	calculatedMinWidth = parseInt(computedStyles.width);
	document.body.style.width = '10000px';
	calculatedMaxWidth = parseInt(computedStyles.width);
	document.body.style.width = originalBodyWidth;
	document.body.style.position = originalBodyPosition;

	if (calculatedWidth === calculatedMinWidth && calculatedWidth === calculatedMaxWidth) {
		widthString = `width: ${calculatedWidth}px`;
	}
	else {
		widthString = `
			width: calc(100% - ${difference}px);
			min-width = ${calculatedMinWidth}px;
			max-width = ${calculatedMaxWidth}px;
		`.trim();
	}

	return `
	@media print {

		.${CLASSES.PRINT} {
			position: absolute !important;
			top: 0 !important;
			left: 0 !important;
			z-index: ${zIndex + 20} !important;
			${widthString}
		}

		.${CLASSES.PARENT} {
			position: static !important;
			max-height: ${elementHeight}px !important;
			overflow: hidden !important;
		}

		#${IDS.BLANKET} {
			background-color: #fff;
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: ${zIndex + 10};
		}

		body > :not(.${CLASSES.PARENT}):not(#${IDS.BLANKET}):not(.${CLASSES.PRINT}) {
			display: none !important;
		}

	}
	`;
}


/**
 * Create the CSS needed to print images
 *
 * @returns {string}
 */
export function createImageCSS() {
	return `
	#${IDS.IMAGE} {
		display: none;
		max-width: 100%;
	}
	
	@media print {
	
		#${IDS.IMAGE} {
			display: block;
		}
		
		body > *:not(#${IDS.IMAGE}) {
			display: none !important;
		}
	}
	`;
}
