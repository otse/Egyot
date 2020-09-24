import Obj from "../objrekt/Obj";
import Lumber from "../Lumber";
import { Ply } from "../nested/char/Char";
import pts from "../lib/Pts";
import { Chunk, ChunkMaster } from "./Chunks";
import { tqlib } from "../lib/tqlib";
import App from "../lib/App";
import Agriculture from "./gen/Agriculture";
import { aabb2 } from "../lib/AABB";
import Tilization from "./gen/Tilization";
import Rekt from "../objrekt/Rekt";

class World {
	static rig() {
		return new World;
	}

	chunkMaster: ChunkMaster<Chunk>

	mouse_tiled: vec2 = [0, 0]

	constructor() {
		this.init();

		console.log('world');
	}
	add(obj: Obj) {
		let c = this.getChunkAt(obj.tile);

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
		this.chunkMaster.update();
	}
	getChunkAt(zx: vec2 | vec3) {
		return this.chunkMaster.which(<vec2>zx);
	}

	mark_mouse() {
		let m = <zx>[...App.move];
		m[1] = -m[1];
		m = pts.divide(m, Lumber.game.scale);

		let p = [Lumber.game.view.min[0], Lumber.game.view.max[1]] as zx;
		p = pts.add(p, m);

		const unprojected = World.unproject(p);

		this.mouse_tiled = unprojected.tiled;;
	}
	init() {
		this.chunkMaster = new ChunkMaster<Chunk>(Chunk, 20);

		Lumber.ply = new Ply;
		Lumber.ply.tile = [0, 0]

		Lumber.ply.comes();

		this.preloads();
		//this.populate();
	}
	preloads() {
		let textures = 0;
		let loaded = 0;

		function callback() {
			if (++loaded >= textures)
				Lumber.resourced('POPULAR_ASSETS');
		}

		function preload_textures(strs: string[]) {
			textures = strs.length;
			for (let str of strs)
				tqlib.loadtexture(str, undefined, callback);
		}
		preload_textures([
			'assets/egyt/tileorange.png',
			'assets/egyt/farm/wheat_i.png',
			'assets/egyt/farm/wheat_il.png',
			'assets/egyt/farm/wheat_ili.png',
			'assets/egyt/farm/wheat_ilil.png',
			'assets/egyt/farm/wheat_ilili.png',
			'assets/egyt/tree/oaktree3.png',
			'assets/egyt/tree/oaktree4.png',
			'assets/egyt/ground/stone1.png',
			'assets/egyt/ground/stone2.png',
			'assets/egyt/ground/gravel1.png',
			'assets/egyt/ground/gravel2.png',
		]);
	}
	populate() {
		let granary = new Rekt;
		granary.tile = [6, -1];
		granary.wh = [216, 168];
		granary.asset = 'egyt/building/granary';

		let tobaccoshop = new Rekt;
		tobaccoshop.tile = [-14, 2];
		tobaccoshop.wh = [144, 144];
		tobaccoshop.asset = 'egyt/building/redstore';

		granary.use();
		tobaccoshop.use();

		//Agriculture.area_wheat(1, new aabb3([-9, -4, 0], [3, -22, 0]));
		Agriculture.area_wheat(2, new aabb2([5, -4], [5 + 50 - 2, -12]));
		Agriculture.area_wheat(2, new aabb2([5 + 50, -4], [5 + 50 - 2 + 50, -12]));
		Agriculture.area_wheat(3, new aabb2([5, -14], [5 + 50 - 2, -22]));
		Agriculture.area_wheat(3, new aabb2([5 + 50, -14], [5 + 50 - 2 + 50, -22]));
		Agriculture.area_wheat(3, new aabb2([-42, 21], [-80, 183]));
		//Agriculture.plop_wheat_area(2, new aabb3([-9, -12, 0], [2, -14, 0]));
		//Agriculture.plop_wheat_area(3, new aabb3([-4, -4, 0], [20, -39, 0]));
		//Agriculture.plop_wheat_area(2, new aabb3([-25, 14, 0], [5, 50, 0]));
		//Agriculture.plop_wheat_area(3, new aabb3([-9, -52, 0], [2, -300, 0]));
		//Agriculture.plop_wheat_area(3, new aabb3([-20, -302, 0], [11, -600, 0]));

		const stones = [
			'egyt/ground/stone1',
			'egyt/ground/stone2',
		];
		const gravels = [
			'egyt/ground/gravel1',
			'egyt/ground/gravel2',
		];
		Tilization.area_sample(30, gravels, new aabb2([-1, 0], [2, -22]));

		// lots gravels
		//Tilization.area_sample(66, gravels, new aabb2([-20, -10], [50, 80]));

		// long road se
		Tilization.area_sample(50, stones, new aabb2([-13, 0], [400, -3]));

		// long road ne
		Tilization.area_sample(50, stones, new aabb2([-14, 0], [-12, 400]));

		// farms se
		Agriculture.area_wheat(1, new aabb2([-15, 21], [-40, 101]));
		Agriculture.area_wheat(1, new aabb2([-15, 103], [-40, 183]));
	}
}

namespace World {
	type Un = { untiled: vec2, tiled: vec2, mult: vec2 };

	export function unproject(query: zx): Un {
		let p = query;

		let un = pts.unproject(p);

		let p2;
		p2 = pts.divide(un, 24);
		p2 = pts.floor(p2);
		p2[0] += 1; // necessary

		let p3 = pts.mult(p2, 24);

		return { untiled: un, tiled: p2, mult: p3 };
	}
}

export { World }