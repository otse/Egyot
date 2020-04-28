import { Map } from "./Map";

export namespace Egyt {

	export var map: Map;
	export var ply: null;

	var started = false;

	export function floor_random(n) {
		return Math.floor(Math.random() * n)
	}

	export enum RESOURCES {
		UNDEFINED_OR_INIT = 0,
		//FONT_WHITE,
		//FONT_YELLOW,
		//FONT_MISSION,
		//SPRITES,
		COUNT
	};

	let resources_loaded = 0b0;

	export function resourced(word: string) {

		resources_loaded |= 0b1 << RESOURCES[word];

		try_start();
	}

	function try_start() {

		let count = 0;

		let i = 0;
		for (; i < RESOURCES.COUNT; i++)
			(resources_loaded & 0b1 << i) ? count++ : void (0);

		if (count == RESOURCES.COUNT)
			start();
	}

	export function critical(mask: string) {

		// Couldn't load

		console.error('resource', mask);

	}

	export function init() {
		console.log('egyt init');

		resourced('UNDEFINED_OR_INIT');

		map = Map.rig();

		(window as any).Egypt = Egyt;
	}

	export function start() {

		if (started)
			return;

		console.log('egyt starting');

		started = true;
	}

	export function update() {

		if (!started)
			return;

		map.update();
	}

}

export default Egyt;