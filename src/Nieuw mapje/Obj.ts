import { chunk } from "../Nieuw mapje 2/Map2";

class Obj {
	static active = 0;
	on = false
	order = 0
	chunk: chunk | null = null

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
		Obj.active++;
		this.on = true;
	}
	goes() {
		Obj.active--;
		this.on = false;
	}
}

namespace Obj {
	export var num = 0;

	export type Struct = Obj['struct']
}

export default Obj;