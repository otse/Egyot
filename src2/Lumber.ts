import World from "./lod/World";
import Obj from "./objrekt/Obj";

import { Board } from "./nested/Board";
import { Ploppables } from "./lod/Ploppables";


export namespace Lumber {

	export var USE_CHUNK_RT = true;
	export var OFFSET_CHUNK_OBJ_REKT = true;
	export var PAINT_OBJ_TICK_RATE = false;
	export var MINIMUM_REKTS_BEFORE_RT = 0;

	export const EVEN = 24; // very evenly divisible
	export const YUM = EVEN;

	export var world: World;
	export var ply: Obj;

	var started = false;

	export function sample(a) {
		return a[Math.floor(Math.random() * a.length)];
	}

	export function clamp(val, min, max) {
		return val > max ? max : val < min ? min : val;
	}

	export enum RESOURCES {
		RC_UNDEFINED = 0,
		POPULAR_ASSETS,
		READY,
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
		world = World.rig();
		
		resourced('RC_UNDEFINED');
		resourced('READY');
		window['Lumber'] = Lumber;
	}
	function start() {
		if (started)
			return;
		console.log('lumber starting');

		if (window.location.href.indexOf("#nochunkrt") != -1)
			USE_CHUNK_RT = false;

		world.populate();
		
		Ploppables.plant_trees();

		Board.init();

		Board.raw(`
		<!-- <div>May have to reload for latest version<br/> -->
		<br />
		<div class="region small">
			<a>Tutorial</a>
			<div>
				Move the view with <key>W</key> <key>A</key> <key>S</key> <key>D</key>.
				Hold <key>X</key> to go faster. Scrollwheel to zoom. 
			</div>

			<a>World editing</a>
			<div>
				You can plop objects with these shortcuts.
				<br/><br/>
				<key>T</key> tree<br/>
				<key>Y</key> tile<br/>
				<key>U</key> tile area<br/>
				<key>X</key> delete<br/>
				<key>Esc</key> cancel<br/>
			</div>

			<a>Settings</a>
			<div>
				Nothing here yet
			</div>

			<a collapse>Stats</a>
			<div class="stats">
				<span id="fpsStat">xx</span><br/>
				<!-- <span id="memoryStat">xx</span><br/> -->
				<br/>
				<span id="gameZoom"></span><br/>
				<span id="gameAabb"></span><br/>
				<br/>
				<span id="numChunks"></span><br/>
				<span id="numObjs"></span><br/>
				<span id="numRekts"></span><br/>
				<br/>
				<span id="square"></span><br/>
				<span id="squareChunk"></span><br/>
				<span id="squareChunkRt">xx</span><br/>
				<br />
				<span id="snakeTurns"></span><br/>
				<span id="snakeTotal"></span><br/>
				<br/>
				<span id="USE_CHUNK_RTT">USE_CHUNK_RTT: ${USE_CHUNK_RT}</span><br/>
				<span id="OFFSET_CHUNK_OBJ_REKT">OFFSET_CHUNK_OBJ_REKT: ${OFFSET_CHUNK_OBJ_REKT}</span><br/>
				<span id="PAINT_OBJ_TICK_RATE">PAINT_OBJ_TICK_RATE: ${PAINT_OBJ_TICK_RATE}</span><br/>
				<span id="PAINT_OBJ_TICK_RATE">MINIMUM_REKTS_BEFORE_RT: ${MINIMUM_REKTS_BEFORE_RT}</span><br/>
			</div>`);

		//setTimeout(() => Board.messageslide('', 'You get one cheap set of shoes, and a well-kept shovel.'), 1000);

		started = true;
	}

	export function update() {

		if (!started)
			return;

		world.update();

		Board.update();

		Ploppables.update();
	}

}

export default Lumber;