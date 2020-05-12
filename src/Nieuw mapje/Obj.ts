class Obj {
	order: number = 0
	on: boolean = false
	clickable: boolean = false
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
	}
	goes() {
		this.on = false;
	}
}

namespace Obj {
	export var num = 0;

	export type Struct = Obj['struct']
}

export default Obj;