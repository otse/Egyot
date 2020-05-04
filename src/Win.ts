namespace Win {
	export var win;

	var body;

	var bloobs;

	export function load_sheet(file: string) {
		let link = document.createElement('link'); 
        link.rel = 'stylesheet';  
        link.type = 'text/css'; 
        link.href = file;  
        document.head.appendChild(link);  
	}

	export function collapse() {

	}

	export function rig_charges(nyan: JQuery) {
		// todo, i know its p bad
		/*
			selector for
			<div>
			<a>collapsable</a>
			<p>hidden content</p>
			</div>
		*/
		nyan.find('a').addClass('foo').next('p').addClass('bar');
	}

	export function init() {
		(window as any).Win = Win;

		body = $('body');
		win = $('#win');
	}

	export function raw(html: string) {
		let nyan = $('<nyan>')

		let jay = $(html);

		nyan.append(jay);
		rig_charges(nyan);
		
		win.append(jay);

		return nyan;
	}
}

export { Win };