import Lumber from "../Lumber";
import Renderer from "../Renderer";
import Obj from "../objrekt/Obj";
import Rekt from "../objrekt/Rekt";
import pts from "../lib/pts";
import aabb2 from "../lib/aabb2";

import App from "../App";

import { Chunk, ChunkMaster } from "./Chunks";

import { Ply } from "../nested/char/Char";
import { Ploppables } from "./Ploppables";



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

	fg: ChunkMaster<Chunk>
	bg: ChunkMaster<Chunk>

	mtil: vec2 = [0, 0]
	wheelable = true

	constructor() {
		this.init();

		this.view = new aabb2([0, 0], [0, 0]);

		if (SHOW_FRUSTUM) {
			this.frustum = new Rekt;
			this.frustum.name = 'Frustum';
			this.frustum.tile = [0, 0];
			this.frustum.size = [1, 1];
			this.frustum.asset = 'egyt/128';

			this.frustum.plain = true;
			this.frustum.use();
			this.frustum.mesh.renderOrder = 9999999;
			this.frustum.material.wireframe = true;
		}

		console.log('world');
	}
	add(obj: Obj) {
		let c = this.fg.attile(obj.tile);

		if (c.objs.add(obj)) {
			obj.chunk = c;
			obj.chunk.changed = true;
			if (c.on)
				obj.comes();
		}
	}
	remove(obj: Obj) {
		if (obj.chunk?.objs.remove(obj)) {
			obj.goes();
			obj.chunk.changed = true;
		}
	}
	update() {
		this.move();
		this.mark_mouse();
		this.fg.update();
		this.bg.update();
	}

	mark_mouse() {
		let m: vec2 = [App.pos.x, App.pos.y];
		m[1] = -m[1];
		m = pts.divide(m, Lumber.wlrd.scale);

		let p = <vec2>[Lumber.wlrd.view.min[0], Lumber.wlrd.view.max[1]];
		p = pts.add(p, m);

		const unprojected = World.unproject(p);

		this.mtil = unprojected.tiled;;
	}
	init() {
		this.fg = new ChunkMaster<Chunk>(Chunk, 20);
		this.bg = new ChunkMaster<Chunk>(Chunk, 20);

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

		if (this.wheelable && App.wheel > 0) {
			if (this.scale < 1) {
				this.scale = 1;
			}
			else {
				this.scale += factor;
			}
			if (this.scale > 2 / this.dpi)
				this.scale = 2 / this.dpi;

			//console.log('scale up', this.scale);
		}

		else if (this.wheelable && App.wheel < 0) {
			this.scale -= factor;
			if (this.scale < .5 / this.dpi)
				this.scale = .5 / this.dpi;

			//console.log('scale down', this.scale);
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
			this.frustum.update();
		}
	}
	populate() {

		const every = (pos: vec2) => {
			let obj = new Obj;
			obj.rtt = false;
			obj.rekt = new Rekt;
			//obj.rekt.low = true;
			obj.rekt.size = [480, 240];
			obj.rekt.offset = [19, 0];
			obj.tile = obj.rekt.tile = pts.mult(pos, 20);
			obj.rekt.asset = 'balmora/desert1010'
			Lumber.wlrd.add(obj);
		}

		//pts.area_every(new aabb2([-10, -10], [10, 10]), every);

		let building1 = new Rekt;
		building1.tile = [6, -1];
		building1.size = [181, 146];
		building1.asset = 'balmora/building1';
		building1.use();

		return;
		let granary = new Rekt;
		granary.tile = [6, -1];
		granary.size = [216, 168];
		granary.asset = 'egyt/building/granary';

		let tobaccoshop = new Rekt;
		tobaccoshop.tile = [-14, 2];
		tobaccoshop.size = [144, 144];
		tobaccoshop.asset = 'egyt/building/redstore';

		//granary.use();
		tobaccoshop.use();

		Ploppables.area_wheat(2, new aabb2([5, -4], [5 + 50 - 2, -12]));
		Ploppables.area_wheat(2, new aabb2([5 + 50, -4], [5 + 50 - 2 + 50, -12]));
		Ploppables.area_wheat(3, new aabb2([5, -14], [5 + 50 - 2, -22]));
		Ploppables.area_wheat(3, new aabb2([5 + 50, -14], [5 + 50 - 2 + 50, -22]));
		Ploppables.area_wheat(3, new aabb2([-42, 21], [-80, 183]));

		const stones = [
			'egyt/ground/stone1',
			'egyt/ground/stone2',
		];
		const gravels = [
			'egyt/ground/gravel1',
			'egyt/ground/gravel2',
		];
		Ploppables.area_tile_sampled(30, gravels, new aabb2([-1, 0], [2, -22]));

		// lots gravels
		//Tilization.area_sample(66, gravels, new aabb2([-20, -10], [50, 80]));

		// long road se
		Ploppables.area_tile_sampled(50, stones, new aabb2([-13, 0], [400, -3]));

		// long road ne
		Ploppables.area_tile_sampled(50, stones, new aabb2([-14, 0], [-12, 400]));

		// farms se
		Ploppables.area_wheat(1, new aabb2([-15, 21], [-40, 101]));
		Ploppables.area_wheat(1, new aabb2([-15, 103], [-40, 183]));

		Ploppables.area_fort(0, new aabb2([5, 20], [13, 32]));
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