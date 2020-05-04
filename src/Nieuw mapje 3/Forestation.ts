import Rekt from "../Nieuw mapje/Rekt";
import Egyt from "../Egyt";
import { aabb3 } from "../Bound";
import Obj from "../Nieuw mapje/Obj";
import App from "../App";

namespace Forestation {

	let plopping: TreePlop | null;

	const trees = [
		'egyt/oaktree1',
		'egyt/oaktree2',
	]

	export class TreePlop extends Obj {

		rekt: Rekt

		constructor(struct: Obj.Struct) {

			super(struct);

			this.rekt = new Rekt({
				asset: Egyt.sample(trees),
				pos: this.struct.pos,
				dim: [120, 120],
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
		console.log('forestation');

		(window as any).Forestation = Forestation;
	}


	export function update() {
		if (!plopping && App.map['t'] == 1) {
			plopping = plop_tree();
		}
	}

	export function plop_tree() {

		let plop = new TreePlop({
			pos: Egyt.map2.mouse
		});

		Egyt.world.add(plop);

		return plop;
	}
}

export default Forestation;