import { Points, Color } from "three";
import Rekt from "./Nieuw mapje/Rekt";
import { aabb3, INTERSECTION } from "./Bound";
import Zxcvs from "./Zxcvs";
import { game } from "./Game";

export class Chump {

	aabb: aabb3

	a: number
	b: number

	swabs: TileSwab[]

	constructor(a: number, b: number) {
		this.a = a;
		this.b = b;

		this.swabs = [];

		this.aabb = new aabb3([
			a * 32 * 128,
			b * 32 * 128, 0], [
			a + 1 * 32 * 128,
			b + 1 * 32 * 128, 0]);
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
	}

	update() {
		for (let swab of this.swabs) {
			swab.update();
		}
	}
}

const OY = 7 * 32;

export class TileSwab {

	aabb: aabb3

	x: number
	y: number

	rekt: Rekt
	wire: Rekt

	constructor() {
		this.spawned = false;
	}

	make(y, oy, x, ox, cx, cy) {

		let chunk = `${cx}_${cy}`;

		let img = `egyt/low/${chunk}/${y + oy}_${x + ox}`;

		//console.log(img);

		let p = [y + (cx * 32), x + (cy * 32) + OY, 0] as Zxc;
		let p2 = [y + 1 + (cx * 32), x + 1 + (cy * 32) + OY, 0] as Zxc;

		//let p = [y+((cy+7)*32), x+(cx*32), 0] as Zxc;
		let p3 = Zxcvs.MultpClone(p, 128);

		this.aabb = new aabb3([
			p3[0] - 64,
			p3[1] - 64, 0], [
			p3[0] + 64,
			p3[1] + 64, 0
		]);

		this.rekt = new Rekt({
			name: 'TileSwab',
			pos: p3 as Zxc,
			dim: [128, 128],
			asset: img
		});

		this.rekt.dontFang = true; // dont 2:1
	}

	spawned: boolean;

	spawn() {
		if (this.spawned)
			return;
		this.rekt.initiate();
		this.frame();
		this.spawned = true;
	}

	despawn() {
		if (!this.spawned)
			return;
		this.rekt.deinitiate();
		this.spawned = false;
	}

	frame() {
		if (this.wire)
			return;

		this.wire = new Rekt({
			name: 'TileSwab Wire',
			pos: this.rekt.stats.pos,
			dim: [128, 128],
			asset: 'egyt/128'
		});

		this.wire.dontFang = true; // dont 2:1

		this.wire.initiate();

		this.wire.material.wireframe = true;
	}

	update() {

		let s = game.aabb.intersect(this.aabb);

		if (s != INTERSECTION.OUTSIDE) {
			this.spawn();
		}
		else {
			this.despawn();
		}
	}

}

export class Map {

	chumps: Chump[]

	constructor() {
		this.chumps = [];

		this.load_chunk(-1, -7);
		this.load_chunk(-1, -8);
		this.load_chunk(0, -7);
		this.load_chunk(0, -8);
		this.load_chunk(1, -7);
		this.load_chunk(1, -8);
		this.load_chunk(2, -7);
		this.load_chunk(2, -8);
	}

	static rig() {
		return new Map();
	}

	update() {
		for (let chump of this.chumps) {
			chump.update();
		}
	}

	load_chunk(a: number, b: number) {

		let chump = new Chump(a, b);
		chump.load();

		this.chumps.push(chump);

	}

}