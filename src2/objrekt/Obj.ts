import LUMBER from "../Lumber";
import { Chunk } from "../lod/Chunks";
import Rekt from "./Rekt";
import pts from "../lib/pts";
import aabb2 from "../lib/aabb2";

class Obj {
	depth = 0
	rate = 1
	rtt = true
	size: vec2 = [24, 12]
	area: vec2 = [1, 1]
	tile: vec2 = [0, 0]
	rekt: Rekt | null = null
	chunk: Chunk | null = null
	bound: aabb2
	wide: aabb2
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
		this.bound = new aabb2([-this.area[0], 0], [0, this.area[1]]);
		this.bound.translate(this.tile);
		this.wide = new aabb2([-this.size[0], 0], [0, this.size[1]]);
		this.wide.translate(pts.mult(this.tile, LUMBER.EVEN));
	}
	update() {
		if (LUMBER.PAINT_OBJ_TICK_RATE)
			this.rekt?.paint_alternate();
	}
	manualupdate() {
		this.setarea();
		this.fitarea();
		this.rekt?.update();
	}
	static translate(a: aabb2, d: number, m: number) {
		const w = [
			[0, 1],
			[-1, 0],
			[0, -1],
			[1, 0]];
		let copy = aabb2.dupe(a);
		if (d < 4)
			copy.translate(pts.mult(<vec2>w[d], m));
		return copy;
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

		let big = LUMBER.wlrd.fg.big(this.tile);

		for (const a of around) {
			let p = pts.add(big, a);
			let c = LUMBER.wlrd.fg.at(p[0], p[1]);
			if (c) {
				for (const t of c.objs.tuple.tuple) {
					const obj = t[0];
					if (obj == this)
						continue;
					if (this.bound.test(obj.bound)) {
						for (let i = 0; i <= 3; i++) {
							let bb = Obj.translate(obj.bound, i, 1);
							if (bb.test(this.bound)) {
								this.rekt.color = ['blue', 'red', 'yellow', 'green'][i];
								break;
							}
						}
						/*
						let a = this.bound.center();
						let b = obj.bound.center();
					let c = pts.pt(this.bound.center());
					let d = pts.pt(obj.bound.center());
					if (c.y >= d.y)
						this.rekt.color = 'red';
					else if (c.y <= d.y)
						this.rekt.color = 'green';
						else
						this.rekt.color = 'white';
						*/
						this.rekt.update();
					}
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