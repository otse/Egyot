import Rekt from "../objrekt/Rekt";
import { Win } from "../lib/Board";
import Egyt from "../Egyt";
import App from "../lib/App";
import points from "../lib/Points";
import Forestation from "./gen/Forestation";
import Agriculture from "./gen/Agriculture";
import { aabb3 } from "../lib/AABB";
import Obj from "../objrekt/Obj";
import { Color, Group, WebGLRenderTarget, Int8Attribute, RGBFormat, NearestFilter, LinearFilter, RGBAFormat, PlaneBufferGeometry, MeshBasicMaterial, Mesh, OrthographicCamera } from "three";
import { tq } from "../lib/tq";
import Tilization from "./gen/Tilization";
import { tqlib } from "../lib/tqlib";


declare class sobj {

}

class chunk {
	on = false
	changes = true
	group: Group
	group_bluh: Group
	childobjscolor

	readonly objs: chunk_objs
	rt: chunk_rt
	p: zx
	rekt_offset: zx
	tile: zx
	mult: zx
	real: zx
	bound: aabb3
	boundscreen: aabb3

	array: Obj[][][]

	rekt: Rekt
	rektcolor = 'white'

	outline: Rekt

	constructor(x, y, public master: chunk_master<chunk>) {
		this.master.total++;
		const colors = ['lightsalmon', 'khaki', 'lightgreen', 'paleturquoise', 'plum', 'pink'];

		this.objs = new chunk_objs(this);
		//this.color = Egyt.sample(colors);
		this.p = [x, y];
		this.group = new Group;
		this.group_bluh = new Group;

		this.set_bounds();

		this.rekt = new Rekt({
			xy: this.mult,
			wh: [this.master.width, this.master.height],
			asset: 'egyt/tenbyten',
			//color: this.rektcolor
		});

	}

	set_bounds() {
		let x = this.p[0];
		let y = this.p[1];

		let p1 = points.multp([x + 1, y, 0], this.master.span * 24);
		this.tile = <zx>[...p1];
		points.subtract(p1, [24, 0]);
		this.mult = p1;

		let middle = <zxc>[...p1, 0];
		middle = <zxc><unknown>points.twoone(middle);
		middle[2] = 0;

		this.rekt_offset = this.tile;

		if (Egyt.OFFSET_CHUNK_OBJ_REKT) {
			this.group.position.fromArray(middle);
			//this.group.renderOrder = this.rekt?.mesh?.renderOrder;
		}

		this.bound = new aabb3(
			[x * this.master.span, y * this.master.span, 0],
			[(x + 1) * this.master.span, (y + 1) * this.master.span, 0]);


		let real = [...points.twoone(<zxc>[...p1]), 0] as zxc;
		points.subtract(real, [0, -this.master.height / 2]);
		this.real = <zx>[...real];

		this.boundscreen = new aabb3(
			<zxc>points.add(<zxc>[...real], [-this.master.width / 2, -this.master.height / 2, 0]),
			<zxc>points.add(<zxc>[...real], [this.master.width / 2, this.master.height / 2, 0])
		)
	}
	empty() {
		return this.objs.many() < 1;
	}
	update_color() {
		return;
		if (!this.rekt.inuse)
			return;
		this.rekt.material.color.set(new Color(this.rektcolor));
		this.rekt.material.needsUpdate = true;
	}
	comes() {
		if (this.empty())
			return;
		if (this.on)
			return;
		this.rekt.use();
		this.rekt.mesh.renderOrder = -9999;
		this.objs.comes();
		tq.scene.add(this.group);
		this.comes_pt2();
		this.on = true;
	}
	comes_pt2() {
		if (!Egyt.USE_CHUNK_RT)
			return;
		const treshold = this.objs.objs.length >= 10;
		if (!treshold)
			return;
		if (!this.rt)
			this.rt = new chunk_rt(this);
		this.rt.render();
	}
	goes() {
		if (!this.on)
			return;
		this.rekt.unuse();
		tq.scene.remove(this.group);
		while (this.group.children.length > 0)
			this.group.remove(this.group.children[0]);
		this.objs.goes();
		this.on = false;
	}
	sec() {
		return Egyt.game.view.intersect2(this.boundscreen);
	}
	see() {
		return this.sec() != aabb3.SEC.OUT;
	}
	out() {
		return this.sec() == aabb3.SEC.OUT;
	}
	update() {
		if (Egyt.USE_CHUNK_RT && this.rt && this.changes)
			this.rt.render();
		this.changes = false;
	}
}

class chunk_objs {
	objs: Obj[] = []
	constructor(private chunk: chunk) {

	}
	many() {
		return this.objs.length;
	}
	indexOf(obj: Obj) {
		return this.objs.indexOf(obj);
	}
	add(obj: Obj) {
		if (-1 == this.indexOf(obj))
			this.objs.push(obj);
		this.chunk.changes = true;
	}
	remove(obj: Obj) {
		let i = this.indexOf(obj);
		if (i > -1)
			this.objs.splice(i, 1);
		this.chunk.changes = true;
	}
	comes() {
		for (let obj of this.objs)
			obj.comes();
	}
	goes() {
		for (let obj of this.objs)
			obj.goes();
	}
}

class statchunk extends chunk {

}

class dynchunk extends chunk {

}

class chunk_master<T extends chunk> {
	readonly span: number
	readonly width: number
	readonly height: number

	total: number = 0
	arrays: T | null[][] = []

	fitter: chunk_fitter<T>

	constructor(private testType: new (x, y, m) => T, span: number) {
		this.span = span;
		this.width = span * 24;
		this.height = span * 12;

		this.fitter = new chunk_fitter<T>(this);
	}
	update() {
		this.fitter.update();
	}
	big(t: zx | zxc): zx {
		return <zx>points.floor(points.divide(<zx>[...t], this.span));
	}
	at(x, y): T | null {
		let c;
		if (this.arrays[y] == undefined)
			this.arrays[y] = [];
		c = this.arrays[y][x];
		return c;
	}
	make(x, y): T {
		let c;
		c = this.at(x, y);
		if (c)
			return c;
		c = this.arrays[y][x] = new this.testType(x, y, this);
		return c;
	}
	which(t: zx): T {
		let b = this.big(t);
		let c = this.guarantee(b[0], b[1]);
		return c;
	}
	guarantee(x, y): T {
		return this.at(x, y) || this.make(x, y);
	}
	//static probe<T>() {

	//}
}

class chunk_fitter<T extends chunk> { // chunk-snake

	lines: number
	total: number

	shown: T[] = []
	colors: string[] = []

	constructor(private master: chunk_master<T>) {
		for (let r = 100; r < 255; r += 8)
			this.colors.push(`rgb(${r},0,0)`);
		for (let g = 100; g < 255; g += 8)
			this.colors.push(`rgb(0,${g},0)`);
		for (let b = 100; b < 255; b += 8)
			this.colors.push(`rgb(0,0,${b})`);
	}

	update() {
		let middle = Egyt.map.query_world_pixel(<zx>[...Egyt.game.view.center()]).tile;

		let b = this.master.big(middle);

		this.lines = 0;
		this.total = 0;

		this.snake(b, 1);
		this.snake(b, -1);

		let i = this.shown.length;
		while (i--) {
			let c = this.shown[i];
			c.update();
			if (c.out()) {
				c.goes();
				this.shown.splice(i, 1);
			}
		}
	}
	snake(b: zx, n: number = 1) {
		let i, s, u;
		let x = b[0], y = b[1];
		let stage = 0;
		i = 0;
		s = 0;
		u = 0;
		let color = -2;

		while (true) {
			i++;
			let c: T;
			c = this.master.guarantee(x, y);
			if (c.out()) {
				if (s > 2) {
					if (stage == 0) stage = 1;
					if (stage == 2) stage = 3;
				}
				u++;
			}
			else {
				u = 0;
				const on = c.on;
				c.comes();
				if (!on && c.on)
					this.shown.push(c);
				if (c.on) {
					color++;
					if (color >= this.colors.length)
						color = 0;
					if (color == -1)
						c.rektcolor = 'white';
					else
						c.rektcolor = this.colors[color];
					c.update_color();
				}
			}
			switch (stage) {
				case 0:
					y += n;
					//y += n;
					s++;
					break;
				case 1:
					x -= n;
					stage = 2;
					s = 0;
					break;
				case 2:
					y -= n;
					//y -= n;
					s++;
					break;
				case 3:
					x -= n;
					stage = 0;
					s = 0;
					break;
			}
			if (!s)
				this.lines++;
			this.total++;
			if (u > 5 || i >= 350) {
				//console.log('break at iteration', i);

				break;
			}
		}
	}

}

class chunk_rt {
	readonly padding = Egyt.YUM * 2
	readonly w: number
	readonly h: number

	offset: zx = [0, 0]

	target: WebGLRenderTarget
	camera

	constructor(private chunk: chunk) {
		this.w = this.chunk.master.width;
		this.h = this.chunk.master.height;

		this.camera = tqlib.ortographiccamera(this.w, this.h);
		this.target = tqlib.rendertarget(this.w, this.h);
	}

	render() {
		while (tq.crtscene.children.length > 0)
			tq.crtscene.remove(tq.crtscene.children[0]);

		const group = this.chunk.group;

		group.position.set(0, -this.h / 2, 0);
		tq.crtscene.add(group);

		tq.renderer.setRenderTarget(this.target);
		tq.renderer.clear();
		tq.renderer.render(tq.crtscene, this.camera);

		this.chunk.rekt.material.map = this.target.texture;
	}
}

class Map {
	static state() {
		return new Map;
	}

	statmaster: chunk_master<statchunk>
	dynmaster: chunk_master<dynchunk>

	statchunk: statchunk
	mouse_tile: zx
	mark: Rekt

	constructor() {

		(window as any).schunk = chunk;

		this.statmaster = new chunk_master<statchunk>(statchunk, 20);

		this.dynmaster = new chunk_master<dynchunk>(dynchunk, 20);

		this.mouse_tile = [0, 0];

		this.mark = new Rekt({
			xy: [0, 0],
			wh: [22, 25],
			asset: 'egyt/iceblock'
		});

		this.mark.use();
		this.mark.mesh.renderOrder = 999;
		//this.mark.dontOrder = true;
	}

	init() {
		tqlib.loadTexture('assets/egyt/tileorange.png', undefined, () => Egyt.resourced('TILE_ORANGE'))
		tqlib.loadTexture('assets/egyt/farm/wheat_i.png', undefined, () => Egyt.resourced('WHEAT_I'))
		tqlib.loadTexture('assets/egyt/farm/wheat_il.png', undefined, () => Egyt.resourced('WHEAT_IL'))
		tqlib.loadTexture('assets/egyt/farm/wheat_ili.png', undefined, () => Egyt.resourced('WHEAT_ILI'))
		tqlib.loadTexture('assets/egyt/farm/wheat_ilil.png', undefined, () => Egyt.resourced('WHEAT_ILIL'))
		tqlib.loadTexture('assets/egyt/farm/wheat_ilili.png', undefined, () => Egyt.resourced('WHEAT_ILILI'))
	}

	populate() {
		let granary = new Rekt({
			istile: true,
			xy: [6, -1],
			wh: [216, 168],
			asset: 'egyt/building/granary'
		});

		let tobaccoshop = new Rekt({
			istile: true,
			xy: [-13, 2],
			wh: [144, 144],
			asset: 'egyt/building/redstore'
		});

		granary.use();
		//tobaccoshop.initiate();

		//Agriculture.area_wheat(1, new aabb3([-9, -4, 0], [3, -22, 0]));
		Agriculture.area_wheat(2, new aabb3([5, -4, 0], [5 + 50 - 2, -12, 0]));
		Agriculture.area_wheat(2, new aabb3([5 + 50, -4, 0], [5 + 50 - 2 + 50, -12, 0]));
		Agriculture.area_wheat(3, new aabb3([5, -14, 0], [5 + 50 - 2, -22, 0]));
		Agriculture.area_wheat(3, new aabb3([5 + 50, -14, 0], [5 + 50 - 2 + 50, -22, 0]));
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
		Tilization.area_sample(50, gravels, new aabb3([-13, 0, 0], [400, -2, 0]));

		// long road ne
		Tilization.area_sample(50, gravels, new aabb3([-13, 0, 0], [-11, 400, 0]));

		// farms se
		Agriculture.area_wheat(1, new aabb3([-15, 21, 0], [-40, 101, 0]));
		Agriculture.area_wheat(1, new aabb3([-15, 103, 0], [-40, 183, 0]));
	}

	get_chunk_tile(t: zx | zxc) {
		return this.statmaster.which(<zx>t);
	}

	query_world_pixel(query: zx): { tile: zx, mult: zx } {
		let p = query;

		let p1 = <zx>points.clone(p);
		p1[0] = p[0] - p[1] * 2;
		p1[1] = p[1] * 2 + p[0];

		let p2 = <zx>[...p1];
		points.divide(p2, 24);
		points.floor(p2);
		p2[0] += 1; // necessary

		let p3 = <zx>[...p2];
		points.multp(p3, 24);

		return { tile: p2, mult: p3 };
	}

	mark_mouse() {

		let m = <zx>[...App.move];
		m[1] = -m[1];
		points.divide(m, Egyt.game.scale);

		let p = [Egyt.game.view.min[0], Egyt.game.view.max[1]] as zx;
		points.add(p, m);

		const mouse = this.query_world_pixel(p);

		this.mouse_tile = mouse.tile;

		this.mark.struct.xy = mouse.mult;
		this.mark.now_update_pos();

	}

	update() {
		this.mark_mouse();

		this.statmaster.update();

		let worldPixelsLeftUpperCorner = [Egyt.game.view.min[0], Egyt.game.view.max[1]] as zx;
		let worldPixelsRightLowerCorner = [Egyt.game.view.max[0], Egyt.game.view.min[1]] as zx;

		const x = this.query_world_pixel(worldPixelsLeftUpperCorner).tile;
		const y = this.query_world_pixel(worldPixelsRightLowerCorner).tile;

	}
}

export { Map, chunk, chunk_master, chunk_fitter, chunk_objs }