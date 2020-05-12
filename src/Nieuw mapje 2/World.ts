import Obj from "../Nieuw mapje/Obj";
import Egyt from "../Egyt";
import { Ply } from "./Guy";
import Zxcvs from "../Zxcvs";

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

		let c = Egyt.map2.get_chunk_tile(Zxcvs.divide(<zx>[...obj.struct.pos], 24));
		
		console.log('add obj to ch', Zxcvs.string(c.p));
	}

	update() {

		for (let obj of this.objs) {
			obj.update();
		}

	}

	init() {

		Egyt.ply = new Ply({
			pos: [0, 0, 0]
		});

		Egyt.ply.produce();
	}
}

export { World }