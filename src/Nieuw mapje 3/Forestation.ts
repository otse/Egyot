import Rekt from "../Nieuw mapje/Rekt";
import Egyt from "../Egyt";
import { aabb3 } from "../Bound";
import Obj from "../Nieuw mapje/Obj";
import App from "../App";

namespace Forestation {

	export class TreePlop extends Obj {

		rekt: Rekt

		constructor(struct: Obj.Struct) {

			super(struct);

			const trees = [
				'egyt/oaktree1',
				'egyt/oaktree2',
			]
	
			let pick = trees[
				Egyt.floor_random(trees.length)];
	
			this.rekt = new Rekt({
				asset: pick,
				pos: this.struct.pos,
				dim: [102, 114],
			});
	
			this.rekt.initiate();
		}

		update() {
			let p = Egyt.map2.mouse;

			this.struct.pos = p;
			this.rekt.struct.pos = p;
			this.rekt.set_pos();
		}
	}

	export function init() {
		console.log('forestation');
		
		(window as any).Forestation = Forestation;
	}

	let plopping: TreePlop;

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