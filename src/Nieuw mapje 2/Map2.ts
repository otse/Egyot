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
	visible
	color

	objs: chunk_objs
	p: zx
	bound: aabb3
	boundscreen: aabb3

	array: Obj[][][]

	rekt: Rekt
	outline: Rekt

	constructor(x, y, master) {
		this.objs = new chunk_objs(this);
		this.visible = false;
		this.color = 'white';
		this.p = [x, y];

		let pos = points.multp([x + 1, y, 0], master.span * 24);
		points.subtract(pos, [24, 0]);

		this.bound = new aabb3(
			[
				x * master.span,
				y * master.span, 0],
			[
				(x + 1) * master.span,
				(y + 1) * master.span, 0]);


		let real = [...points.twoone(<zxc>[...pos]), 0] as zxc;
		points.subtract(real, [0, -master.span * 6]);

		this.boundscreen = new aabb3(
			<zxc>points.add(<zxc>[...real], [-master.span * 12, -master.span * 6, 0]),
			<zxc>points.add(<zxc>[...real], [master.span * 12, master.span * 6, 0])
		)

		this.outline = new Rekt({
			name: 'TileSwab Wire',
			pos: real,
			dim: [master.span * 24, master.span * 12],
			asset: 'egyt/128',
			color: this.color

		});

		this.outline.noDimetricization = true;
		this.outline.initiate();
		this.outline.mesh.renderOrder = -999;
		this.outline.material.wireframe = true;

		//Agriculture.plop_wheat_area(3, this.bound);

		console.log('schunk', x, y);

		this.rekt = new Rekt({
			pos: pos,
			dim: [master.span * 24, master.span * 12],
			asset: 'egyt/tenbyten',
			color: this.color
		})

		this.rekt.initiate();

		//const colors = ['pink', 'red', 'magenta', 'orange'];
		const colors = ['springgreen', 'peachpuff', 'coral', 'salmon', 'thistle'];

		this.rekt.mesh.renderOrder = -1000;
		this.rekt.material.color.set(Egyt.sample(colors));

	}

	manual_update() {
		this.rekt.material.color.set(this.color);
		this.rekt.material.needsUpdate = true;
	}

	sec() {
		return Egyt.game.view.intersect(this.boundscreen);
	}

	vis() {
		let sec = Egyt.game.view.intersect(this.boundscreen) != aabb3.SEC.OUT;

		if (sec && !this.visible) {
			this.visible = true;
			console.log('visible true');
		}
		else if (!sec && this.visible) {
			this.visible = false;
			console.log('visible false');
		}
		//console.log('vis', sec, 'for', Zxcvs.string(this.p));

		//this.outline.material.wireframe = !sec;// ? 'green' : 'red');
		this.outline.material.needsUpdate = true;

		return sec;
	}

}

class chunk_objs {
	constructor(private chunk: chunk) {

	}
	add(obj: Obj) {

	}

	remove(obj: Obj) {
		//
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
		if (this.arrays[y] == undefined)
			this.arrays[y] = [];
		let c = this.arrays[y][x];
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
		let c = this.at(b[0], b[1]) || this.make(b[0], b[1]);
		return c;
	}

	static probe<T>() {

	}

}

class chunk_fitter<T extends chunk> {

	master: chunk_master<T>
	queued: T[] = []

	constructor(master) {
		this.master = master;

		let c = this.master.which([5, 0]);
		let d = this.master.which([5, 21]);
		let e = this.master.which([-1, 0]);
		let f = this.master.make(-1, -2);
		/*c.color = 'gray';
		d.color = 'gray';
		e.color = 'gray';
		f.color = 'gray';
		c.manual_update();
		d.manual_update();
		e.manual_update();
		f.manual_update();*/
		this.queued.push(c);
		this.queued.push(d);
		this.queued.push(e);
		this.queued.push(f);
	}

	update() {
		// this.statmaster.big(mouse.tile);
		const view = Egyt.game.view;

		let middle = Egyt.map2.query_world_pixel([...view.center()] as zx).tile;
		let lefttop = Egyt.map2.query_world_pixel([Egyt.game.view.min[0], Egyt.game.view.max[1]]).tile;

		let b = this.master.big(middle);

		//let c = this.master.make(b[0], b[1]); // paints chunks with the screen
		//c.color = 'gray';
		//c.manual_update();

		this.snake(b, 1, -1);
		this.snake(b, -1, 1);
		//let c = this.master.make(1, 0);

		Win.win.find('#chunkFitter').text(`Chunk fitter: ${points.string(b)}`);

		for (let c of this.queued) {
			c.vis();
		}

	}

	snake(b: zx, n: number = 1, m: number = -1) {
		let i = 0;
		let j = 0;
		let x = b[0];
		let y = b[1];
		let stage = 0;

		while (true) {
			i++;
			switch (stage) {
				case 0:
					x += n;
					y += n;
					break;
				case 1:
					y += m;
					stage = 2;
					break;
				case 2:
					x += m;
					y += m;
					break;
				case 3:
					y += m;
					stage = 0;
					break;
			}
			let be;
			if (!this.master.at(x, y))
				be = 1;
			let c = this.master.at(x, y); // paints chunks with the screen
			if (c) {
				//if (be)
				//c.color = ['springgreen', 'peachpuff', 'coral', 'salmon', 'thistle'][Math.floor(Egyt.game.scale*2)];
				//c.manual_update();
				if (j + 2 < i && c.sec() == aabb3.SEC.OUT) {
					j = i;
					if (stage == 0)
						stage = 1;
					if (stage == 2)
						stage = 3;
					//c.color = 'green';
					//c.manual_update();
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
			pos: [0, 0, 0],
			dim: [22, 25],
			asset: 'egyt/iceblock'
		});

		this.mark.initiate();
		this.mark.mesh.renderOrder = 999;
		this.mark.dontOrder = true;

		let tinybarn = new Rekt({
			pos: points.multp([0, -1, 0], 24),
			dim: [192, 156],
			asset: 'egyt/building/tinybarn'
		});

		let tobaccoshop = new Rekt({
			pos: points.multp([-14, -10, 0], 24),
			dim: [144, 144],
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

		this.mark.struct.pos = <zxc>[...mouse.mult, 0];
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