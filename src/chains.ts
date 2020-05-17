import Rekt from "./Nieuw mapje/Rekt";
import Obj from "./Nieuw mapje/Obj";
import points from "./points";
import { tq } from "./tq";
import Egyt from "./Egyt";

namespace Chains {
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

	export var collapsed: { [href: string]: boolean } = {};

	export function rig_charges(nyan: JQuery) {

		// In Vsc
		// View -> Toggle Word Wrap

		/*
			An hyperlink and a paragraph form a collapser
		*/
		const _collapse = (jay) => {
			collapsed[jay.text()] = !!jay.hasClass('toggle');
		}
		nyan.find('a').next('div').addClass('bar').prev().addClass('foo').click(function () {
			let jay = $(this);
			jay.toggleClass("toggle").next('.bar').toggleClass('toggle');
			_collapse(jay);
		}).append('<span>');

		nyan.find('a.foo').each((i, e) => {
			let jay = $(e);
			(window as any).afoo = jay;
			if (jay.attr('collapse') == "") {
				jay.addClass('toggle').next().addClass('toggle');
				_collapse(jay);
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
		(window as any).Chains = Chains;

		body = $('body');
		win = $('#win');
	}

	export function update() {

		if (Chains.collapsed.Stats) {
			Chains.win.find('#fpsStat').text(`Fps: ${parseInt(tq.fps)}`);
			Chains.win.find('#memoryStat').text(`Memory: ${(tq.memory.usedJSHeapSize / 1048576).toFixed(4)} / ${tq.memory.jsHeapSizeLimit / 1048576}`);

			Chains.win.find('#gamePos').text(`Game pos: ${points.string(Egyt.game.pos)}`);

			Chains.win.find('#numRekts').html('Num rekts: ' + Rekt.num);
			Chains.win.find('#numObjs').html('Num objs: ' + Obj.num);
			Chains.win.find('#numObjsActive').html('Num objs active: ' + Obj.active);

			Chains.win.find('#worldSquare').text(`World square: ${points.string(Egyt.map2.mouse_tile)}`);
			Chains.win.find('#worldSquareChunk').text(`World square chunk: ${points.string(Egyt.map2.statmaster.big(Egyt.map2.mouse_tile))}`);
			Chains.win.find('#chunksShown').text(`Chunks shown: ${Egyt.map2.statmaster.fitter.shown.length}`);
			Chains.win.find('#snakeTurns').text(`Chunk Snake lines: ${Egyt.map2.statmaster.fitter.lines}`);
			Chains.win.find('#snakeTotal').text(`Chunk Snake total traversed: ${Egyt.map2.statmaster.fitter.total}`);
		}
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

export { Chains as Win };