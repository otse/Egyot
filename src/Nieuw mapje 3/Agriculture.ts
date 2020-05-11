import Rekt from "../Nieuw mapje/Rekt";
import Egyt from "../Egyt";
import { aabb3 } from "../Bound";
import Obj from "../Nieuw mapje/Obj";
import App from "../App";
import Points from "../Zxcvs";

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
		growth: number

		constructor(growth: number, struct: Obj.Struct) {
			super(struct);

			this.growth = growth;
		}
	}

	export class Wheat extends Crop {
		rekt: Rekt

		constructor(growth: number, struct: Obj.Struct) {
			super(growth, struct);

			this.rekt = new Rekt({
				asset:
					this.growth == 1 ? Egyt.sample(tillering) :
					this.growth == 2 ? Egyt.sample(ripening) :
					this.growth == 3 ? 'egyt/farm/wheat_ilili' : '',
				pos: this.struct.pos,
				dim: [24, 24],
			});

			this.rekt.initiate();
		}
	}

	export function init() {
		console.log('agriculture');

		(window as any).Agriculture = Agriculture;
	}

	export function update() {
		
	}

	export function place_wheat(growth, pos: Zx) {
		
		const p = Points.multp([...pos, 0], 24);

		let wheat = new Wheat(growth, {
			pos: p
		});

		Egyt.world.add(wheat);

		return wheat;
	}

	export function plop_wheat_area(growth: number, aabb: aabb3) {
		const every = (pos: Zx) => place_wheat(growth, pos);

		Points.area_every(aabb, every);
	}
}

export default Agriculture;