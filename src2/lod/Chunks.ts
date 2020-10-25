import Lumber from "../Lumber";
import World from "./World";
import Renderer from "../Renderer";
import Obj from "../objrekt/Obj";
import Rekt from "../objrekt/Rekt";
import pts from "../lib/pts";
import aabb2 from "../lib/aabb2";

import {  Group, WebGLRenderTarget, OrthographicCamera } from "three";

const count = (c: Chunk, prop: string) => {
	let num = 0;
	for (let t of c.objs.table.t)
		if (t[0][prop])
			num++;
	return num;
}
class Chunk {
	on = false
	changed = true
	childobjscolor

	readonly objs: Objs
	rt: RtChunk | null
	p: vec2
	p2: vec2

	basest_tile: vec2
	order_tile: vec2
	north: vec2
	tile_s: vec2

	bound: aabb2
	screen: aabb2
	rekt_offset: vec2

	group: Group
	grouprt: Group

	rektcolor = 'white'

	outline: Rekt

	constructor(x, y, public master: ChunkMaster<Chunk>) {
		this.master.total++;

		const colors = ['lightsalmon', 'khaki', 'lightgreen', 'paleturquoise', 'plum', 'pink'];

		this.objs = new Objs(this);
		//this.childobjscolor = Lumber.sample(colors);

		this.p = [x, y];
		this.p2 = [x + 1, y];
		this.group = new Group;
		this.grouprt = new Group;

		this.set_bounds();
	}
	anchor()
	{
		
	}
	set_bounds() {
		const pt = pts.pt(this.p);

		let p3 = pts.clone(this.p);

		this.basest_tile = pts.mult(this.p2, this.master.span * Lumber.EVEN);
		this.north = 	   pts.mult(p3, 	 this.master.span * Lumber.EVEN);

		this.order_tile = this.north;

		this.rekt_offset = pts.clone(this.basest_tile);

		if (Lumber.OFFSET_CHUNK_OBJ_REKT) {
			const zx = pts.project(this.basest_tile);
			const zxc = <vec3>[...zx, 0];

			this.group.position.fromArray(zxc);
			this.grouprt.position.fromArray(zxc);

			const depth = Rekt.depth(this.order_tile);

			this.group.renderOrder = depth;
			this.grouprt.renderOrder = depth;
		}

		// note: non screen bound not used anymore

		this.bound = new aabb2(
			[pt.x * this.master.span, pt.y * this.master.span],
			[(pt.x + 1) * this.master.span, (pt.y + 1) * this.master.span]);

		this.screen = Chunk.Sscreen(pt.x, pt.y, this.master);
	}
	empty() {
		return this.objs.table.t.length < 1;
	}
	comes() {
		if (this.on || this.empty())
			return;
		this.objs.comes();
		Renderer.scene.add(this.group, this.grouprt);
		this.comes_pt2();
		this.on = true;
		return true;
	}
	comes_pt2() {
		if (!Lumber.USE_CHUNK_RT)
			return;
		if (Lumber.MINIMUM_REKTS_BEFORE_RT <= count(this, 'rtt'))
			return;
		if (!this.rt)
			this.rt = new RtChunk(this);
		this.rt.comes();
		this.rt.render();
	}
	goes() {
		if (!this.on)
			return;
		Renderer.scene.remove(this.group, this.grouprt);
		Renderer.erase_children(this.group);
		Renderer.erase_children(this.grouprt);
		this.objs.goes();
		this.rt?.goes();
		this.on = false;
	}
	oob() {
		return Lumber.world.view.test(this.screen) == aabb2.TEST.Outside;
	}
	update() {
		this.objs.updates();
		if (Lumber.USE_CHUNK_RT && this.changed)
			this.rt?.render();
		this.changed = false;
	}
}
namespace Chunk {
	export function Sscreen(x, y, master) {

		let basest_tile = pts.mult([x + 1, y], master.span * Lumber.EVEN);

		let real = pts.subtract(pts.project(basest_tile), [0, -master.height / 2]);

		return new aabb2(
			pts.add(real, [-master.width / 2, -master.height / 2]),
			pts.add(real, [master.width / 2, master.height / 2])
		)
	}
}

class Tuple<T = []> {
	public readonly t: T[] = []
	constructor(private key = 0) {
	}
	search(k = this.key, v: any): number | undefined {
		let i = this.t.length;
		while (i--)
			if (this.t[i][k] == v)
				return i;
	}
	add(t: T, k = this.key) {
		let i = this.search(k, t[k]);
		if (i == undefined) {
			this.t.push(t);
			return true;
		}
		return false;
	}
	remove(v: any, k = this.key) {
		let i = this.search(k, v);
		if (i != undefined) {
			this.t.splice(i, 1);
			return true;
		}
		return false;
	}
}


class Objs {
	public rtts = 0
	public readonly table: Tuple<[Obj, number]>
	constructor(private chunk: Chunk) {
		this.table = new Tuple;
	}
	rate(obj: Obj) {
		return this.table.t.length * obj.rate;
	}
	add(obj: Obj) {
		return this.table.add([obj, this.rate(obj)]);
	}
	get(tile: vec2) {
		for (let t of this.table.t)
			if(pts.equals(t[0].tile, tile))
				return t[0];
	}
	remove(obj: Obj) {
		return this.table.remove(obj);
	}
	updates() {
		for (let t of this.table.t) {
			let rate = t[1]--;
			if (rate <= 0) {
				t[0].update();
				t[1] = this.rate(t[0]);
			}
		}
	}
	comes() {
		for (let t of this.table.t)
			t[0].comes();
	}
	goes() {
		for (let t of this.table.t)
			t[0].goes();
	}
}

class ChunkMaster<T extends Chunk> {
	readonly span: number
	readonly span2: number
	readonly width: number
	readonly height: number

	total: number = 0
	arrays: T | null[][] = []

	refit = true
	fitter: Tailorer<T>

	constructor(private testType: new (x, y, m) => T, span: number) {
		this.span = span;
		this.span2 = span * span;
		this.width = span * Lumber.EVEN;
		this.height = span * Lumber.EVEN / 2;

		this.fitter = new Tailorer<T>(this);
	}
	update() {
		if (this.refit)
			this.fitter.update();
	}
	big(zx: vec2): vec2 {
		return pts.floor(pts.divide(zx, this.span));
	}
	at(x, y): T | null {
		let c;
		if (this.arrays[y] == undefined)
			this.arrays[y] = [];
		c = this.arrays[y][x];
		return c;
	}
	make(x, y): T {
		let c: T | null;
		c = this.at(x, y);
		if (c)
			return c;
		c = this.arrays[y][x] = new this.testType(x, y, this);
		return c;
	}
	which(t: vec2): T {
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

class Tailorer<T extends Chunk> { // chunk-snake
	static readonly forward = 1
	static readonly reverse = -1
	lines: number
	total: number

	shown: T[] = []
	colors: string[] = []

	constructor(private master: ChunkMaster<T>) {
	}
	off() {
		let i = this.shown.length;
		while (i--) {
			let c: T;
			c = this.shown[i];
			c.update();
			if (c.oob()) {
				c.goes();
				this.shown.splice(i, 1);
			}
		}
	}
	update() {
		let middle = World.unproject(Lumber.world.view.center()).tiled;
		let b = this.master.big(middle);
		this.lines = this.total = 0;
		this.off();
		this.slither(b, Tailorer.forward);
		this.slither(b, Tailorer.reverse);
	}
	slither(b: vec2, n: number) {
		let x = b[0], y = b[1];
		let i = 0, j = 0, s = 0, u = 0;
		while (true) {
			i++;
			let c: T;
			c = this.master.guarantee(x, y);
			if (!c.on && c.oob()) {
				if (s > 2) {
					if (j == 0) { j = 1; }
					if (j == 2) { j = 3; }
				}
				u++;
			}
			else {
				u = 0;
				if (c.comes()) {
					this.shown.push(c);
				}
			}
			if (j == 0) {
				y += n;
				s++;
			}
			else if (j == 1) {
				x -= n;
				j = 2;
				s = 0;
			}
			else if (j == 2) {
				y -= n;
				s++;
			}
			else if (j == 3) {
				x -= n;
				j = 0;
				s = 0;
			}
			if (!s) {
				this.lines++;
			}
			this.total++;
			if (u > 5 || i >= 350) {
				break;
			}
		}
	}

}

class RtChunk {
	readonly padding = Lumber.EVEN * 4
	readonly width: number
	readonly height: number

	offset: vec2 = [0, 0]

	rekt: Rekt
	target: WebGLRenderTarget
	camera: OrthographicCamera

	constructor(private chunk: Chunk) {
		// todo, width height
		this.width = this.chunk.master.width + this.padding;
		this.height = this.chunk.master.height + this.padding;
		this.camera = Renderer.ortographiccamera(this.width, this.height);

		// todo, pts.make(blah)

		let t = pts.mult(this.chunk.p2, this.chunk.master.span);

		this.rekt = new Rekt;
		this.rekt.tile = t;
		this.rekt.size = [this.width, this.height];
		this.rekt.asset = 'egyt/tenbyten';
	}
	// todo pool the rts?
	comes() {
		this.rekt.use();
		this.rekt.mesh.renderOrder = Rekt.depth(this.chunk.order_tile);
		this.target = Renderer.rendertarget(this.width, this.height);
	}
	goes() {
		this.rekt.unuse();
		this.target.dispose();
	}
	render() {
		while (Renderer.rttscene.children.length > 0)
			Renderer.rttscene.remove(Renderer.rttscene.children[0]);

		const group = this.chunk.grouprt;

		group.position.set(0, -this.height / 2, 0);
		Renderer.rttscene.add(group);

		Renderer.renderer.setRenderTarget(this.target);
		Renderer.renderer.clear();
		Renderer.renderer.render(Renderer.rttscene, this.camera);

		this.rekt.material.map = this.target.texture;
	}
}

export { Chunk, ChunkMaster }