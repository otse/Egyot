import Rekt from "../objrekt/Rekt";
import Obj from "../objrekt/Obj";
import pts from "./Pts";
import { tq } from "./tq";
import Lumber from "../Lumber";

namespace Board {
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
			A hyperlink and a paragraph form a collapser
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
		(window as any).Chains = Board;

		body = $('body');
		win = $('#win');
	}

	export function update() {

		if (Board.collapsed.Stats) {
			Board.win.find('#fpsStat').text(`Fps: ${parseInt(tq.fps)}`);
			//Board.win.find('#memoryStat').text(`Memory: ${(tq.memory.usedJSHeapSize / 1048576).toFixed(4)} / ${tq.memory.jsHeapSizeLimit / 1048576}`);

			Board.win.find('#gameZoom').html(`Scale: <span>${Lumber.game.scale} / ndpi ${Lumber.game.dpi} / ${window.devicePixelRatio}`);
			Board.win.find('#gameAabb').html(`View bounding volume: <span>${Lumber.game.view.min[0]}, ${Lumber.game.view.min[1]} x ${Lumber.game.view.max[0]}, ${Lumber.game.view.max[1]}`);
			//Board.win.find('#gamePos').text(`View pos: ${points.string(Egyt.game.pos)}`);

			Board.win.find('#numChunks').text(`Num chunks: ${Lumber.map.chunkMaster.fitter.shown.length} / ${Lumber.map.chunkMaster.total}`);
			Board.win.find('#numObjs').html(`Num objs: ${Obj.active} / ${Obj.num}`);
			Board.win.find('#numRekts').html(`Num rekts: ${Rekt.active} / ${Rekt.num}`);

			let b = Lumber.map.chunkMaster.big(Lumber.map.mouse_tiled);
			let c = Lumber.map.chunkMaster.at(b[0], b[1]);
				
			Board.win.find('#square').text(`Mouse: ${pts.to_string(Lumber.map.mouse_tiled)}`);
			Board.win.find('#squareChunk').text(`Mouse chunk: ${pts.to_string(b)}`);
			Board.win.find('#squareChunkRt').text(`Mouse chunk rt: ${c?.rt ? 'true' : 'false'}`);
			Board.win.find('#snakeTurns').text(`CSnake turns: ${Lumber.map.chunkMaster.fitter.lines}`);
			Board.win.find('#snakeTotal').text(`CSnake total: ${Lumber.map.chunkMaster.fitter.total}`);
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

export { Board as Win };