import { game, Areas, Maths } from "../Game";

import Rekt from "../Nieuw mapje/Rekt";
import Sidewalk from "./Sidewalk";

class Land {

	readonly stats: {
		name?: string
		pos: Zx
		dim: Zx
	}

	constructor(stats: Land.Stats) {
		this.stats = stats;
	}

	Make() {
		let dim = Maths.MultpClone(
			this.stats.dim, 10);

		/*let rekt = new Rekt({
			pos: [...this.stats.pos, 0] as Zxc,
			dim: dim as Zx,
			color: 0xcc0000
		});*/

		//rekt.Make();

		this.Sidewalks();
	}

	Sidewalks() {
		let pos = this.stats.pos;
		let dim = this.stats.dim;

		// Make sidewalks
		let area: Zxcv = [pos[0] - 1, pos[1] - 1, dim[0] + 2, dim[1] + 2];

		let every = (p: Zx) => {
			if (Areas.NotBorder(area, p))
				return;

			let sidewalk = new Sidewalk({
				pos: [...p, 0] as Zxc
			});
			sidewalk.Make();

			game.objs.push(sidewalk);
		}

		Areas.Loop(area, every);
	}
}

namespace Land {
	export type Stats = Land['stats']
}

export default Land;