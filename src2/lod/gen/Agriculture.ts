import { Lumber, World, Rekt, pts, aabb2 } from "./../../Re-exports";

import Obj from "../../objrekt/Obj";

namespace Agriculture {

	const tillering = [
		'egyt/farm/wheat_i',
		'egyt/farm/wheat_i',
		'egyt/farm/wheat_il',
		'egyt/farm/wheat_il',
		'egyt/farm/wheat_il',
		'egyt/farm/wheat_ili',
	]

	const ripening = [
		'egyt/farm/wheat_il',
		'egyt/farm/wheat_ili',
		'egyt/farm/wheat_ili',
		'egyt/farm/wheat_ilil',
		'egyt/farm/wheat_ilil',
	]

	export class Wheat extends Obj {
		rekt: Rekt
		flick = false

		constructor(public growth: number) {
			super();
			this.rate = 2.0;
		}
		finish() {
			this.rekt = new Rekt;
			this.rekt.obj = this;
			this.rekt.asset =
				this.growth == 1 ? Lumber.sample(tillering) :
				this.growth == 2 ? Lumber.sample(ripening) :
				this.growth == 3 ? 'egyt/farm/wheat_ilili' : '';
				this.rekt.tile = this.tile;
				this.rekt.wh = [22, 22];
		}
		update() {
			if (Lumber.PAINT_OBJ_TICK_RATE)
				this.rekt.paint_alternate();
		}
	}

	export function init() {
		console.log('agriculture');

		(window as any).Agriculture = Agriculture;
	}

	export function update() {

	}

	export function place_wheat(growth, tile: vec2) {

		if (Math.random() > .99)
			return;

		let crop = new Wheat(growth);
		crop.tile = tile;
		crop.finish();

		Lumber.world.add(crop);

		return crop;
	}

	export function area_wheat(growth: number, aabb: aabb2) {
		const every = (pos: vec2) => place_wheat(growth, pos);

		pts.area_every(aabb, every);
	}
}

export default Agriculture;