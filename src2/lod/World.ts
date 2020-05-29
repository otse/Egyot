import Obj from "../objrekt/Obj";
import Egyt from "../Egyt";
import { Ply } from "../nested/char/Char";
import vecs from "../lib/Vecs";

class World {
	static rig() {
		return new World;
	}

	constructor() {
		this.init();

		console.log('world');
	}

	add(obj: Obj) {

		let c = Egyt.map.get_chunk_at_tile(obj.tile);

		let succeed = c.objs.add(obj);

		if (succeed) {
			obj.chunk = c;

			c.changed = true;
		}

		if (c.on)
			obj.comes();
	}

	remove(obj: Obj) {

	}

	update() {

	}

	init() {

		Egyt.ply = new Ply;
		Egyt.ply.tile = [0, 0]

		Egyt.ply.comes();
	}
}

namespace World {
	type Un = { untiled: vec2, tiled: vec2, mult: vec2 };

	export function unproject(query: zx): Un {
		let p = query;

		let un = <vec2>vecs.clone(p);
		vecs.unproject(un);

		let p2 = <vec2>vecs.clone(un);
		vecs.divide(p2, 24);
		vecs.floor(p2);
		p2[0] += 1; // necessary

		let p3 = <vec2>vecs.clone(p2);
		vecs.mult(p3, 24);

		return { untiled: un, tiled: p2, mult: p3 };
	}
}

export { World }