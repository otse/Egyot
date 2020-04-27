import Obj from "../Nieuw mapje/Obj";
import Rekt from "../Nieuw mapje/Rekt";

import { Maths, Fiftytwo } from "../Game";

class Worker extends Obj {

	private rekt: Rekt

	constructor(stats: Obj.Stats) {
		super(stats);
	}

	Make() {

		let pos = Maths.MultpClone(
			this.Pos(), 500);

		this.rekt = new Rekt({
			name: 'A Turf',
			pos: pos as Zxc,
			dim: [500, 250],
			asset: 'worker'
		});

		this.rekt.Make();
		this.rekt.mesh.renderOrder = -500;
	}
}

namespace Worker {
	export type Stats = Worker['stats']
}

export default Worker;