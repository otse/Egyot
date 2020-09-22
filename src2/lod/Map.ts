import Rekt from "../objrekt/Rekt";
import { Win } from "../lib/Board";
import Lumber from "../Lumber";
import App from "../lib/App";
import pts from "../lib/Pts";
import Forestation from "./gen/Forestation";
import Agriculture from "./gen/Agriculture";
import { aabb2 } from "../lib/AABB";
import Obj from "../objrekt/Obj";
import { Color, Group, WebGLRenderTarget, Int8Attribute, RGBFormat, NearestFilter, LinearFilter, RGBAFormat, PlaneBufferGeometry, MeshBasicMaterial, Mesh, OrthographicCamera } from "three";
import { tq } from "../lib/tq";
import Tilization from "./gen/Tilization";
import { tqlib } from "../lib/tqlib";
import { ChunkMaster, Chunk } from "./Chunks";
import { World } from "./World";


class Map {
	static state() {
		return new Map;
	}

	statmaster: ChunkMaster<Chunk>
	dynmaster: ChunkMaster<Chunk>

	mouse_tiled: vec2
	mark: Rekt

	constructor() {

		(window as any).Chunk = Chunk;

		this.statmaster = new ChunkMaster<Chunk>(Chunk, 20);
		this.dynmaster = new ChunkMaster<Chunk>(Chunk, 20);

		this.mouse_tiled = [0, 0];

		let rekt = this.mark = new Rekt;
		rekt.tile = [0, 0];
		rekt.wh = [22, 25];
		rekt.asset = 'egyt/iceblock';

		//this.mark.use();
		//this.mark.mesh.renderOrder = 999;
		//this.mark.dontOrder = true;
	}

	init() {
		let textures = 0;
		let loaded = 0;

		function callback() {
			if (++loaded >= textures) Lumber.resourced('POPULAR_ASSETS');
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
			'assets/egyt/tree/oaktree4.png']);
	}

	populate() {
		let granary = new Rekt;
		granary.tile = [6, -1];
		granary.wh = [216, 168];
		granary.asset = 'egyt/building/granary';

		let tobaccoshop = new Rekt;
		tobaccoshop.tile = [-13, 2];
		tobaccoshop.wh = [144, 144];
		tobaccoshop.asset = 'egyt/building/redstore';

		granary.use();
		tobaccoshop.use();

		//Agriculture.area_wheat(1, new aabb3([-9, -4, 0], [3, -22, 0]));
		Agriculture.area_wheat(2, new aabb2([5, -4], [5 + 50 - 2, -12]));
		Agriculture.area_wheat(2, new aabb2([5 + 50, -4], [5 + 50 - 2 + 50, -12]));
		Agriculture.area_wheat(3, new aabb2([5, -14], [5 + 50 - 2, -22]));
		Agriculture.area_wheat(3, new aabb2([5 + 50, -14], [5 + 50 - 2 + 50, -22]));
		//Agriculture.plop_wheat_area(2, new aabb3([5, -14, 0], [5+12+12+12, -22, 0]));
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

		// long road se
		Tilization.area_sample(50, stones, new aabb2([-13, 0], [400, -2]));

		// long road ne
		Tilization.area_sample(50, stones, new aabb2([-13, 0], [-11, 400]));

		// farms se
		Agriculture.area_wheat(1, new aabb2([-15, 21], [-40, 101]));
		Agriculture.area_wheat(1, new aabb2([-15, 103], [-40, 183]));
	}

	get_chunk_at_tile(zx: vec2 | vec3) {
		return this.statmaster.which(<vec2>zx);
	}

	mark_mouse() {

		let m = <zx>[...App.move];
		m[1] = -m[1];
		m = pts.divide(m, Lumber.game.scale);

		let p = [Lumber.game.view.min[0], Lumber.game.view.max[1]] as zx;
		p = pts.add(p, m);

		const un = World.unproject(p);

		this.mouse_tiled = un.tiled;

		this.mark.tile = un.mult;
		this.mark.now_update_pos();

	}

	update() {
		this.mark_mouse();

		this.statmaster.update();

		let worldPixelsLeftUpperCorner = [Lumber.game.view.min[0], Lumber.game.view.max[1]] as zx;
		let worldPixelsRightLowerCorner = [Lumber.game.view.max[0], Lumber.game.view.min[1]] as zx;

		const x = World.unproject(worldPixelsLeftUpperCorner).tiled;
		const y = World.unproject(worldPixelsRightLowerCorner).tiled;
	}
}

namespace Map {

}

export { Map }