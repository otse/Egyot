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
		
		// In Vsc
		// View -> Toggle Word Wrap

		/*
			An hyperlink and a paragraph form a collapser
		*/
		nyan.find('a').next('div').addClass('bar').prev().addClass('foo').click(function() {	
			$(this).toggleClass("toggle").next('.bar').toggleClass('toggle');
		}).append('<span>');

		/*
			A div with two spans is an rpg item.
		*/
		nyan.find('div').children().find('span').next('span').parent().addClass('rpgitem');
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