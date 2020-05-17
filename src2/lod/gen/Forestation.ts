import Rekt from "../../objrekt/Rekt";
import Egyt from "../../Egyt";
import { aabb2 } from "../../lib/aabb";
import Obj from "../../objrekt/Obj";
import App from "../../lib/App";
import points from "../../lib/Points";

namespace Forestation {

	let positions: zx[] = [[12,5],[20,7],[16,4],[8,11],[28,7],[40,8],[39,13],[17,32],[-21,11],[-18,16],[-19,-28],[-24,-29],[-27,-13],[-17,9],[-18,-1],[-6,34],[65,11],[0,87],[5,125],[-1,172],[-62,36],[-72,125],[-65,216],[4,182],[14,162],[2,177],[3,198],[6,155],[7,291],[-38,350],[-59,162],[-43,112],[-106,52],[154,20],[213,21],[141,-53],[23,-60],[62,-65],[260,-62],[241,-49],[251,-45],[220,-36],[209,-57],[223,-65],[209,-45],[181,-67],[190,-83],[221,-88],[264,-87],[274,-95],[263,-106],[255,-106],[237,-110],[248,-124],[239,-65],[221,-49],[189,-94],[263,-55],[271,-44],[278,-61],[246,-51],[240,-55],[226,-43],[228,-39],[208,-49],[248,-65],[227,-70],[230,-17],[210,12],[269,33],[275,156],[66,-210],[125,-49],[-106,46],[-98,44],[-97,55],[-108,-67],[92,-26],[73,-29],[110,-11],[3,-26],[-19,-52],[70,-36],[-35,-82],[-23,-90],[-19,-118],[-169,19],[20,160],[36,92],[-62,91],[-112,181],[-114,177],[-106,179],[-107,174],[-102,167],[-108,159],[-101,192],[30,-29],[25,-33],[31,-36],[36,-25],[41,-38],[6,-55],[25,-79],[23,-87],[125,-54],[176,-4],[-164,12],[-157,19],[-7,254],[-26,58]]
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

			this.rekt = new Rekt({
				obj: this,
				asset: Egyt.sample(treez),
				istile: true,
				xy: this.struct.tile,
				wh: [120, 132],
			});

			trees.push(this);
		}
		comes() {
			this.rekt.use();
		}
		goes() {
			this.rekt.unuse();
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

			let p = <zx>[...Egyt.map.mouse_tile];

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
			tile: Egyt.map.mouse_tile
		});

		tree.comes();

		//Egyt.world.add(plop);

		return tree;
	}
}

export default Forestation;