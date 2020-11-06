import LUMBER from "../Lumber";
import { Chunk } from "../lod/Chunks";
import Rekt from "./Rekt";
import pts from "../lib/pts";
import aabb2 from "../lib/aabb2";
import Renderer from "../Renderer";
import { ArrowHelper, Vector3 } from "three";

class Weight {
	order = 0
	min = 999
	max = -999
	childs: Obj[] = []
	parents: Obj[] = []
	constructor(private obj: Obj) {
	}
	array(child: boolean) {
		return child ? this.childs : this.parents;
	}
	add(obj: Obj, child: boolean) {
		let a = this.array(child);
		let i = a.indexOf(obj);
		if (i == -1)
			a.push(obj);
	}
	remove(obj: Obj, child: boolean) {
		let a = this.array(child);
		let i = a.indexOf(obj);
		if (i != -1)
			a.splice(i, 1);
	}
	clear() {
		for (let child of [true, false]) {
			for (let obj of this.array(child))
				obj.weight.remove(this.obj, !child);
			this.array(child).length = 0;
		}
	}
	get_min(child: boolean) {
		const array = this.array(child);
		if (array.length == 0)
			return this.order;
		let min = array[0].weight.order;
		for (let obj of array)
			min = Math.min(min, obj.weight.order);
		return min;
	}
	get_max(child: boolean) {
		const array = this.array(child);
		if (array.length == 0)
			return this.order;
		let max = array[0].weight.order;
		for (let obj of array)
			max = Math.max(max, obj.weight.order);
		return max;
	}
	weigh() {
		this.order = this.min = this.max = this.obj.depth;
		const childs = this.array(true);
		const parents = this.array(false);
		if (!childs.length && parents.length) {
			console.log('get min');
			let min = this.get_min(false);
			this.order = min - 10;
		}
		else if (childs.length && !parents.length) {
			console.log('get max');
			let max = this.get_max(true);
			this.order = max + 10;
		}
		else if (childs.length && parents.length) {
			// tween insert
			console.log('tween');
			this.order = this.min + this.max;
		}
		//	this.order = this.min;
		//else if (parents.length &&)
		//this.order = this.min;
		//if (this.array(true).length >= 1)
		this.obj.rekt?.update();
		//for (let child of childs)
		//	child.weight.weigh();
	}
}

class Obj {
	name = 'An Obj'
	depth = 0
	rate = 1
	rtt = true
	asset: Asset
	tile: vec2 = [0, 0]
	rekt: Rekt | null = null
	chunk: Chunk | null = null
	bound: aabb2
	screen: aabb2
	weight: Weight

	constructor() {
		Obj.num++;
		this.weight = new Weight(this);
	}
	comes() {
		Obj.active++;
		this.update_manual();
		this.rekt?.use();
	}
	goes() {
		Obj.active--;
		this.rekt?.unuse();
		this.weight.clear();
	}
	unset() {
		Obj.num--;
		this.goes();
		this.rekt?.unset();
	}
	finish() {
		if (!this.asset)
			console.warn('obj no asset');
		this.update_manual();
	}
	set_area() {
		if (!this.asset.area)
			return;
		let pt = pts.pt(pts.subtract(this.asset.area, [1, 1]));
		this.bound = new aabb2([-pt.x, 0], [0, pt.y]);
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
		this.depth = Rekt.ptdepth(this.tile);

		this.weight.clear();

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
			//console.log('p', pts.to_string(p));
			let c = LUMBER.wlrd.fg.at(p[0], p[1]);
			if (!c)
				continue;
			for (const t of c.objs.tuple.tuple) {
				const obj = t[0];
				if (obj == this || !this.rekt?.bound || !obj.rekt?.bound)
					continue;
				// image clip
				if (!this.rekt.bound.test(obj.rekt.bound)) {
					this.rekt.color = 'white';
					continue;
				}
				this.rekt.color = 'pink';
				const a = this.bound;
				const b = obj.bound;
				const test = this.bound.test(obj.bound);
				let front = true;
				this.rekt.color = ['white', 'red', 'cyan'][test];
				// nwnw test
				if (test) 0;
				else if ( // behind aka n w nw
					a.min[0] <= b.max[0] && a.max[0] >= b.min[0] && a.min[1] > b.max[1] ||
					a.max[0] < b.min[0] && a.max[1] >= b.min[1] && a.min[1] <= b.max[1] ||
					a.min[0] < b.min[0] && a.max[1] > b.max[1]) {
					this.rekt.color = 'purple';
					obj.weight.add(this, true);
					this.weight.add(obj, false);
				}
				else if ( // diagonal dont care
					a.max[0] < b.min[0] && a.max[1] < b.min[1] ||
					a.min[0] > b.max[0] && a.min[1] > b.max[1]
				) {
					this.rekt.color = 'green';
				}
				else {
					this.rekt.color = 'salmon';
					this.weight.add(obj, true);
					obj.weight.add(this, false);
				}
			}
		}
		this.weight.weigh();
		this.rekt.update();
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