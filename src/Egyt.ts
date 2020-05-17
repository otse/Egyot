import { World } from "./Nieuw mapje 2/World";
import { Map2 } from "./Nieuw mapje 2/Map2";
import Obj from "./Nieuw mapje/Obj";
import { Win } from "./chains";
import Game from "./oldfile";
import Forestation from "./Nieuw mapje 3/Forestation";
import Tilization from "./Nieuw mapje 3/Tilization";
import Agriculture from "./Nieuw mapje 3/Agriculture";

export namespace Egyt {

	export var USE_CHUNK_RT = true;
	export var OFFSET_CHUNK_OBJ_REKT = true;

	export const YUM = 24; // evenly divisible

	export var game: Game;
	export var map2: Map2;
	export var world: World;
	export var ply: Obj;

	var started = false;

	export function sample(a) {
		return a[Math.floor(Math.random() * a.length)];
	}

	export enum RESOURCES {
		UNDEFINED_OR_INIT = 0,
		TILE_ORANGE,
		WHEAT_I,
		WHEAT_IL,
		WHEAT_ILI,
		WHEAT_ILIL,
		WHEAT_ILILI,
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
		
		game = Game.rig();
		world = World.rig();
		map2 = Map2.rig();
		map2.init();
		
		Forestation.init();
		Tilization.init();

		resourced('UNDEFINED_OR_INIT');

		(window as any).Egyt = Egyt;
	}

	export function start() {

		if (started)
			return;

		console.log('egyt starting');

		if (window.location.href.indexOf("#nochunkrt") != -1)
			USE_CHUNK_RT = false;

		map2.populate();

		//	Win.load_sheet('style95.css');
		//else
		//	Win.load_sheet('style2.css');


		Win.init();

		Win.raw(`
		<div>Hint: Press stats for cool render stuff</div>
		<br />
		<div class="region small">
			<a>Tutorial</a>
			<div>
				Move the view with <key>W</key> <key>A</key> <key>S</key> <key>D</key>.
				Scroll to zoom. Hold <key>X</key> to fast scroll.
			</div>

			<a>World editing</a>
			<div>
				You can plop objects with these shortcuts.
				<br/><br/>
				<key>T</key> tree<br/>
				<key>Y</key> tile<br/>
				<key>X</key> delete<br/>
				<key>Esc</key> cancel<br/>
			</div>

			<a>Settings</a>
			<div>
				Nothing here yet
			</div>

			<a>Stats</a>
			<div class="stats">
				<span id="fpsStat">xx</span><br/>
				<span id="memoryStat">xx</span><br/>
				<br/>
				<span id="gameAabb"></span><br/>
				<span id="gamePos"></span><br/>
				<br/>
				<span id="numRekts"></span><br/>
				<span id="numObjs"></span><br/>
				<span id="numObjsActive"></span><br/>
				<span id="worldSquare"></span><br/>
				<span id="worldSquareChunk"></span><br/>
				<span id="chunksShown"></span><br/>
				<span id="snakeTurns"></span><br/>
				<span id="snakeTotal"></span><br/>
				<br>
				<span id="USE_CHUNK_RTT">USE_CHUNK_RTT: ${USE_CHUNK_RT}</span><br/>
				<span id="OFFSET_CHUNK_OBJ_REKT">OFFSET_CHUNK_OBJ_REKT: ${OFFSET_CHUNK_OBJ_REKT}</span><br/>

			</div>

			<a>Items Demo</a>
			<div>
				<div>
					<span>Coral Orb</span>
					<span>It used to belong to an elemental spirit. It has the ability to summon rainstorms.</span>
				</div>
			</div>
		</div>`);

		//setTimeout(() => Win.messageslide('', 'You get one cheap set of shoes, and a well-kept shovel.'), 1000);

		started = true;
	}

	export function update() {

		if (!started)
			return;
		
		Egyt.game.update();

		Forestation.update();
		Tilization.update();
		Agriculture.update();

		world.update();
		map2.update();

		Win.update();
	}

}

export default Egyt;