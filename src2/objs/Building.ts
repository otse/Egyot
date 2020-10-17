import Lumber from "../Lumber";
import Obj from "../objrekt/Obj";
import Rekt from "../objrekt/Rekt";

interface Preset
{
	asset: string;
	size: vec2;
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
	}
}

namespace Building
{
	export var SandHovel1: Preset = {
		asset: 'balmora/sandhovel1',
		size: [181, 146]
	}
}

export default Building;