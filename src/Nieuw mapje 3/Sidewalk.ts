import { Maths, Fiftytwo } from "../Game";

import Rekt from "../Nieuw mapje/Rekt";
import Obj from "../Nieuw mapje/Obj";

class Sidewalk extends Obj {

	private rekt: Rekt

	constructor(stats: Obj.Stats) {
		super(stats);
	}

	Make() {

        let pos = Maths.MultpClone(
			this.Pos(), Fiftytwo);

		this.rekt = new Rekt({
			name: 'A Sidewalk',
			pos: pos as Zxc,
            dim: [52, 26],
            asset: 'sidewalk'
		});

		this.rekt.Make();
		//this.rekt.mesh.renderOrder = -500;
	}
}

namespace Sidewalk {
	export type Stats = Sidewalk['stats']
}

export default Sidewalk;