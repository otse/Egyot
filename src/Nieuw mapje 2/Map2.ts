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
import { Color } from "three";


declare class sobj {

}

class chunk {
	color
	on = false

	objs: chunk_objs
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
		this.objs = new chunk_objs(this);
		this.color = 'white';
		this.p = [x, y];

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
			[
				x * this.master.span,
				y * this.master.span, 0],
			[
				(x + 1) * this.master.span,
				(y + 1) * this.master.span, 0]);


		let real = [...points.twoone(<zxc>[...p1]), 0] as zxc;
		points.subtract(real, [0, -this.master.height / 2]);
		this.real = <zx>[...real];

		this.boundscreen = new aabb3(
			<zxc>points.add(<zxc>[...real], [-this.master.width / 2, -this.master.height / 2, 0]),
			<zxc>points.add(<zxc>[...real], [this.master.width / 2, this.master.height / 2, 0])
		)
	}

	made = false
	make_it() {
		if (this.made)
			return;
		this.made = true;
		let x = this.p[0];
		let y = this.p[1];

		this.outline = new Rekt({
			xy: <zxc>[...this.real, 0],
			wh: [this.master.width, this.master.height],
			asset: 'egyt/128',
			color: this.color

		});

		this.outline.noDimetricization = true;
		this.outline.initiate();
		this.outline.mesh.renderOrder = -999;
		this.outline.material.wireframe = true;

		this.rekt = new Rekt({
			xy: <zxc>[...this.mult, 0],
			wh: [this.master.width, this.master.height],
			asset: 'egyt/tenbyten',
			color: this.color
		})

		this.rekt.initiate();

		//const colors = ['pink', 'red', 'magenta', 'orange'];
		const colors = ['springgreen', 'peachpuff', 'coral', 'salmon', 'thistle'];

		this.rekt.mesh.renderOrder = -1000;
		this.rekt.material.color.set(Egyt.sample(colors));
	}

	notempty() {
		return this.objs.many() > 0;
	}
	comes() {
		if (this.on)
			return;
		this.on = true;
		this.objs.comes();
		if (this.notempty())
			this.make_it();
	}
	goes() {
		if (!this.on)
			return;
		this.on = false;
		this.objs.goes();
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
		else
			console.warn('add');

	}
	remove(obj: Obj) {
		let i = this.indexOf(obj);
		if (i > -1)
			this.objs.splice(i, 1);
		else
			console.warn('remove');
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

	shown: T[] = []

	constructor(private master: chunk_master<T>) {
		this.master = master;
	}

	update() {
		let middle = Egyt.map2.query_world_pixel(<zx>[...Egyt.game.view.center()]).tile;

		let b = this.master.big(middle);

		this.snake(b, 1, 1);
		this.snake(b, -1, -1);

		let i = this.shown.length;
		while (i--) {
			let c = this.shown[i];
			if (!c.see()) {
				c.goes();
				this.shown.splice(i, 1);
			}
		}
	}
	snake(b: zx, n: number = 1, m: number = -1) {
		let i = 0;
		let x = b[0], y = b[1];
		let stage = 0;
		let s = 0;

		while (true) {
			i++;
			switch (stage) {
				case 0:
					x += n;
					y += n;
					s++;
					break;
				case 1:
					y -= m;
					stage = 2;
					s = 0;
					break;
				case 2:
					x -= m;
					y -= m;
					s++;
					break;
				case 3:
					y -= m;
					stage = 0;
					s = 0;
					break;
			}
			let c = this.master.guarantee(x, y);
			if (c) {

				if (s > 2 && c.sec() == aabb3.SEC.OUT) {
					if (stage == 0) stage = 1;
					if (stage == 2) stage = 3;
				}
				if (c.see()) {
					c.comes();
					if (c.notempty())
						this.shown.push(c);
				}
			}
			if (i >= 200)
				break;
		}
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

		/*this.statmaster.which([0, 0]);
		this.statmaster.which([1, 1]);
		this.statmaster.which([1, 2]);
		this.statmaster.which([2, 3]);
		this.statmaster.which([2, 21]);*/

		this.mouse_tile = [0, 0];

		this.mark = new Rekt({
			xy: [0, 0, 0],
			wh: [22, 25],
			asset: 'egyt/iceblock'
		});

		this.mark.initiate();
		this.mark.mesh.renderOrder = 999;
		this.mark.dontOrder = true;
	}

	init() {
		let tinybarn = new Rekt({
			xy: points.multp([0, -1, 0], 24),
			wh: [192, 156],
			asset: 'egyt/building/tinybarn'
		});

		let tobaccoshop = new Rekt({
			xy: points.multp([-14, -10, 0], 24),
			wh: [144, 144],
			asset: 'egyt/building/redstore'
		});

		Agriculture.plop_wheat_area(1, new aabb3([-9, -4, 0], [2, -6, 0]));
		Agriculture.plop_wheat_area(2, new aabb3([-9, -8, 0], [2, -10, 0]));
		Agriculture.plop_wheat_area(2, new aabb3([-9, -12, 0], [2, -14, 0]));
		Agriculture.plop_wheat_area(3, new aabb3([-9, -16, 0], [2, -50, 0]));
		Agriculture.plop_wheat_area(3, new aabb3([-9, -52, 0], [2, -300, 0]));

		tinybarn.initiate();
		tobaccoshop.initiate();
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

		this.mark.struct.xy = <zxc>[...mouse.mult, 0];
		this.mark.now_update_pos();

		Win.win.find('#mouseTile').text(`World square: ${points.string(mouse.tile)}`);
		Win.win.find('#worldSquareChunk').text(`World square chunk: ${points.string(this.statmaster.big(mouse.tile))}`);

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

		Win.win.find('#leftUpperCornerTile').text(`Left upper corner tile: ${points.string(x)}`);
		Win.win.find('#rightLowerCornerTile').text(`Right lower corner tile: ${points.string(y)}`);

	}
}

export { Map2 }