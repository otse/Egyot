import Lumber from "../Lumber";
import Obj from "../objrekt/Obj";
import Rekt from "../objrekt/Rekt";

import pts from "../lib/pts";
import aabb2 from "../lib/aabb2";
import App from "../App";
import Building from "../objs/Building";
import World from "./World";
import Renderer from "../Renderer";

type Factorio = 'twotwo' | 'threethree' | 'sandhovel1' | 'sandhovel2' | 'sandalleygate' | 'stairs2' | 'stairs3' | 'platform22' | 'platform23' | 'tree';

export namespace Ploppables {

	export var types: Factorio[] = [
		'twotwo',
		'threethree',
		'sandhovel1',
		'sandhovel2',
		'sandalleygate',
		'stairs2',
		'stairs3',
		'platform22',
		'platform23',
		'tree'
	]
	export var index = 0;
	export var ghost: Obj | null = null;

	export function update() {
		let remake = false;
		let obj: Obj | null = null;

		if (ghost) {
			if (App.wheel < 0 && index + 1 < types.length) {
				index++;
				remake = true;
			}
			else if (App.wheel > 0 && index - 1 >= 0) {
				index--;
				remake = true;
			}
		}

		const shortcuts: { [key: string]: Factorio } = {
			'y': 'twotwo',
			'b': 'sandhovel1',
			't': 'tree'
		}

		for (const s in shortcuts) {
			if (App.keys[s]) {
				index = types.indexOf(shortcuts[s]);
				remake = true;
				break;
			}
		}

		if (remake) {
			Lumber.wlrd.wheelable = false;
			obj = factory(types[index]);
			obj.finish();
			obj.comes();
			ghost?.unset();
			ghost = obj;
		}

		if (ghost) {
			ghost.tile = Lumber.wlrd.mtil;
			if (ghost.rekt)
				ghost.rekt.tile = ghost.tile;
			ghost.manualupdate();
			ghost.update();
		}

		if (ghost && App.buttons[0]) {
			Lumber.wlrd.wheelable = true;
			console.log('plop');
			ghost.goes();
			Lumber.wlrd.add(ghost);
			ghost = null;
		}

		if (ghost && App.keys['escape'] == 1) {
			Lumber.wlrd.wheelable = true;
			console.log('unplop');
			ghost.unset();
			ghost = null;
		}

		if (App.keys['x'] == 1) {
			let ct = Lumber.wlrd.fg.big(Lumber.wlrd.mtil);
			
			let c = Lumber.wlrd.fg.at(ct[0], ct[1]);
			if (c) {
				let obj = c.objs.get(Lumber.wlrd.mtil);
				if (obj) {
					Lumber.wlrd.remove(obj);
					obj.unset();
				}
				else
					console.log('no obj there at', pts.to_string(Lumber.wlrd.mtil));
			}
		}
	}

	export function factory(type: Factorio): Obj {
		if (type == 'twotwo')
			return new Building(Building.TwoTwo);
		else if (type == 'threethree')
			return new Building(Building.ThreeThree);
		else if (type == 'sandhovel1')
			return new Building(Building.SandHovel1);
		else if (type == 'sandhovel2')
			return new Building(Building.SandHovel2);
		else if (type == 'sandalleygate')
			return new Building(Building.SandAlleyGate);
		else if (type == 'stairs2')
			return new Building(Building.Stairs2);
		else if (type == 'stairs3')
			return new Building(Building.Stairs3);
		else if (type == 'platform22')
			return new Building(Building.Platform22);
		else if (type == 'platform23')
			return new Building(Building.Platform23);
		else if (type == 'tree')
			return new Tree();
		else
			return new Obj;
	}

	export function plant_trees() {
		return;
		console.log(`add ${tree_positions.length} trees from save`);
		for (let pos of tree_positions) {
			let tree = new Tree;
			tree.tile = pos;
			tree.finish();
			Lumber.wlrd.add(tree);
		}
	}

	export function place_tile(chance: number, asset: string, pos: vec2) {
		if (Math.random() > chance / 100)
			return;
		let tile = new Tile(asset);
		tile.tile = pos;
		tile.asset = asset;
		tile.finish();
		Lumber.wlrd.add(tile);
		return tile;
	}

	export function area_tile(chance: number, asset: string, aabb: aabb2) {
		const every = (pos: vec2) => place_tile(chance, asset, pos);

		pts.area_every(aabb, every);
	}

	export function area_tile_sampled(chance: number, assets: string[], aabb: aabb2) {
		const every = (pos: vec2) => place_tile(chance, Lumber.sample(assets), pos);

		pts.area_every(aabb, every);
	}

	export function place_wheat(growth, tile: vec2) {
		if (Math.random() > 99 / 100)
			return;
		let crop = new Wheat(growth);
		crop.tile = tile;
		crop.finish();
		Lumber.wlrd.add(crop);
		return crop;
	}

	export function area_wheat(growth: number, aabb: aabb2) {
		const every = (pos: vec2) => place_wheat(growth, pos);

		pts.area_every(aabb, every);
	}

	export function place_old_wall(growth, tile: vec2) {
		if (Math.random() > 50 / 100)
			return;
		let crop = new Wheat(growth);
		crop.tile = tile;
		crop.finish();
		Lumber.wlrd.add(crop);
		return crop;
	}

	export function area_fort(something: number, aabb: aabb2) {
		const every = (pos: vec2) => place_wheat(1, pos);

		pts.area_every(aabb, every);
	}
}

let tree_positions: vec2[] = [[12, 5], [20, 7], [16, 4], [8, 11], [28, 7], [40, 8], [39, 13], [17, 32], [-21, 11], [-18, 16], [-19, -28], [-24, -29], [-27, -13], [-17, 9], [-18, -1], [-6, 34], [65, 11], [0, 87], [5, 125], [-1, 172], [-62, 36], [-72, 125], [-65, 216], [4, 182], [14, 162], [2, 177], [3, 198], [6, 155], [7, 291], [-38, 350], [-59, 162], [-43, 112], [-106, 52], [154, 20], [213, 21], [141, -53], [23, -60], [62, -65], [260, -62], [241, -49], [251, -45], [220, -36], [209, -57], [223, -65], [209, -45], [181, -67], [190, -83], [221, -88], [264, -87], [274, -95], [263, -106], [255, -106], [237, -110], [248, -124], [239, -65], [221, -49], [189, -94], [263, -55], [271, -44], [278, -61], [246, -51], [240, -55], [226, -43], [228, -39], [208, -49], [248, -65], [227, -70], [230, -17], [210, 12], [269, 33], [275, 156], [66, -210], [125, -49], [-106, 46], [-98, 44], [-97, 55], [-108, -67], [92, -26], [73, -29], [110, -11], [3, -26], [-19, -52], [70, -36], [-35, -82], [-23, -90], [-19, -118], [-169, 19], [20, 160], [36, 92], [-62, 91], [-112, 181], [-114, 177], [-106, 179], [-107, 174], [-102, 167], [-108, 159], [-101, 192], [30, -29], [25, -33], [31, -36], [36, -25], [41, -38], [6, -55], [25, -79], [23, -87], [125, -54], [176, -4], [-164, 12], [-157, 19], [-7, 254], [-26, 58]]

const trees = [
	'egyt/tree/oaktree3',
	'egyt/tree/oaktree4',
	//'egyt/birchtree1',
	//'egyt/birchtree2',
	//'egyt/birchtree3',
]

const tillering = [
	'egyt/farm/wheat_i',
	'egyt/farm/wheat_i',
	'egyt/farm/wheat_il',
	'egyt/farm/wheat_il',
	'egyt/farm/wheat_il',
	'egyt/farm/wheat_ili',
]

const ripening = [
	'egyt/farm/wheat_il',
	'egyt/farm/wheat_ili',
	'egyt/farm/wheat_ili',
	'egyt/farm/wheat_ilil',
	'egyt/farm/wheat_ilil',
]

export class Tree extends Obj {

	static trees: Tree[] = []

	constructor() {
		super();
		this.rate = 10;
		Tree.trees.push(this);
	}
	finish() {
		this.rekt = new Rekt;
		this.rekt.obj = this;
		this.rekt.asset = Lumber.sample(trees);
		this.rekt.tile = this.tile;
		this.rekt.offset = [1, -1];
		this.rekt.size = [120, 132];
	}
}

export class Tile extends Obj {
	asset: string = 'egyt/ground/stone1'
	constructor(asset) {
		super();
		//this.rtt = false;
	}
	finish() {
		this.rekt = new Rekt;
		this.rekt.obj = this;
		this.rekt.asset = this.asset;
		this.rekt.tile = this.tile;
		this.rekt.size = [24, 12];
	}
}

export class Wheat extends Obj {
	flick = false

	constructor(public growth: number) {
		super();
		this.rate = 2.0;
	}
	finish() {
		this.rekt = new Rekt;
		this.rekt.obj = this;
		this.rekt.asset =
		this.growth == 1 ? Lumber.sample(tillering) :
		this.growth == 2 ? Lumber.sample(ripening) :
		this.growth == 3 ? 'egyt/farm/wheat_ilili' : '';
		this.rekt.tile = this.tile;
		this.rekt.size = [22, 22];
	}
}

export class Wall extends Obj {
	asset: string = 'egyt/ground/stone1'
	constructor(asset) {
		super();
		//this.rtt = false;
	}
	finish() {
		this.rekt = new Rekt;
		this.rekt.obj = this;
		this.rekt.asset = this.asset;
		this.rekt.tile = this.tile;
		this.rekt.size = [24, 12];
	}
}