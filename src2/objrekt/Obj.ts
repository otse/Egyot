import LUMBER from "../Lumber";
import { Chunk } from "../lod/Chunks";
import Rekt from "./Rekt";
import pts from "../lib/pts";
import aabb2 from "../lib/aabb2";

class Obj {
	depth = 0
	rate = 1
	rtt = true
	sst: Asset
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
		this.update_manual();
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
		if (!this.sst)
			console.warn('obj no asset');
		this.set_area();
	}
	set_area() {
		if (!this.sst.area)
			return;
		this.bound = new aabb2([-this.sst.area[0]+1, 0], [0, this.sst.area[1]-1]);
		this.bound.translate(this.tile);
	}
	update_tick() {
		if (LUMBER.PAINT_OBJ_TICK_RATE)
			this.rekt?.paint_alternate();
	}
	update_manual() {
		this.set_area();
		this.fit_area();
		this.rekt?.update();
	}
	fit_area() {
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
					if (obj == this || !this.rekt?.bound || !obj.rekt?.bound)
						continue;
					// image clip
					if (!this.rekt.bound.test(obj.rekt.bound))
						continue;
					const a = this.bound;
					const b = obj.bound;
					const test = this.bound.test(obj.bound);
					if (test == 1) {
						this.rekt.color = 'red';
						this.depth = obj.depth + 1;
					}
					else if (test == 2)
					{
						this.rekt.color = 'cyan';
						this.depth = obj.depth + 1;
					}
					else if ( // nwnw
						a.min[0] <= b.max[0] && a.max[0] >= b.min[0] && a.min[1] > b.max[1] ||
						a.max[0] < b.min[0] && a.max[1] >= b.min[1] && a.min[1] <= b.max[1] ||
						a.min[0] < b.min[0] && a.max[1] > b.max[1]) {
						this.rekt.color = 'blue';
						this.depth = obj.depth - 1;
					}
					else
						this.depth = obj.depth + 1;
					// now compare obj diagonals to establish se / ne / etc
					this.rekt.update();
					obj.rekt.update();
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

namespace Obj {
	export var active = 0;
	export var num = 0;

	//export type Struct = Obj['struct']
}

export default Obj;

/*
					let obscured = false;
					// n ne e se s sw w nw
					if (this.bound.test(obj.bound)) {
						this.rekt.color = 'red';
					}
					else if (a.min[0] < b.max[0] && a.max[0] > b.min[0] && a.min[1] >= b.max[1]) // n
					{
						obscured = true;
						//this.rekt.color = 'blue';
					}
					else if (a.min[0] >= b.max[0] && a.min[1] >= b.max[1]) // ne
					{
						obscured = false;
						//this.rekt.color = 'purple';
					}
					else if (a.min[0] >= b.max[0] && a.max[1] > b.min[1]) // e
					{
						obscured = false;
						//this.rekt.color = 'cyan';
					}
					else if (a.min[0] >= b.max[0] && a.max[1] <= b.min[1]) // se
					{
						obscured = false;
						//this.rekt.color = 'salmon';
					}
					else if (a.max[0] > b.min[0] && a.max[1] <= b.min[1]) // s
					{
						obscured = false;
						//this.rekt.color = 'pink';
					}
					else if (a.max[0] <= b.min[0] && a.max[1] <= b.min[1]) // sw
					{
						obscured = false;
						//this.rekt.color = 'orange';
					}
					else if (a.max[0] <= b.min[0] && a.min[1] < b.max[1]) // w
					{
						obscured = true;
						//this.rekt.color = 'yellow';
					}
					else if (a.max[0] <= b.min[0] && a.min[1] >= b.min[1]) // nw
					{
						obscured = true;
						//this.rekt.color = 'gold';
					}
					else {
						//this.rekt.color = 'white';
					}
					if (obscured) {
						this.depth = obj.depth - 1;
					}
					else {
						this.depth = obj.depth + 1;
					}
					*/