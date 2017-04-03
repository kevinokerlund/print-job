import {getElement} from './utils';


const STYLE_CLASSES = {
	BODY: '__PRINT_DOM_BODY__',
	PARENT: '__PRINT_DOM_PARENT__',
	PRINT: '__PRINT_DOM_PRINT__'
};


const CSS = `
/*PRINTING DIV CSS*/
@media print {
	body.${STYLE_CLASSES.BODY} > :not(.${STYLE_CLASSES.PRINT}),
	body.${STYLE_CLASSES.BODY} .${STYLE_CLASSES.PARENT} > :not(.${STYLE_CLASSES.PRINT}) {
		display: none !important;
	}	
}
`.trim();


const HEAD = document.head || document.getElementsByTagName('head')[0];


const STYLE = HEAD.appendChild(document.createElement('style'));
STYLE.appendChild(document.createTextNode(CSS));


let currentPrinter = null;
let convertedTextNodes = [];


function convertTextNodes(parentNode) {
	[].slice.call(parentNode.childNodes).forEach(node => {
		if (node.nodeType === 3) {
			let temp = document.createElement('span');
			node.parentNode.replaceChild(temp, node);
			temp.appendChild(node);
			convertedTextNodes.push(temp);
		}
	});
}


function undoTextNodeConversions() {
	convertedTextNodes.forEach(node => {
		node.parentNode.replaceChild(node.firstChild, node)
	});
	convertedTextNodes = [];
}


function beforePrint() {
	if (currentPrinter) {
		let node = currentPrinter._source;
		node.classList.add(STYLE_CLASSES.PRINT);

		while (node.parentNode && node.parentNode !== document.body) {
			node = node.parentNode;
			convertTextNodes(node);
			node.classList.add(STYLE_CLASSES.PARENT);
			node.classList.add(STYLE_CLASSES.PRINT);
		}

		convertTextNodes(document.body);
		document.body.classList.add(STYLE_CLASSES.BODY);
	}
}


function afterPrint() {
	if (currentPrinter) {
		undoTextNodeConversions();
		document.body.classList.remove(STYLE_CLASSES.BODY);

		[].slice
			.call(document.querySelectorAll(`.${STYLE_CLASSES.PARENT}`))
			.forEach(node => node.classList.remove(STYLE_CLASSES.PARENT));

		[].slice
			.call(document.querySelectorAll(`.${STYLE_CLASSES.PRINT}`))
			.forEach(node => node.classList.remove(STYLE_CLASSES.PRINT));

		currentPrinter = null;
	}
}


if (window.matchMedia) {
	window.matchMedia('print').addListener(mql => {
		if (mql.matches) {
			beforePrint();
		}
		else {
			afterPrint();
		}
	});
}
window.addEventListener('beforeprint', beforePrint);
window.addEventListener('afterprint', afterPrint);


class PrintJob {
	constructor(selectorOrDomNode) {
		this._source = getElement(selectorOrDomNode);
		this._promise = null;
		console.log(this._source);
	}

	print() {
		if (!currentPrinter) {
			currentPrinter = this;
			window.print();
		}
		return this;
	}
}


export default PrintJob;
