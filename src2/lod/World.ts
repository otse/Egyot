import Obj from "../objrekt/Obj";
import Egyt from "../Egyt";
import { Ply } from "../nested/char/Char";
import points from "../lib/Points";

class World {
	static rig() {
		return new World;
	}

	constructor() {
		this.init();

		console.log('world');
	}

	add(obj: Obj) {

		let c = Egyt.map.get_chunk_at_tile(obj.struct.tile);

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

		Egyt.ply = new Ply({
			tile: [0, 0]
		});

		Egyt.ply.comes();
	}
}

export { World }