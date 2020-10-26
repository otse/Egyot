import Lumber from "../Lumber";
import { Chunk } from "../lod/Chunks";
import Rekt from "./Rekt";
import pts from "../lib/pts";
import aabb2 from "../lib/aabb2";

class Obj {
	depth = 0
	rate = 1
	rtt = true
	area: vec2 = [1, 1]
	tile: vec2 = [0, 0]
	rekt: Rekt | null = null
	chunk: Chunk | null = null
	bound: aabb2
	screen: aabb2
	//screen: aabb2 | null = null
	//height_in_halves = 0

	constructor() {
		Obj.num++;
	}
	comes() {
		Obj.active++;
		this.manualupdate();
		this.rekt?.use();
	}
	goes() {
		Obj.active--;
		this.rekt?.unuse();
	}
	unset() {
		Obj.num--;
		this.rekt?.unset();
	}
	finish() {
		this.setarea();
	}
	setarea() {
		this.bound = new aabb2([0, 0], this.area);
		this.bound.translate(this.tile);
	}
	update() {
		if (Lumber.PAINT_OBJ_TICK_RATE)
			this.rekt?.paint_alternate();
	}
	manualupdate() {
		this.setarea();
		this.fitarea();
		this.rekt?.update();
	}
	fitarea() {
		//const mult = pts.mult(this.tile, Lumber.EVEN);
		//const pt = pts.pt(mult);
		//this.screen = new aabb2(
		//	[pt.x, pt.x + this.size[0]],
		//	[pt.y, pt.y + this.size[1]]);
		this.depth = Rekt.simpledepth(this.tile);

		if (!this.bound || !this.rekt)
			return;

		const around: vec2[] = [
			[-1, 1], [0, 1], [1, 1],
			[-1, 0], [0, 0], [1, 0],
			[-1, -1], [0, -1], [1, -1]
		];

		let big = /*this.chunk || */Lumber.wlrd.foreground.big(this.tile);

		for (const a of around) {
			let p = pts.add(big, a);

			let c = Lumber.wlrd.foreground.at(p[0], p[1]);
			if (c) {
				for (const t of c.objs.tuple.tuple) {
					const obj = t[0];

					let test = obj.bound.test(this.bound);
					if (test)
					console.log('test', test);
				}
			}
		}

	}

}

namespace Obj {
	export var active = 0;
	export var num = 0;

	//export type Struct = Obj['struct']
}

export default Obj;