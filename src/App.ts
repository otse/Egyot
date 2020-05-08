import { ThreeQuarter as ThreeQuarter } from "./ThreeQuarter";

import Game from "./Game";
import Egyt from "./Egyt";

export const enum KEY {
	OFF = 0,
	UP = 0,
	PRESSED,
	DELAY,
	AGAIN
}

type Char = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k'
	| 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x'
	| 'y' | 'z' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K'
	| 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X'
	| 'Y' | 'Z' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export namespace App {

	export var version = '0.05';
	export var map = {};
	export var wheel = 0;

	export var move: [number, number] = [0, 0];
	export var left = false;

	function onkeys(event) {
		const key = event.key;

		//console.log(event);

		if ('keydown' == event.type)
			map[key] = (undefined == map[key])
				? KEY.PRESSED
				: KEY.AGAIN;

		else if ('keyup' == event.type)
			map[key] = KEY.UP;

		if (key == 114) // Zoeken op pagina
			event.preventDefault();

		return;
	}

	function onwheel(event) {
		let up = event.deltaY < 0;
		wheel = up ? 1 : -1;
	}

	function onmove(event) {
		move[0] = event.clientX;
		move[1] = event.clientY;
	}

	function ondown(event) {
		if (event.button == 0)
			left = true;
	}

	function onup(event) {
		if (event.button == 0)
			left = false;
	}

	export function Boot(version: string) {

		App.version = version;

		document.onkeydown = document.onkeyup = onkeys;
		document.onmousemove = onmove;
		document.onmousedown = ondown;
		document.onmouseup = onup;
		document.onwheel = onwheel;

		ThreeQuarter.init();
		
		Egyt.init();

		loo(0);

		setTimeout(() => ThreeQuarter.changes = true, 10);
	}

	// Lokale functies

	const Delay = () => {

		for (let i in map) {

			if (KEY.PRESSED == map[i])
				map[i] = KEY.DELAY;

			else if (KEY.UP == map[i])
				delete map[i];
		}

	}

	const loo = (timestamp) => {
		requestAnimationFrame(loo);

		ThreeQuarter.update();
		Egyt.game.update();
		Egyt.update();
		
		ThreeQuarter.render();

		wheel = 0;

		Delay();
	}
}

window['App'] = App;

export default App;