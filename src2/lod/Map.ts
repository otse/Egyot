import Rekt from "../objrekt/Rekt";
import { Win } from "../lib/Board";
import Egyt from "../Egyt";
import App from "../lib/App";
import vecs from "../lib/Vecs";
import Forestation from "./gen/Forestation";
import Agriculture from "./gen/Agriculture";
import { aabb2 } from "../lib/AABB";
import Obj from "../objrekt/Obj";
import { Color, Group, WebGLRenderTarget, Int8Attribute, RGBFormat, NearestFilter, LinearFilter, RGBAFormat, PlaneBufferGeometry, MeshBasicMaterial, Mesh, OrthographicCamera } from "three";
import { tq } from "../lib/tq";
import Tilization from "./gen/Tilization";
import { tqlib } from "../lib/tqlib";
import { ChunkMaster, Chunk } from "./Chunks";


class Map {
	static state() {
		return new Map;
	}

	statmaster: ChunkMaster<Chunk>
	dynmaster: ChunkMaster<Chunk>

	mouse_tile: vec2
	mark: Rekt

	constructor() {

		(window as any).Chunk = Chunk;

		this.statmaster = new ChunkMaster<Chunk>(Chunk, 20);
		this.dynmaster = new ChunkMaster<Chunk>(Chunk, 20);

		this.mouse_tile = [0, 0];

		this.mark = new Rekt({
			xy: [0, 0],
			wh: [22, 25],
			asset: 'egyt/iceblock'
		});

		//this.mark.use();
		//this.mark.mesh.renderOrder = 999;
		//this.mark.dontOrder = true;
	}

	init() {
		tqlib.loadtexture('assets/egyt/tileorange.png', undefined, () => Egyt.resourced('TILE_ORANGE'))
		tqlib.loadtexture('assets/egyt/farm/wheat_i.png', undefined, () => Egyt.resourced('WHEAT_I'))
		tqlib.loadtexture('assets/egyt/farm/wheat_il.png', undefined, () => Egyt.resourced('WHEAT_IL'))
		tqlib.loadtexture('assets/egyt/farm/wheat_ili.png', undefined, () => Egyt.resourced('WHEAT_ILI'))
		tqlib.loadtexture('assets/egyt/farm/wheat_ilil.png', undefined, () => Egyt.resourced('WHEAT_ILIL'))
		tqlib.loadtexture('assets/egyt/farm/wheat_ilili.png', undefined, () => Egyt.resourced('WHEAT_ILILI'))

		tqlib.loadtexture('assets/egyt/tree/oaktree3.png', undefined, () => Egyt.resourced('TREE_1'))
		tqlib.loadtexture('assets/egyt/tree/oaktree4.png', undefined, () => Egyt.resourced('TREE_2'))
	}

	populate() {
		let granary = new Rekt({
			tiled: true,
			xy: [6, -1],
			wh: [216, 168],
			asset: 'egyt/building/granary'
		});

		let tobaccoshop = new Rekt({
			tiled: true,
			xy: [-13, 2],
			wh: [144, 144],
			asset: 'egyt/building/redstore'
		});

		granary.use();
		//tobaccoshop.initiate();

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
		//Tilization.area_sample(30, stones, new aabb3([-2, 0, 0], [6, -2, 0]));

		const gravels = [
			'egyt/ground/gravel1',
			'egyt/ground/gravel2',
		];
		// long road se
		Tilization.area_sample(50, gravels, new aabb2([-13, 0], [400, -2]));

		// long road ne
		Tilization.area_sample(50, gravels, new aabb2([-13, 0], [-11, 400]));

		// farms se
		Agriculture.area_wheat(1, new aabb2([-15, 21], [-40, 101]));
		Agriculture.area_wheat(1, new aabb2([-15, 103], [-40, 183]));
	}

	get_chunk_at_tile(t: zx | zxc) {
		return this.statmaster.which(<zx>t);
	}

	ask_world_pixel(query: zx): { tile: zx, mult: zx } {
		let p = query;

		let p1 = <vec2>vecs.clone(p);
		p1[0] = p[0] - p[1] * 2;
		p1[1] = p[1] * 2 + p[0];

		let p2 = <vec2>vecs.clone(p1);
		vecs.divide(p2, 24);
		vecs.floor(p2);
		p2[0] += 1; // necessary

		let p3 = <vec2>vecs.clone(p2);
		vecs.multp(p3, 24);

		return { tile: p2, mult: p3 };
	}

	mark_mouse() {

		let m = <zx>[...App.move];
		m[1] = -m[1];
		vecs.divide(m, Egyt.game.scale);

		let p = [Egyt.game.view.min[0], Egyt.game.view.max[1]] as zx;
		vecs.add(p, m);

		const mouse = this.ask_world_pixel(p);

		this.mouse_tile = mouse.tile;

		this.mark.struct.xy = mouse.mult;
		this.mark.now_update_pos();

	}

	update() {
		this.mark_mouse();

		this.statmaster.update();

		let worldPixelsLeftUpperCorner = [Egyt.game.view.min[0], Egyt.game.view.max[1]] as zx;
		let worldPixelsRightLowerCorner = [Egyt.game.view.max[0], Egyt.game.view.min[1]] as zx;

		const x = this.ask_world_pixel(worldPixelsLeftUpperCorner).tile;
		const y = this.ask_world_pixel(worldPixelsRightLowerCorner).tile;

	}
}

export { Map }