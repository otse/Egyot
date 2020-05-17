import Obj from "../objrekt/Obj";
import Egyt from "../Egyt";
import { Ply } from "../nested/char/Char";
import points from "../lib/Points";

class World {
	static rig() {
		return new World;
	}

	objs: Obj[]

	constructor() {
		this.objs = [];

		this.init();

		console.log('world');
	}

	add(obj: Obj) {
		this.objs.push(obj);
		this.objs.sort((a, b) => a.order - b.order);

		let c = Egyt.map.get_chunk_tile(obj.struct.tile);
		
		c.objs.add(obj);
		obj.chunk = c;

		if (c.on)
			obj.comes();
	}

	update() {
		for (let obj of this.objs) {
			obj.update();
		}
	}

	init() {

		Egyt.ply = new Ply({
			tile: [0, 0]
		});

		Egyt.ply.comes();
	}
}

export { World }