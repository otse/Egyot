import Rekt from "../Nieuw mapje/Rekt";
import Egyt from "../Egyt";
import { aabb3 } from "../Bound";
import Obj from "../Nieuw mapje/Obj";
import App from "../App";
import Zxcvs from "../Zxcvs";

namespace Forestation {

	let positions: zx[] = [[-18, -12]]
	let plopping: Tree | null;

	const trees = [
		'egyt/tree/oaktree3',
		'egyt/tree/oaktree4',
		//'egyt/birchtree1',
		//'egyt/birchtree2',
		//'egyt/birchtree3',
	]

	export class Tree extends Obj {

		rekt: Rekt

		constructor(struct: Obj.Struct) {

			super(struct);

			this.rekt = new Rekt({
				obj: this,
				asset: Egyt.sample(trees),
				istile: true,
				xy: this.struct.tile,
				wh: [120, 132],
			});

			this.rekt.initiate();
		}

		update() {
			if (plopping != this)
				return;

			let p = <zx>[...Egyt.map2.mouse_tile];

			this.struct.tile = p;
			this.rekt.struct.xy = p;
			this.rekt.mult();

			this.rekt.now_update_pos();

			if (App.left)
				plopping = null;
		}
	}

	export function init() {
		console.log('forestation');

		for (let pos of positions)
			new Tree({
				tile: pos
			});

		(window as any).Forestation = Forestation;
	}


	export function update() {
		if (!plopping && App.map['t'] == 1) {
			plopping = plop_tree();
		}
	}

	export function plop_tree() {

		let plop = new Tree({
			tile: Egyt.map2.mouse_tile
		});

		Egyt.world.add(plop);

		return plop;
	}
}

export default Forestation;