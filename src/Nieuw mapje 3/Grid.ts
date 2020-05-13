import Rekt from "../Nieuw mapje/Rekt";
import Egyt from "../Egyt";
import { aabb3 } from "../Bound";
import Obj from "../Nieuw mapje/Obj";
import App from "../App";
import Zxcvs from "../Zxcvs";

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
				xy: Zxcvs.multp([...this.struct.tile, 0], 24),
				wh: [24, 12],
			});

			this.rekt.initiate();
		}

		update() {
			if (plopping != this)
				return;

			let p = <zx>[...Egyt.map2.mouse_tile];

			this.struct.tile = <zx>p;
			this.rekt.struct.xy = <zx>[...p, 0];

			this.rekt.now_update_pos();

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
			tile: <zx>[...Egyt.map2.mouse_tile]
		});

		Egyt.world.add(plop);

		return plop;
	}
}

export default Tilization;