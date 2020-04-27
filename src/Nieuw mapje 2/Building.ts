import Obj from "../Nieuw mapje/Obj";
import Rekt from "../Nieuw mapje/Rekt";

import Estate from "./Estate";
import { Fiftytwo, Maths } from "../Game";

class Building extends Obj {
	readonly estate: Estate

	constructor(stats: Obj.Stats, estate: Estate) {
		super(stats);

		this.estate = estate;
	}

	Make() {
		let zxc = Maths.MultpClone(
			this.Pos(), Fiftytwo);

		let rekt = new Rekt({
			name: 'Building',
			pos: zxc as Zxc,
			dim: [260, 260],
			asset: 'egypt/abode',
			opacity: 1.0
		});

		rekt.Make();
	}

	Click(): boolean {
		return true;
	}
}

namespace Building {

}

export default Building;