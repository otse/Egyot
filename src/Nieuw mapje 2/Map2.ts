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

		this.bound = new aabb3(
			[
				x * master.span,
				y * master.span, 0],
			[
				(x + 1) * master.span,
				(y + 1) * master.span, 0]);

		this.boundscreen = new aabb3(
			[
				x * master.span,
				y * master.span, 0],
			[
				(x + 1) * master.span,
				(y + 1) * master.span, 0]);

		//Agriculture.plop_wheat_area(3, this.bound);

		console.log('schunk', x, y);

		this.rekt = new Rekt({
			pos: points.multp([x, y, 0], master.span * 24),
			dim: [240, 120],
			asset: 'egyt/tenbyten'
		})

		this.rekt.initiate();

		this.rekt.mesh.renderOrder = 1;

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

class schunk extends chunk {
	//constructor(x, y, master) {
	//	super(x, y, master);
	//}
}

class dchunk extends chunk {
	//constructor(x, y, master) {
	//	super(x, y, master);
	//}
}

class chunk_master<T extends chunk> {
	readonly span: number

	arrays: T | null[][] = []

	constructor(span: number, private testType: new (x, y, m) => T) {
		this.span = span;
	}

	big(t: zx | zxc): zx {
		return <zx>points.floor(points.divide(<zx>[...t], this.span));
	}

	at(x, y): T | null {
		if (this.arrays[y] == undefined)
			this.arrays[y] = [];
		return this.arrays[y][x];
	}

	make(x, y): T {
		this.at(x, y);
		return this.arrays[y][x] = new this.testType(x, y, this);
	}

	which(t: zx): T {
		let b = this.big(t);
		return this.at(b[0], b[1]) || this.make(b[0], b[1]);
	}

}

namespace chunk {
	//export const span = 10

	//export var arrays: chunk | null[][] = []
}

class Map2 {
	static rig() {
		return new Map2;
	}

	schunks: chunk_master<schunk>
	dchunks: chunk_master<dchunk>

	schunk: schunk
	mouse: zxc;
	mark: Rekt;

	constructor() {

		(window as any).schunk = chunk;

		this.schunks = new chunk_master<schunk>(10, schunk);
		this.dchunks = new chunk_master<dchunk>(20, dchunk);

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
			dim: [192, 156], // 8 x 7
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

		this.schunks.which([0, 0]);
		this.schunks.which([1, 1]);
		this.schunks.which([1, 2]);
		this.schunks.which([2, 3]);
		this.schunks.which([2, 12]);
	}

	mark_mouse() {

		let m = [...App.move] as zx;
		m[1] = -m[1];
		points.divide(m, Egyt.game.scale);

		let p = [Egyt.game.aabb.min[0], Egyt.game.aabb.max[1]] as zx;
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
		Win.win.find('#worldSquareChunk').text(`World square chunk: ${points.string(this.schunks.big(p3))}`);

	}

	update() {
		this.mark_mouse();

		Win.win.find('#chunk').text(`Chunk: ${points.string(this.schunks.big(Egyt.game.pos))}`);
		Win.win.find('#gamePos').text(`Game pos: ${points.string(Egyt.game.pos)}`);

	}
}

export { Map2 }