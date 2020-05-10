import Rekt from "../Nieuw mapje/Rekt";
import Egyt from "../Egyt";
import { aabb3 } from "../Bound";
import Obj from "../Nieuw mapje/Obj";
import App from "../App";

namespace Tilization {

	let plopping: TilePlop | null;

	const colors = [
		//'egyt/tilered',
		//'egyt/tilepink',
		'egyt/tileorange',
	]

	export class TilePlop extends Obj {

		rekt: Rekt

		constructor(struct: Obj.Struct) {

			super(struct);

			this.rekt = new Rekt({
				asset: Egyt.sample(colors),
				pos: this.struct.pos,
				dim: [24, 12],
			});

			this.rekt.initiate();
		}

		update() {
			if (plopping != this)
				return;

			let p = Egyt.map2.mouse;

			this.rekt.struct.pos = this.struct.pos = p;

			this.rekt.set_pos();

			if (App.left)
				plopping = null;
		}
	}

	export function init() {
		console.log('tilization');

		(window as any).Tilization = Tilization;
	}

	export function update() {
		if (!plopping && App.map['y'] == 1) {
			plopping = plop_tile();
		}
	}

	export function plop_tile() {

		let plop = new TilePlop({
			pos: Egyt.map2.mouse
		});

		Egyt.world.add(plop);

		return plop;
	}
}

export default Tilization;