import { World } from "./Nieuw mapje 2/World";
import { Map2 } from "./Nieuw mapje 2/Map2";
import Obj from "./Nieuw mapje/Obj";
import { Win } from "./Win";
import Game from "./Game";
import Forestation from "./Nieuw mapje 3/Forestation";
import Tilization from "./Nieuw mapje 3/Grid";
import Agriculture from "./Nieuw mapje 3/Agriculture";

export namespace Egyt {

	export const YUM = 24; // evenly divisible n

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
		map2 = Map2.rig();

		Forestation.init();
		Tilization.init();

		(window as any).Egypt = Egyt;
	}

	export function start() {

		if (started)
			return;

		console.log('egyt starting');

		//if (window.location.href.indexOf("#win95") != -1)
		//	Win.load_sheet('style95.css');
		//else
		//	Win.load_sheet('style2.css');


		Win.init();

		Win.raw(`
		<div>Hi</div>
		<br />
		<div class="region small">
			<a collapse>Tutorial
			</a>
			<div>
				Move the view with <key>W</key> <key>A</key> <key>S</key> <key>D</key>.
				Scroll to zoom.
			</div>

			<a>World editing
			</a>
			<div>
				You can plop objects with these shortcuts.
				<br/><br/>
				<key>T</key> tree<br/>
				<key>Y</key> tile<br/>
				<key>X</key> delete<br/>
				<key>Esc</key> cancel<br/>
			</div>

			<a>Settings
			</a>
			<div>
				Doododoo
			</div>

			<a collapse>Stats
			</a>
			<div>
				<span id="mouseTile"></span><br/>
				<span id="numRekts"></span><br/>
				<span id="numObjs"></span><br/>
				<span id="gamePos"></span><br/>
				<span id="chunk"></span><br/>
				<span id="worldSquareChunk"></span><br/>
			</div>

			<a>Items Demo
			</a>
			<div>
				<div>
					<span>Coral Orb
					</span>
					<span>It used to belong to an elemental spirit. It has the ability to summon rainstorms.
					</span>
				</div>
			</div>
		</div>`);

		started = true;
	}

	export function update() {

		if (!started)
			return;

		Forestation.update();
		Tilization.update();
		Agriculture.update();

		world.update();
		map2.update();

		Win.update();
	}

}

export default Egyt;