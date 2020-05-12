class Obj {
	static ons = 0;
	order = 0
	on = false
	clickable = false

	readonly struct: {
		tile: zx
		//pos: zxc
	}
	constructor(struct: Obj['struct']) {
		Obj.num++;

		this.struct = struct;

	}
	update() {
	}
	comes() {
		this.on = true;
		Obj.ons++;
	}
	goes() {
		this.on = false;
		Obj.ons--;
	}
}

namespace Obj {
	export var num = 0;

	export type Struct = Obj['struct']
}

export default Obj;