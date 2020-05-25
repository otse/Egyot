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
	childobjscolor

	readonly objs: chunk_objs2
	rt: chunk_rt | null
	p: zx
	rekt_offset: zx
	tile_n: zx
	tile_s: zx
	mult: zx
	real: zx
	opposite: zx
	bound: aabb2
	boundscreen: aabb2

	group: Group

	grouprtt: Group
	rektcolor = 'white'

	outline: Rekt

	constructor(x, y, public master: chunk_master<chunk>) {
		this.master.total++;

		const colors = ['lightsalmon', 'khaki', 'lightgreen', 'paleturquoise', 'plum', 'pink'];

		this.objs = new chunk_objs2(this);
		//this.color = Egyt.sample(colors);
		this.p = [x, y];
		this.group = new Group;
		this.grouprtt = new Group;

		this.set_bounds();
	}

	set_bounds() {
		let x = this.p[0];
		let y = this.p[1];

		let basest_tile = points.multp([x + 1, y], this.master.span * 24);

		let frightening = <zxc>[...basest_tile, 0];
		frightening = <zxc><unknown>points.twoone(frightening);
		frightening[2] = 0;

		this.tile_n = [x - 3, y + 3];
		points.multp(this.tile_n, this.master.span * 24);
		//points.subtract(this.north, [-24, 24]);

		this.rekt_offset = points.zx(basest_tile);

		if (Egyt.OFFSET_CHUNK_OBJ_REKT) {
			this.group.position.fromArray(frightening);
			this.grouprtt.position.fromArray(frightening);

			this.group.renderOrder = this.grouprtt.renderOrder = Rekt.Srorder(this.tile_n);
		}

		this.bound = new aabb2(
			[x * this.master.span, y * this.master.span],
			[(x + 1) * this.master.span, (y + 1) * this.master.span]);

		let real = [...points.twoone(<zxc>[...basest_tile]), 0] as zxc;
		points.subtract(real, [0, -this.master.height / 2]);
		this.real = <zx>[...real];

		this.boundscreen = new aabb2(
			<zx>points.add(<zxc>[...real], [-this.master.width / 2, -this.master.height / 2]),
			<zx>points.add(<zxc>[...real], [this.master.width / 2, this.master.height / 2])
		)
	}
	update_color() {
		return;
		//if (!this.rttrekt.inuse)
		//	return;
		//this.rttrekt.material.color.set(new Color(this.rektcolor));
		//this.rttrekt.material.needsUpdate = true;
	}
	empty() {
		return this.objs.tuples.length < 1;
	}
	comes() {
		if (this.empty())
			return;
		if (this.on)
			return;
		this.objs.comes();
		tq.scene.add(this.group, this.grouprtt);
		this.comes_pt2();
		this.on = true;
	}
	comes_pt2() {
		if (!Egyt.USE_CHUNK_RT)
			return;
		const treshold = this.objs.rtts >= 10;
		if (!treshold)
			return;
		if (!this.rt)
			this.rt = new chunk_rt(this);
		this.rt.comes();
		this.rt.render();
	}
	goes() {
		if (!this.on)
			return;
		tq.scene.remove(this.group, this.grouprtt);
		tqlib.erase_children(this.group);
		tqlib.erase_children(this.grouprtt);
		this.objs.goes();
		this.rt?.goes();
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
		this.objs.updates();
		if (Egyt.USE_CHUNK_RT && this.changed)
			this.rt?.render();
		this.changed = false;
	}
}

class chunk_objs2 {
	public rtts = 0
	public readonly tuples: [Obj, number][]
	constructor(private chunk: chunk) {
		this.tuples = [];
	}
	rate(obj: Obj) {
		return this.tuples.length * obj.rate;
	}
	where(obj: Obj) {
		let i = this.tuples.length;
		while (i--)
			if (this.tuples[i][0] == obj)
				return i;
	}
	add(obj: Obj) {
		let i = this.where(obj);
		if (i == undefined) {
			let rate = this.rate(obj);
			this.tuples.push([obj, rate]);
			obj.chunk = this.chunk;
			this.chunk.changed = true;
			if (obj.rtt)
				this.rtts++;
		}
	}
	remove(obj: Obj) {
		let i = this.where(obj);
		if (i != undefined) {
			this.tuples.splice(i, 1);
			obj.chunk = null;
			this.chunk.changed = true;
			if (obj.rtt)
				this.rtts++;
		}
	}
	updates() {
		for (let tuple of this.tuples) {
			let rate = tuple[1]--;
			if (rate <= 0) {
				tuple[0].update();
				tuple[1] = this.rate(tuple[0]);
			}
		}
	}
	comes() {
		for (let tuple of this.tuples) {
			tuple[0].comes();
		}
	}
	goes() {
		for (let tuple of this.tuples) {
			tuple[0].goes();
		}
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
				console.log('goes');
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
	readonly padding = Egyt.YUM * 4
	readonly w: number
	readonly h: number

	offset: zx = [0, 0]

	rekt: Rekt
	target: WebGLRenderTarget
	camera: OrthographicCamera

	constructor(private chunk: chunk) {
		this.w = this.chunk.master.width + this.padding;
		this.h = this.chunk.master.height + this.padding;
		this.camera = tqlib.ortographiccamera(this.w, this.h);

		let p2 = <zx>[this.chunk.p[0] + 1, this.chunk.p[1]];
		points.multp(p2, this.chunk.master.span);

		this.rekt = new Rekt({
			tiled: true,
			xy: p2,
			wh: [this.w, this.h],
			asset: 'egyt/tenbyten'
		});
	}
	// todo pool the rts?
	comes() {
		this.rekt.use();
		this.rekt.mesh.renderOrder = Rekt.Srorder(this.chunk.tile_n);
		this.target = tqlib.rendertarget(this.w, this.h);
	}
	goes() {
		this.rekt.unuse();
		this.target.dispose();
	}
	render() {
		while (tq.rttscene.children.length > 0)
			tq.rttscene.remove(tq.rttscene.children[0]);

		const group = this.chunk.grouprtt;

		group.position.set(0, -this.h / 2, 0);
		tq.rttscene.add(group);

		tq.renderer.setRenderTarget(this.target);
		tq.renderer.clear();
		tq.renderer.render(tq.rttscene, this.camera);

		this.rekt.material.map = this.target.texture;
	}
}

export { chunk, chunk_master, chunk_fitter, chunk_objs2, statchunk, dynchunk }