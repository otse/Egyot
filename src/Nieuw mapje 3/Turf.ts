import Obj from "../Nieuw mapje/Obj";
import Rekt from "../Nieuw mapje/Rekt";

import { Maths, Fiftytwo } from "../Game";

class Turf extends Obj {

	private rekt: Rekt

	constructor(stats: Obj.Stats) {
		super(stats);
	}

	Make() {

		let array = [
			'cracks500',
			'sand500'
		];
		let img = array[Math.floor(Math.random() * array.length)];

		let pos = Maths.MultpClone(
			this.Pos(), 500);

		this.rekt = new Rekt({
			name: 'A Turf',
			pos: pos as Zxc,
			dim: [500, 250],
			asset: img
		});

		///this.rekt.Make();
		///this.rekt.mesh.renderOrder = -500;
	}
}

namespace Turf {
	export type Stats = Turf['stats']
}

export default Turf;