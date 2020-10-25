import Lumber from "../Lumber";
import Obj from "../objrekt/Obj";
import Rekt from "../objrekt/Rekt";

interface Preset
{
	asset: string;
	size: vec2;
	offset?: vec2;
};

class Building extends Obj {
	asset: string
	constructor(private pst: Preset) {
		super();
		//this.rtt = false;
	}
	finish() {
		this.rekt = new Rekt;
		this.rekt.obj = this;
		this.rekt.tile = this.tile;
		this.rekt.asset = this.pst.asset;
		this.rekt.size = this.pst.size;
		this.rekt.offset = this.pst.offset || [0, 0];
	}
}

namespace Building
{
	export var FourFour: Preset = {
		asset: 'fourfour',
		size: [48, 24]
	}

	export var SixSix: Preset = {
		asset: 'sixsix',
		size: [72, 36]
	}

	export var SandHovel1: Preset = {
		asset: 'balmora/hovel1',
		size: [192, 149],
		offset: [0, 0]
	}

	export var SandHovel2: Preset = {
		asset: 'balmora/hovel2',
		size: [168, 143]
	}

	export var SandAlleyGate: Preset = {
		asset: 'balmora/alleygate',
		size: [144, 96],
		offset: [0, 0]

	}

	export var Stairs2: Preset = {
		asset: 'balmora/stairs2',
		size: [120, 72],
		offset: [0, 0]
	}

	export var Stairs3: Preset = {
		asset: 'balmora/stairs3',
		size: [120, 72],
		offset: [0, 0]
	}

	export var Platform22: Preset = {
		asset: 'balmora/platform22',
		size: [48, 52],
		offset: [0, 0]

	}
}

export default Building;