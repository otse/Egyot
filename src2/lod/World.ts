import { Lumber, Renderer, Rekt, Obj, aabb2, pts } from "./../Re-exports";

import App from "../App";

import { Chunk, ChunkMaster } from "./Chunks";
import Agriculture from "./gen/Agriculture";
import Tilization from "./gen/Tilization";
import { Ply } from "../nested/char/Char";

const SHOW_FRUSTUM = false;


class World {
	static rig() {
		return new World;
	}

	pos: vec2 = [0, 0]
	scale: number = 1
	dpi: number = 1

	focal: vec3
	view: aabb2
	frustum: Rekt

	chunkMaster: ChunkMaster<Chunk>

	mouse_tiled: vec2 = [0, 0]

	constructor() {
		this.init();

		this.view = new aabb2([0, 0], [0, 0]);

		if (SHOW_FRUSTUM) {
			this.frustum = new Rekt;
			this.frustum.name = 'Frustum';
			this.frustum.tile = [0, 0];
			this.frustum.wh = [1, 1];
			this.frustum.asset = 'egyt/128';

			this.frustum.plain = true;
			this.frustum.use();
			this.frustum.mesh.renderOrder = 9999999;
			this.frustum.material.wireframe = true;
		}

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
		this.move();
		this.chunkMaster.update();
	}
	getChunkAt(zx: vec2 | vec3) {
		return this.chunkMaster.which(<vec2>zx);
	}

	mark_mouse() {
		let m: vec2 = [App.pos.x, App.pos.y];
		m[1] = -m[1];
		m = pts.divide(m, Lumber.world.scale);

		let p = <vec2>[Lumber.world.view.min[0], Lumber.world.view.max[1]];
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
			Renderer.loadtexture(str, undefined, callback);
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
	move() {
		let speed = 5;
		const factor = 1 / this.dpi;

		let p = [...this.pos];

		if (App.keys['x']) speed *= 10;

		if (App.keys['w']) p[1] -= speed;
		if (App.keys['s']) p[1] += speed;
		if (App.keys['a']) p[0] += speed;
		if (App.keys['d']) p[0] -= speed;

		this.pos = <vec2>[...p];

		if (App.wheel > 0) {
			if (this.scale < 1) {
				this.scale = 1;
			}
			else {
				this.scale += factor;
			}
			if (this.scale > 2 / this.dpi)
				this.scale = 2 / this.dpi;

			console.log('scale up', this.scale);
		}

		else if (App.wheel < 0) {
			this.scale -= factor;
			if (this.scale < .5 / this.dpi)
				this.scale = .5 / this.dpi;

			console.log('scale down', this.scale);
		}

		Renderer.scene.scale.set(this.scale, this.scale, 1);

		let p2 = pts.mult(this.pos, this.scale);

		Renderer.scene.position.set(p2[0], p2[1], 0);

		let w = window.innerWidth // tq.target.width;
		let h = window.innerHeight // tq.target.height;

		//console.log(`tq target ${w} x ${h}`)

		let w2 = w / this.dpi / this.scale;
		let h2 = h / this.dpi / this.scale;

		this.view = new aabb2(
			[-p[0] - w2 / 2, -p[1] - h2 / 2],
			[-p[0] + w2 / 2, -p[1] + h2 / 2]
		);
		this.view.min = pts.floor(this.view.min);
		this.view.max = pts.floor(this.view.max);

		this.focal = [-p[0], -p[1], 0];

		//return;

		if (SHOW_FRUSTUM) {
			this.frustum.mesh.scale.set(w2, h2, 1);
			this.frustum.tile = pts.divide(<vec2><unknown>this.focal, Lumber.EVEN);
			this.frustum.now_update_pos();
		}
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

	export function unproject(query: vec2): Un {
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

export default World;