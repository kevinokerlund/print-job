import {getElement, highestZIndex, makePrintCss} from './utils';

const HEAD = document.head || document.getElementsByTagName('head')[0];

const STYLE_CLASSES = {
	PRINT: '__PRINT_JOB_PRINT__',
	PARENT: '__PRINT_JOB_PARENT__',
	PRINT_STYLE: '__PRINT_JOB_MEDIA_CSS__',
	BLANKET: '__PRINT_JOB_BLANKET__'
};


function addCSSToHead(clientWidth, clientHeight) {
	const zIndex = highestZIndex();
	const CSS = `
		/*PRINTING DIV CSS*/
		@media print {
			html body .${STYLE_CLASSES.PRINT} {
				background-color: #fff;
				position: absolute !important;
				top: 0;
				left: 0;
				min-width: ${clientWidth}px;
				z-index: ${zIndex + 20};
			}
			.${STYLE_CLASSES.BLANKET} {
				background-color: #fff;
				position: fixed;
				top: -100px;
				right: -100px;
				bottom: -100px;
				left: -100px;
				z-index: ${zIndex + 10};
			}
			html body > :not(.${STYLE_CLASSES.PARENT}):not(.${STYLE_CLASSES.BLANKET}):not(.${STYLE_CLASSES.PRINT}) {
				display: none !important;
			}
			.${STYLE_CLASSES.PARENT} {
				position: static !important;
				max-height: ${clientHeight}px;
				overflow: hidden !important;
			}
		}
		`.trim();

	const STYLE = HEAD.appendChild(document.createElement('style'));

	STYLE.id = STYLE_CLASSES.PRINT_STYLE;
	STYLE.appendChild(document.createTextNode(CSS));
}


function removeCSSFromHead() {
	let style = document.getElementById(STYLE_CLASSES.PRINT_STYLE);
	style.parentNode.removeChild(style);
}


function addCoverToBody() {
	let div = document.createElement('div');
	div.className = STYLE_CLASSES.BLANKET;
	document.body.appendChild(div);
}


function removeCoverFromBody() {
	let test = document.querySelector('.' + STYLE_CLASSES.BLANKET);
	test.parentNode.removeChild(test);
}


function beforePrint(node) {
	let clientWidth = node.clientWidth;
	let clientHeight = node.clientHeight;
	let smashedWidth;
	let oldBodyWidth = document.body.style.width;
	let oldBodyPosition = document.body.style.position;

	document.body.style.width = '0';
	document.body.style.position = 'relative';

	smashedWidth = node.clientWidth;

	document.body.style.width = oldBodyWidth;
	document.body.style.position = oldBodyPosition;

	node.classList.add(STYLE_CLASSES.PRINT);

	while (node.parentNode && node.parentNode !== document.body) {
		node = node.parentNode;
		node.classList.add(STYLE_CLASSES.PARENT);
	}

	addCSSToHead(Math.max(clientWidth, smashedWidth), clientHeight);
	addCoverToBody();
}


function afterPrint(node) {
	node.classList.remove(STYLE_CLASSES.PRINT);

	removeCSSFromHead();
	removeCoverFromBody();

	[].slice
		.call(document.querySelectorAll(`.${STYLE_CLASSES.PARENT}`))
		.forEach(node => node.classList.remove(STYLE_CLASSES.PARENT));
}


export default {
	print(selectorOrDomNode) {
		if (selectorOrDomNode === document.body) {
			return window.print();
		}
		const elementToPrint = getElement(selectorOrDomNode);
		beforePrint(elementToPrint);
		window.print();
		afterPrint(elementToPrint);
	}
};
