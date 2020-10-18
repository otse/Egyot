import { Chunk } from "../lod/Chunks";
import Lumber from "../Lumber";
import Rekt from "./Rekt";

class Obj {
	order = 0
	rate = 1
	rtt = true
	rekt: Rekt | null = null
	chunk: Chunk | null = null
	tile: vec2 = [0, 0]

	constructor() {
		Obj.num++;
	}
	update() {
		if (Lumber.PAINT_OBJ_TICK_RATE)
			this.rekt?.paint_alternate();
	}
	comes() {
		Obj.active++;
		this.rekt?.use();
	}
	goes() {
		Obj.active--;
		this.rekt?.unuse();
	}
	unset() {
		Obj.num--;
		this.rekt?.unset();
	}
	finish() {}
}

namespace Obj {
	export var active = 0;
	export var num = 0;

	//export type Struct = Obj['struct']
}

export default Obj;