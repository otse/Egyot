import { Map } from "./Nieuw mapje 2/Map";
import { World } from "./Nieuw mapje 2/World";
import Obj from "./Nieuw mapje/Obj";
import { NUI } from "./NUI";
import Game from "./Game";

export namespace Egyt {

	export var game: Game;
	export var map: Map;
	export var world: World;
	export var ply: Obj;

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

		game = Game.rig();
		world = World.rig();
		map = Map.rig();

		(window as any).Egypt = Egyt;
	}

	export function start() {

		if (started)
			return;

		console.log('egyt starting');

		NUI.init();
		NUI.watch('a webgame about lumber? welcome. this area is for debug watch');

		started = true;
	}

	export function update() {

		if (!started)
			return;

		world.update();
		map.update();
	}

}

export default Egyt;