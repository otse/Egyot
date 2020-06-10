import Rekt from "../objrekt/Rekt";
import { Win } from "../lib/Board";
import Egyt from "../Egyt";
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
import { Map } from "./Map";
import { World } from "./World";

const count = (c: Chunk, prop: string) => {
	let num = 0;
	for (let t of c.objs.mat.t)
		if (t[0][prop])
			num++;
	return num;
}
class Chunk {
	on = false
	changed = true
	childobjscolor

	readonly objs: ChunkObjs
	rt: ChunkRt | null
	p: vec2
	p2: vec2

	basest_tile: vec2
	order_tile: vec2
	north: vec2
	tile_s: vec2

	bound: aabb2
	screen: aabb2
	rekt_offset: zx

	group: Group
	grouprt: Group

	rektcolor = 'white'

	outline: Rekt

	constructor(x, y, public master: ChunkMaster<Chunk>) {
		this.master.total++;

		const colors = ['lightsalmon', 'khaki', 'lightgreen', 'paleturquoise', 'plum', 'pink'];

		this.objs = new ChunkObjs(this);
		//this.color = Egyt.sample(colors);

		this.p = [x, y];
		this.p2 = [x + 1, y];
		this.group = new Group;
		this.grouprt = new Group;

		this.set_bounds();
	}

	set_bounds() {
		const pt = pts.pt(this.p);

		let basest_tile = pts.mult(this.p2, this.master.span * 24);
		this.basest_tile = pts.clone(basest_tile);

		let north = pts.mult(this.p2, this.master.span * 24);
		this.north = north;

		this.order_tile = north;

		this.rekt_offset = pts.clone(basest_tile);

		if (Egyt.OFFSET_CHUNK_OBJ_REKT) {
			const zx = pts.project(basest_tile);
			const zxc = <vec3>[...zx, 0];

			this.group.position.fromArray(zxc);
			this.grouprt.position.fromArray(zxc);

			const depth = Rekt.depth(this.order_tile);

			this.group.renderOrder = depth;
			this.grouprt.renderOrder = depth;
		}

		// non screen bound not used anymore
		this.bound = new aabb2(
			[pt.x * this.master.span, pt.y * this.master.span],
			[(pt.x + 1) * this.master.span, (pt.y + 1) * this.master.span]);

		this.screen = Chunk.Sscreen(pt.x, pt.y, this.master);
	}
	update_color() {
		return;
		//if (!this.rttrekt.inuse)
		//	return;
		//this.rttrekt.material.color.set(new Color(this.rektcolor));
		//this.rttrekt.material.needsUpdate = true;
	}
	empty() {
		return this.objs.mat.t.length < 1;
	}
	comes() {
		if (this.on || this.empty())
			return;
		this.objs.comes();
		tq.scene.add(this.group, this.grouprt);
		this.comes_pt2();
		this.on = true;
		return true;
	}
	comes_pt2() {
		if (!Egyt.USE_CHUNK_RT)
			return;
		let rtt = count(this, 'rtt');
		const threshold = rtt >= 10;
		if (!threshold)
			return;
		if (!this.rt)
			this.rt = new ChunkRt(this);
		this.rt.comes();
		this.rt.render();
	}
	goes() {
		if (!this.on)
			return;
		tq.scene.remove(this.group, this.grouprt);
		tqlib.erase_children(this.group);
		tqlib.erase_children(this.grouprt);
		this.objs.goes();
		this.rt?.goes();
		this.on = false;
	}
	noob() {
		return Egyt.game.view.test(this.screen) != aabb2.OOB;
	}
	oob() {
		return Egyt.game.view.test_oob(this.screen) == aabb2.OOB;
	}
	update() {
		this.objs.updates();
		if (Egyt.USE_CHUNK_RT && this.changed)
			this.rt?.render();
		this.changed = false;
	}
}
namespace Chunk {
	export function Sscreen(x, y, master) {

		let basest_tile = pts.mult([x + 1, y], master.span * 24);

		let real = pts.subtract(pts.project(basest_tile), [0, -master.height / 2]);

		return new aabb2(
			pts.add(real, [-master.width / 2, -master.height / 2]),
			pts.add(real, [master.width / 2, master.height / 2])
		)
	}
}

class Matrix<T = []> {
	public readonly t: T[] = []
	constructor(private key = 0) {
	}
	search(k = this.key, v: any): number | undefined {
		let i = this.t.length;
		while (i--)
			if (this.t[i][k] == v)
				return i;
	}
	add(t: T, k = this.key): boolean {
		let i = this.search(k, t[k]);
		if (i == undefined) {
			this.t.push(t);
			return !!1;
		}
		return !!0;
	}
	remove(v: any, k = this.key): boolean {
		let i = this.search(k, v);
		if (i != undefined) {
			this.t.splice(i, 1);
			return !!1;
		}
		return !!0;
	}
}

class ChunkObjs {
	public rtts = 0
	public readonly mat: Matrix<[Obj, number]>
	constructor(private chunk: Chunk) {
		this.mat = new Matrix;
	}
	rate(obj: Obj) {
		return this.mat.t.length * obj.rate;
	}
	add(obj: Obj) {
		return this.mat.add([obj, this.rate(obj)]);
	}
	remove(obj: Obj) {
		return this.mat.remove(obj);
	}
	updates() {
		for (let t of this.mat.t) {
			let rate = t[1]--;
			if (rate <= 0) {
				t[0].update();
				t[1] = this.rate(t[0]);
			}
		}
	}
	comes() {
		for (let t of this.mat.t)
			t[0].comes();
	}
	goes() {
		for (let t of this.mat.t)
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
		this.width = span * 24;
		this.height = span * 12;

		this.fitter = new Tailorer<T>(this);
	}
	update() {
		if (this.refit) {
			this.fitter.update();
		}
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
		let middle = World.unproject(Egyt.game.view.center()).tiled;
		let b = this.master.big(middle);
		this.lines = this.total = 0;
		this.off();
		this.slither(b, Tailorer.forward);
		this.slither(b, Tailorer.reverse);
	}
	slither(b: zx, n: number) {
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

class ChunkRt {
	readonly padding = Egyt.EVEN * 4
	readonly w: number
	readonly h: number

	offset: vec2 = [0, 0]

	rekt: Rekt
	target: WebGLRenderTarget
	camera: OrthographicCamera

	constructor(private chunk: Chunk) {
		// todo, width height
		this.w = this.chunk.master.width + this.padding;
		this.h = this.chunk.master.height + this.padding;
		this.camera = tqlib.ortographiccamera(this.w, this.h);

		// todo, pts.make(blah)

		let t = pts.mult(this.chunk.p2, this.chunk.master.span);

		let rekt = this.rekt = new Rekt;
		rekt.tile = t;
		rekt.wh = [this.w, this.h];
		rekt.asset = 'egyt/tenbyten';
	}
	// todo pool the rts?
	comes() {
		this.rekt.use();
		this.rekt.mesh.renderOrder = Rekt.depth(this.chunk.order_tile);
		this.target = tqlib.rendertarget(this.w, this.h);
	}
	goes() {
		this.rekt.unuse();
		this.target.dispose();
	}
	render() {
		while (tq.rttscene.children.length > 0)
			tq.rttscene.remove(tq.rttscene.children[0]);

		const group = this.chunk.grouprt;

		group.position.set(0, -this.h / 2, 0);
		tq.rttscene.add(group);

		tq.renderer.setRenderTarget(this.target);
		tq.renderer.clear();
		tq.renderer.render(tq.rttscene, this.camera);

		this.rekt.material.map = this.target.texture;
	}
}

export { Chunk, ChunkMaster, Tailorer, ChunkObjs }