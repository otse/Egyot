import Rekt from "../Nieuw mapje/Rekt";
import { Win } from "../Win";
import Egyt from "../Egyt";
import App from "../App";
import points from "../Zxcvs";
import Forestation from "../Nieuw mapje 3/Forestation";
import Agriculture from "../Nieuw mapje 3/Agriculture";
import { aabb3 } from "../Bound";
import Obj from "../Nieuw mapje/Obj";


declare class sobj {

}

class chunk {
	p: zx
	bound: aabb3
	boundscreen: aabb3
	array: Obj[][][]
	rekt: Rekt

	constructor(x, y, master) {
		this.p = [x, y];

		let pos = points.multp([x, y, 0], master.span * 24);

		this.bound = new aabb3(
			[
				x * master.span,
				y * master.span, 0],
			[
				(x + 1) * master.span,
				(y + 1) * master.span, 0]);

		this.boundscreen = new aabb3(
			pos, <zxc>points.add(<zxc>[...pos], [master.span * 24, master.span * 12])
		)

		//Agriculture.plop_wheat_area(3, this.bound);

		console.log('schunk', x, y);

		this.rekt = new Rekt({
			pos: pos,
			dim: [master.span * 24, master.span * 12],
			asset: 'egyt/tenbyten'
		})

		this.rekt.initiate();

		const colors = ['pink', 'red', 'magenta', 'orange']

		this.rekt.mesh.renderOrder = -1;
		this.rekt.material.color.set(Egyt.sample(colors));

	}

	add(any: any) {

	}

	remove(any: any) {
		//
	}

	vis(view: aabb3) {
		return this.boundscreen.intersect(view) != aabb3.SEC.OUT;
	}

}

class statchunk extends chunk {

}

class dynchunk extends chunk {

}

class chunk_master<T extends chunk> {
	readonly span: number

	arrays: T | null[][] = []

	fitter: chunk_fitter<T>

	constructor(private testType: new (x, y, m) => T, span: number) {
		this.span = span;

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
		this.at(x, y);
		let c = this.arrays[y][x] = new this.testType(x, y, this);
		return c;
	}

	which(t: zx): T {
		let b = this.big(t);
		let c = this.at(b[0], b[1]) || this.make(b[0], b[1])
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
		
		let c = this.master.which([2, 21]);
		this.queued.push(c);
	}

	update() {
		const view = Egyt.game.view;

		let topleft = view.min;
	}

}

class Map2 {
	static rig() {
		return new Map2;
	}

	statmaster: chunk_master<statchunk>
	dynmaster: chunk_master<dynchunk>

	statchunk: statchunk
	mouse: zxc
	mark: Rekt

	constructor() {

		(window as any).schunk = chunk;

		this.statmaster = new chunk_master<statchunk>(statchunk, 20);

		this.dynmaster = new chunk_master<dynchunk>(dynchunk, 20);

		this.statmaster.which([0, 0]);
		this.statmaster.which([1, 1]);
		this.statmaster.which([1, 2]);
		this.statmaster.which([2, 3]);
		this.statmaster.which([2, 21]);

		this.mouse = [0, 0, 0];

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

	world_pixels_to_tile(query: zx): zx {

		let p = query;

		// 2:1 correction
		let m2 = points.clone(p) as zx;
		p[0] = m2[0] - m2[1] * 2;
		p[1] = m2[1] * 2 + m2[0];

		let p2 = [...p] as zx;
		points.divide(p2, 24);
		points.floor(p2);
		let p3 = [...p2] as zx;
		points.multp(p2, 24);

		return p3;
	}

	mark_mouse() {

		let m = [...App.move] as zx;
		m[1] = -m[1];
		points.divide(m, Egyt.game.scale);

		let p = [Egyt.game.view.min[0], Egyt.game.view.max[1]] as zx;
		points.add(p, m);

		// 2:1 correction
		let m2 = points.clone(p) as zx;
		p[0] = m2[0] - m2[1] * 2;
		p[1] = m2[1] * 2 + m2[0];

		let p2 = [...p] as zx;
		points.divide(p2, 24);
		points.floor(p2);
		let p3 = [...p2] as zx;
		points.multp(p2, 24);

		this.mouse = [...p2, 0] as zxc;

		this.mark.struct.pos = [...p2, 0] as zxc;
		this.mark.set_pos(0, 0);

		Win.win.find('#mouseTile').text(`World square: ${points.string(p3)}`);
		Win.win.find('#worldSquareChunk').text(`World square chunk: ${points.string(this.statmaster.big(p3))}`);

	}

	update() {
		this.mark_mouse();

		this.statmaster.update();

		Win.win.find('#chunk').text(`Chunk: ${points.string(this.statmaster.big(Egyt.game.pos))}`);
		Win.win.find('#gamePos').text(`Game pos: ${points.string(Egyt.game.pos)}`);

		let worldPixelsLeftUpperCorner = [Egyt.game.view.min[0], Egyt.game.view.max[1]] as zx;
		let worldPixelsRightLowerCorner = [Egyt.game.view.max[0], Egyt.game.view.min[1]] as zx;

		const x = this.world_pixels_to_tile(worldPixelsLeftUpperCorner);
		const y = this.world_pixels_to_tile(worldPixelsRightLowerCorner);
		
		Win.win.find('#leftUpperCornerTile').text(`Left upper corner tile: ${x[0]}, ${x[1]}`);
		Win.win.find('#rightLowerCornerTile').text(`Right lower corner tile: ${y[0]}, ${y[1]}`);

	}
}

export { Map2 }