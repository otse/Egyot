import Lumber from "../Lumber";
import Obj from "../objrekt/Obj";
import Rekt from "../objrekt/Rekt";
import aabb2 from "../lib/aabb2";

interface Preset {
	asset: string
	size: vec2
	offset: vec2
	area: vec2
};

class Building extends Obj {
	asset: string
	constructor(private pst: Preset) {
		super();
		//this.rtt = false;
	}
	finish() {
		this.area = this.pst.area;
		this.rekt = new Rekt;
		this.rekt.obj = this;
		this.rekt.tile = this.tile;
		this.rekt.asset = this.pst.asset;
		this.rekt.size = this.pst.size;
		this.rekt.offset = this.pst.offset;
		super.finish();
	}
}

namespace Building {
	export var TwoTwo: Preset = {
		asset: 'twotwo',
		size: [48, 24],
		area: [2, 2],
		offset: [0, 0],
	}

	export var ThreeThree: Preset = {
		asset: 'threethree',
		size: [72, 36],
		area: [3, 3],
		offset: [0, 0],
	}

	export var SandHovel1: Preset = {
		asset: 'balmora/hovel1',
		size: [192, 149],
		area: [6, 8],
		offset: [0, 0],
	}

	export var SandHovel2: Preset = {
		asset: 'balmora/hovel2',
		size: [168, 143],
		area: [5, 7],
		offset: [0, 0],
	}

	export var SandAlleyGate: Preset = {
		asset: 'balmora/alleygate',
		size: [144, 96],
		area: [1, 4],
		offset: [0, 0],
	}

	export var Stairs2: Preset = {
		asset: 'balmora/stairs2',
		size: [120, 72],
		area: [4, 2],
		offset: [0, 0],
	}

	export var Stairs3: Preset = {
		asset: 'balmora/stairs3',
		size: [120, 72],
		area: [0, 0],
		offset: [0, 0],
	}

	export var Platform22: Preset = {
		asset: 'balmora/platform22',
		size: [48, 52],
		area: [0, 0],
		offset: [0, 0],
	}

	export var Platform23: Preset = {
		asset: 'balmora/platform23',
		size: [72, 65],
		area: [0, 0],
		offset: [0, 0],
	}
}

export default Building;