import { Lumber, Renderer, World, Rekt, Obj, pts, aabb2 } from "./Re-exports"

export const enum KEY {
	OFF = 0,
	UP = 0,
	PRESSED,
	DELAY,
	AGAIN
}

export namespace App {

	export var version = '0.07?';
	export var map = {};
	export var wheel = 0;

	export var move: [number, number] = [0, 0];
	export var left = false;

	function onkeys(event) {
		const key = event.key.toLowerCase();
		// console.log(event);
		if ('keydown' == event.type)
			map[key] = (undefined == map[key])
				? KEY.PRESSED
				: KEY.AGAIN;
		else if ('keyup' == event.type)
			map[key] = KEY.UP;
		if (key == 114)
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
		Renderer.init();
		Lumber.init();
		Loop(0);
	}

	function Delay() {
		for (let i in map) {
			if (KEY.PRESSED == map[i])
				map[i] = KEY.DELAY;
			else if (KEY.UP == map[i])
				delete map[i];
		}
	}

	function Loop(timestamp) {
		requestAnimationFrame(Loop);
		Renderer.update();
		Lumber.update();
		Renderer.render();
		wheel = 0;
		Delay();
	}
}

window['App'] = App;

export default App;