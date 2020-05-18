import { chunk } from "../lod/Chunks";

class Obj {
	order = 0
	index = 0
	tickrate = 2
	using = false
	chunk: chunk | null = null

	readonly struct: { // why readonly
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
		Obj.active++;
		this.using = true;
	}
	goes() {
		Obj.active--;
		this.using = false;
	}
}

namespace Obj {
	export var active = 0;
	export var num = 0;

	export type Struct = Obj['struct']
}

export default Obj;