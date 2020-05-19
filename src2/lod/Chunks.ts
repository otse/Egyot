import Rekt from "../objrekt/Rekt";
import { Win } from "../lib/Board";
import Egyt from "../Egyt";
import App from "../lib/App";
import points from "../lib/Points";
import Forestation from "./gen/Forestation";
import Agriculture from "./gen/Agriculture";
import { aabb2 } from "../lib/AABB";
import Obj from "../objrekt/Obj";
import { Color, Group, WebGLRenderTarget, Int8Attribute, RGBFormat, NearestFilter, LinearFilter, RGBAFormat, PlaneBufferGeometry, MeshBasicMaterial, Mesh, OrthographicCamera } from "three";
import { tq } from "../lib/tq";
import Tilization from "./gen/Tilization";
import { tqlib } from "../lib/tqlib";


declare class sobj {

}

class chunk {
	on = false
	changed = true
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
	bound: aabb2
	boundscreen: aabb2

	array: Obj[][][]

	area: Rekt
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

		this.area = new Rekt({
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

		this.bound = new aabb2(
			[x * this.master.span, y * this.master.span],
			[(x + 1) * this.master.span, (y + 1) * this.master.span]);


		let real = [...points.twoone(<zxc>[...p1]), 0] as zxc;
		points.subtract(real, [0, -this.master.height / 2]);
		this.real = <zx>[...real];

		this.boundscreen = new aabb2(
			<zx>points.add(<zxc>[...real], [-this.master.width / 2, -this.master.height / 2]),
			<zx>points.add(<zxc>[...real], [this.master.width / 2, this.master.height / 2])
		)
	}
	empty() {
		return this.objs.array().length < 1;
	}
	update_color() {
		return;
		if (!this.area.inuse)
			return;
		this.area.material.color.set(new Color(this.rektcolor));
		this.area.material.needsUpdate = true;
	}
	comes() {
		if (this.empty())
			return;
		if (this.on)
			return;
		this.area.use();
		this.area.mesh.renderOrder = -9999;
		this.objs.comes();
		tq.scene.add(this.group);
		this.comes_pt2();
		this.on = true;
	}
	comes_pt2() {
		if (!Egyt.USE_CHUNK_RT)
			return;
		const treshold = this.objs.array().length >= 10;
		if (!treshold)
			return;
		if (!this.rt)
			this.rt = new chunk_rt(this);
		this.rt.render();
	}
	goes() {
		if (!this.on)
			return;
		this.area.unuse();
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
		return this.sec() != aabb2.SEC.OUT;
	}
	out() {
		return this.sec() == aabb2.SEC.OUT;
	}
	update() {
		if (Egyt.USE_CHUNK_RT && this.rt && this.changed)
			this.rt.render();
		this.changed = false;
	}
}

class arrayt<T> {
	private ar: T[] = []
	constructor() {

	}
	add(t: T) {
		let i = this.ar.indexOf(t);
		if (i == -1) {
			this.ar.push(t);
		}
		return i;
	}
	remove(t: T) {
		let i = this.ar.indexOf(t);
		if (i > -1) {
			this.ar.splice(i, 1);
		}
		return i;
	}
	static had(i: number) {
		return i > -1;
	}
	static hadnt(i: number) {
		return i == -1;
	}
	array() {
		return <ReadonlyArray<T>>this.ar;
	}
}

class chunk_objs extends arrayt<Obj> {
	private ticks: number[] = []
	constructor(private chunk: chunk) {
		super()
	}
	rate(obj: Obj) {
		return obj.tickrate;
	}
	add(obj: Obj) {
		let i = super.add(obj);
		if (arrayt.hadnt(i)) {
			this.ticks.push(this.rate(obj));
			obj.chunk = this.chunk;
		}
		this.chunk.changed = true;
		return i;
	}
	remove(obj: Obj) {
		let i = super.remove(obj);
		if (arrayt.had(i)) {
			this.ticks.splice(i, 1);
			obj.chunk = null;
		}
		this.chunk.changed = true;
		return i;
	}
	comes() {
		for (let obj of this.array())
			obj.comes();
	}
	goes() {
		for (let obj of this.array())
			obj.goes();
	}
}

class statchunk extends chunk {

}

class dynchunk extends chunk {

}

class chunk_master<T extends chunk> {
	readonly span: number
	readonly span2: number
	readonly width: number
	readonly height: number

	total: number = 0
	arrays: T | null[][] = []

	fitter: chunk_fitter<T>

	constructor(private testType: new (x, y, m) => T, span: number) {
		this.span = span;
		this.span2 = span * span;
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
	snake_re(b: zx, n: number) {
		let i = 0;
		let s = 0;
		let u = 0;
		let x = b[0];
		let y = b[1];
		let stage = 0;

		while (true) {

		}
	}
	snake(b: zx, n: number) {
		let i, s, u;
		let x = b[0], y = b[1];
		let soo = 0;
		i = 0;
		s = 0;
		u = 0;

		while (true) {
			i++;
			let c: T;
			c = this.master.guarantee(x, y);
			if (c.out()) {
				if (s > 2) {
					if (soo == 0) soo = 1;
					if (soo == 2) soo = 3;
				}
				u++;
			}
			else {
				u = 0;
				const on = c.on;
				c.comes();
				if (!on && c.on)
					this.shown.push(c);
			}
			if (soo == 0) {
				y += n;
				s++;
			}
			else if (soo == 1) {
				x -= n;
				soo = 2;
				s = 0;
			}
			else if (soo == 2) {
				y -= n;
				s++;
			}
			else if (soo == 3) {
				x -= n;
				soo = 0;
				s = 0;
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

		this.chunk.area.material.map = this.target.texture;
	}
}

export { chunk, chunk_master, chunk_fitter, chunk_objs, statchunk, dynchunk }