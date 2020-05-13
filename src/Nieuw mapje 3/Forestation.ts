import Rekt from "../Nieuw mapje/Rekt";
import Egyt from "../Egyt";
import { aabb3 } from "../Bound";
import Obj from "../Nieuw mapje/Obj";
import App from "../App";
import Zxcvs from "../Zxcvs";

namespace Forestation {

	let positions: zx[] = [[12, 5], [20, 7], [16, 4], [8, 11], [28, 7], [40, 8], [39, 13], [17, 32], [-21, 11], [-18, 16], [-19, -28], [-24, -29], [-27, -13], [-17, 9], [-18, -1], [-6, 34]]
	
	let plopping: Tree | null;

	let trees: Tree[] = [];

	const treez = [
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

			trees.push(this);
		}
		comes() {
			console.log('tree comes');

			this.rekt = new Rekt({
				obj: this,
				asset: Egyt.sample(treez),
				istile: true,
				xy: this.struct.tile,
				wh: [120, 132],
			});

			this.rekt.initiate();
		}
		goes() {
			this.rekt.deinitiate();
		}
		update() {
		}
	}

	export function init() {
		console.log('forestation');

		for (let pos of positions) {
			let tree = new Tree({
				tile: pos
			});
			Egyt.world.add(tree);
			//tree.comes();
			console.log('add tree from positions');
		}

		(window as any).Forestation = Forestation;
	}


	export function update() {
		if (!plopping && App.map['t'] == 1) {
			plopping = plop_tree();
		}

		if (plopping) {
			let tree = plopping;

			let p = <zx>[...Egyt.map2.mouse_tile];

			tree.struct.tile = p;
			tree.rekt.struct.xy = p;
			tree.rekt.mult();

			tree.rekt.now_update_pos();

			if (App.left)
				plopping = null;
		}
	}

	export function get_positions() {
		let a: zx[] = [];
		for (let tree of trees) {
			a.push(tree.struct.tile);
		}
		return JSON.stringify(a);
	}

	export function plop_tree() {

		let tree = new Tree({
			tile: Egyt.map2.mouse_tile
		});

		tree.comes();

		//Egyt.world.add(plop);

		return tree;
	}
}

export default Forestation;