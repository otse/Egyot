import { game, Areas } from "../Game";

import Building from "./Building";
import Fence from "./Fence";
import Land from "../Nieuw mapje 3/Land";
import Sidewalk from "../Nieuw mapje 3/Sidewalk";
import Rebar from "./Nieuw mapje/Rebar";

class Estate {

	readonly zone: Land | null

	readonly stats: {
		name: string
		pos: Zx,
		dim: Zx,
		area?: Zxcv
	}

	constructor(stats: Estate.Stats, zone: Land | null) {
		this.stats = stats;

		this.zone = zone;
	}

	Make() {
		this.Fences();

		this.Rebars();

		this.Building();
	}

	Fences() {
		// Make fences
		let area = [...this.stats.pos, ...this.stats.dim] as Zxcv;

		let func = (p: Zx) => {

			if (Areas.NotBorder(area, p))
				return;

			let fence = new Fence({
				pos: [...p, 0] as Zxc
			}, area);
			fence.Make();

			game.objs.push(fence);
		}

		Areas.Loop(area, func);
	}

	Rebars() {

		let area = [...this.stats.pos, ...this.stats.dim] as Zxcv;
		area[0] += 2;
		area[1] += 2;
		area[2] -= 4;
		area[3] -= 4;

		let func2 = (p: Zx) => {

			let rebar = new Rebar({
				pos: [...p, 0] as Zxc
			}, area);
			rebar.Make();

			game.objs.push(rebar);
		}

		Areas.Loop(area, func2);
	}

	Building() {
		// Place building
		if (this.stats.dim[1] < 9 || this.stats.dim[0] < 9)
			return;

		let building = new Building({
			pos: [this.stats.pos[0] + 4, this.stats.pos[1] + -0, 0]
		}, this);

		building.Make();
	}
}

namespace Estate {
	export type Stats = Estate['stats']
}

export default Estate;