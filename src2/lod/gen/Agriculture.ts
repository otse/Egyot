import Rekt from "../../objrekt/Rekt";
import Egyt from "../../Egyt";
import { aabb3 } from "../../lib/aabb";
import Obj from "../../objrekt/Obj";
import App from "../../lib/App";
import Points from "../../lib/Points";
import points from "../../lib/Points";

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

	export class Crop extends Obj {
		constructor(protected growth: number, struct: Obj.Struct) {
			super(struct);
		}
	}

	export class Wheat extends Crop {
		rekt: Rekt

		constructor(growth: number, struct: Obj.Struct) {
			super(growth, struct);

			this.rekt = new Rekt({
				obj: this,
				asset:
					this.growth == 1 ? Egyt.sample(tillering) :
					this.growth == 2 ? Egyt.sample(ripening) :
					this.growth == 3 ? 'egyt/farm/wheat_ilili' : '',
				istile: true,
				xy: this.struct.tile,
				wh: [22, 22],
			});
		}
		comes() {
			super.comes();
			this.rekt.use();
		}
		goes() {
			super.goes();
			this.rekt.unuse();
		}
	}

	export function init() {
		console.log('agriculture');

		(window as any).Agriculture = Agriculture;
	}

	export function update() {

	}

	export function place_wheat(growth, tile: zx) {

		if (Math.random() > .99)
			return;

		let wheat = new Wheat(growth, {
			tile: tile
		});

		Egyt.world.add(wheat);

		return wheat;
	}

	export function area_wheat(growth: number, aabb: aabb3) {
		const every = (pos: zx) => place_wheat(growth, pos);

		Points.area_every(aabb, every);
	}
}

export default Agriculture;