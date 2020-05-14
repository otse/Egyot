import Rekt from "./Nieuw mapje/Rekt";
import Obj from "./Nieuw mapje/Obj";

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
 
		nyan.find('a.foo').each((i, e) => {
			let jay = $(e);
			(window as any).afoo = jay;
			if (jay.attr('collapse') == "") {				
				jay.addClass('toggle').next().addClass('toggle');
			} 
		});
		/*
			A div with two spans is an rpg item.
		*/
		nyan.find('div').children().find('span').next('span').parent().addClass('rpgitem');
	}

	export function messageslide(title: string, message: string) {

		let jay = $('<div>').addClass('messageslide').append(`<span>${title}`).append(`<span>${message}`);

		win.append(jay);

	}

	export function init() {
		(window as any).Win = Win;

		body = $('body');
		win = $('#win');
	}

	export function update() {
		$('#numRekts').html('Num rekts: '+Rekt.num);
		$('#numObjs').html('Num objs: '+Obj.num);
		$('#numObjsActive').html('Num objs active: '+Obj.active);
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