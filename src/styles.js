import {highestZIndex} from './utils';


/**
 * @ToDo
 *
 * @type {object}
 */
const IDS = {
	BLANKET: '__PRINT_JOB_BLANKET__',
	PRINT_STYLE: '__PRINT_JOB_MEDIA_CSS__'
};


/**
 * @ToDo
 *
 * @type {object}
 */
export const CLASSES = {
	PRINT: '__PRINT_JOB_PRINT__',
	PARENT: '__PRINT_JOB_PARENT__'
};


/**
 * @ToDo
 *
 * @param printElementWidth
 * @param smashedWidth
 * @param printElementHeight
 * @returns {string}
 */
export function createCSS(printElementWidth, smashedWidth, printElementHeight) {
	const zIndex = highestZIndex();

	let maxWidth = '';

	if (printElementWidth === smashedWidth) {
		maxWidth = `max-width: ${printElementWidth}px;`;
	}

	return `
	@media print {

		.${CLASSES.PRINT} {
			position: absolute !important;
			top: 0 !important;
			left: 0 !important;
			z-index: ${zIndex + 20} !important;
			min-width: ${Math.max(printElementWidth, smashedWidth)}px !important;
			${maxWidth}
		}

		.${CLASSES.PARENT} {
			position: static !important;
			max-height: ${printElementHeight}px !important;
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
