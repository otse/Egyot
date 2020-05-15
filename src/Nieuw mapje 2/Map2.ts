import Rekt from "../Nieuw mapje/Rekt";
import { Win } from "../Win";
import Egyt from "../Egyt";
import App from "../App";
import points from "../Zxcvs";
import Forestation from "../Nieuw mapje 3/Forestation";
import Agriculture from "../Nieuw mapje 3/Agriculture";
import { aabb3 } from "../Bound";
import Obj from "../Nieuw mapje/Obj";
import Zxcvs from "../Zxcvs";
import { Color, Group, WebGLRenderTarget, Int8Attribute, RGBFormat, NearestFilter, LinearFilter, RGBAFormat } from "three";
import { ThreeQuarter } from "../ThreeQuarter";
import Tilization from "../Nieuw mapje 3/Tilization";


declare class sobj {

}

class chunk {
	color
	on = false
	group: Group

	objs: chunk_objs
	rtt: chunk_rtt
	p: zx
	tile: zx
	mult: zx
	real: zx
	bound: aabb3
	boundscreen: aabb3

	array: Obj[][][]

	rekt: Rekt
	outline: Rekt

	constructor(x, y, private master: chunk_master<chunk>) {
		const colors = ['lightsalmon', 'khaki', 'lightgreen', 'paleturquoise', 'plum', 'pink'];

		this.objs = new chunk_objs(this);
		//this.color = Egyt.sample(colors);
		this.p = [x, y];
		this.group = new Group;

		this.set_bounds();
	}

	set_bounds() {
		let x = this.p[0];
		let y = this.p[1];

		let p1 = points.multp([x + 1, y, 0], this.master.span * 24);
		this.tile = <zx>[...p1];
		points.subtract(p1, [24, 0]);
		this.mult = p1;

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
	show() {
		let rekt = new Rekt({
			//istile: true,
			xy: this.mult,
			wh: [this.master.width, this.master.height],
			asset: 'egyt/tenbyten',
			color: Egyt.sample(['red', 'blue'])
		});

		rekt.initiate();
		rekt.mesh.renderOrder = -9999;
	}
	comes() {
		if (!this.on && !this.empty()) {
			this.show();
			ThreeQuarter.scene.add(this.group);
			this.objs.comes();
		}
		this.on = true;
	}
	goes() {
		if (this.on && !this.empty()) {
			ThreeQuarter.scene.remove(this.group);
			for (var i = this.group.children.length - 1; i >= 0; i--) {
				this.group.remove(this.group.children[i]);
			}
			this.objs.goes();
		}
		this.on = false;
	}
	sec() {
		return Egyt.game.view.intersect(this.boundscreen);
	}
	see() {
		return this.sec() != aabb3.SEC.OUT;
	}
	update() {
		return;
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
	}
	remove(obj: Obj) {
		let i = this.indexOf(obj);
		if (i > -1)
			this.objs.splice(i, 1);
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

	turns: number
	total: number

	shown: T[] = []

	constructor(private master: chunk_master<T>) {
	}

	update() {
		let middle = Egyt.map2.query_world_pixel(<zx>[...Egyt.game.view.center()]).tile;

		let b = this.master.big(middle);

		this.turns = 0;
		this.total = 0;
		
		this.snake(b, 1);
		this.snake(b, -1);

		let i = this.shown.length;
		while (i--) {
			let c = this.shown[i];
			c.update();
			if (!c.see()) {
				c.goes();
				this.shown.splice(i, 1);
			}
		}
	}
	snake(b: zx, n: number = 1) {
		let i = 0;
		let x = b[0], y = b[1];
		let stage = 0;
		let s = 0;
		let u = 0;
		while (true) {
			i++;
			let c = this.master.guarantee(x, y);
			if (s > 2 && c.sec() == aabb3.SEC.OUT) {
				if (stage == 0) stage = 1;
				if (stage == 2) stage = 3;
			}
			if (!c.see())
				u++;
			else {
				u = 0;
				if (!c.on && !c.empty())
					this.shown.push(c);
				c.comes();
			}
			switch (stage) {
				case 0:
					x += n;
					y += n;
					s++;
					break;
				case 1:
					y -= n;
					stage = 2;
					s = 0;
					break;
				case 2:
					x -= n;
					y -= n;
					s++;
					break;
				case 3:
					y -= n;
					stage = 0;
					s = 0;
					break;
			}
			if (!s)
				this.turns++;
			this.total++;
			if (u > 5 || i >= 300) {
				//console.log('break at iteration', i);

				break;
			}
		}
	}

}

class chunk_rtt {
	readonly padding = Egyt.YUM * 2;
	readonly w: number
	readonly h: number

	target: WebGLRenderTarget

	constructor(private master: chunk_master<chunk>) {
		this.w = this.master.width + this.padding;
		this.h = this.master.height + this.padding;
	}

	readyup() {
		if (this.target)
			return;

		this.target = new WebGLRenderTarget(
			this.w, this.h,
			{
				minFilter: NearestFilter,
				magFilter: NearestFilter,
				format: RGBAFormat
			});
	}
}

class Map2 {
	static rig() {
		return new Map2;
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

		this.mark.initiate();
		this.mark.mesh.renderOrder = 999;
		this.mark.dontOrder = true;
	}

	init() {
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

		granary.initiate();
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

		Win.win.find('#chunk').text(`Chunk: ${points.string(this.statmaster.big(Egyt.game.pos))}`);
		Win.win.find('#gamePos').text(`Game pos: ${points.string(Egyt.game.pos)}`);

		let worldPixelsLeftUpperCorner = [Egyt.game.view.min[0], Egyt.game.view.max[1]] as zx;
		let worldPixelsRightLowerCorner = [Egyt.game.view.max[0], Egyt.game.view.min[1]] as zx;

		const x = this.query_world_pixel(worldPixelsLeftUpperCorner).tile;
		const y = this.query_world_pixel(worldPixelsRightLowerCorner).tile;

	}
}

export { Map2, chunk, chunk_master, chunk_fitter, chunk_objs }