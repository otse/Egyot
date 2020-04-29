import { Maths, Fiftytwo } from "./Game";
import { Points } from "three";
import Rekt from "./Nieuw mapje/Rekt";
import { aabb3 } from "./Bound";

export class Chump {

	aabb: aabb3

	a: number
	b: number

	swabs: TileSwab[]

	constructor(a: number, b: number) {
		this.a = a;
		this.b = b;

		this.swabs = [];

		let p = [a * 32 * 128, b * 32 * 128, 0];

		this.aabb = new aabb3(
			[0, 0, 0]
		);
	}

	load() {
		let cx = this.a;
		let cy = this.b;
		let ox = (this.b + 1) * 32 - 1;
		let oy = this.a * 32;

		for (let y = 0; y < 32; y++) {
			for (let x = 0; x > -32; x--) {

				let swab = new TileSwab();

				swab.make(y, oy, x, ox, cx, cy);

				this.swabs.push(swab);

			}

		}
		///this.rekt.mesh.renderOrder = -500;
	}

	update() {
		for(let swab of this.swabs) {
			swab.update();
		}
	}
}

const OY = 7 * 32;

export class TileSwab {

	x: number
	y: number

	constructor() {

	}

	make(y, oy, x, ox, cx, cy) {

		let chunk = `${cx}_${cy}`;

		let img = `egyt/low/${chunk}/${y + oy}_${x + ox}`;

		//console.log(img);

		let p = [y + (cx * 32), x + (cy * 32) + OY, 0] as Zxc;
		//let p = [y+((cy+7)*32), x+(cx*32), 0] as Zxc;
		let pos = Maths.MultpClone(p, 128);

		let rekt = new Rekt({
			name: 'A Turf',
			pos: pos as Zxc,
			dim: [128, 128],
			asset: img
		});

		rekt.dontFang = true; // dont 2:1

		rekt.make();
	}

	update() {

	}

}

export class Map {

	chumps: Chump[]

	constructor() {
		this.chumps = [];

		this.load_chunk(0, -7);
		this.load_chunk(0, -8);
		this.load_chunk(1, -7);
		this.load_chunk(1, -8);
	}

	static rig() {
		return new Map();
	}

	update() {
		for(let chump of this.chumps) {
			chump.update();
		}
	}

	load_chunk(a: number, b: number) {

		let chump = new Chump(a, b);
		chump.load();

		this.chumps.push(chump);

	}

}