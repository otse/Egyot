import Rekt from "../Nieuw mapje/Rekt";
import { Win } from "../Win";
import Egyt from "../Egyt";
import App from "../App";
import points from "../Zxcvs";
import Forestation from "../Nieuw mapje 3/Forestation";
import Agriculture from "../Nieuw mapje 3/Agriculture";
import { aabb3 } from "../Bound";
import Obj from "../Nieuw mapje/Obj";

class Chunk {
	//array: Obj[][][]

}

// for unmoving things like grass
class schunk {
	p: zx
	bound: aabb3
	array: Obj[][][]
	rekt: Rekt

	constructor(x, y) {
		this.p = [x, y];
		this.bound = new aabb3(
			[x * schunk.span,
			y * schunk.span, 0],
			[(x + 1) * schunk.span,
			(y + 1) * schunk.span, 0]);

		//Agriculture.plop_wheat_area(3, this.bound);

		console.log('schunk', x, y);

		this.rekt = new Rekt({
			pos: points.multp([x, y, 0], schunk.span * 24),
			dim: [240, 120],
			asset: 'egyt/tenbyten'
		})

		this.rekt.initiate();

		this.rekt.mesh.renderOrder = 1;

	}

	add(any: any) {
		this.array
	}

	remove(any: any) {
		//
	}

	static fill(x, y) {
		if (!schunk._[y])
			schunk._[y] = [];
		if (!schunk._[y][x])
			schunk._[y][x] = null;
	}

	static big(tile: zx | zxc): zx {
		return <zx>points.floor(points.divide(<zx>[...tile], schunk.span));
	}

	static get2(x, y): schunk | null {
		schunk.fill(x, y);
		return schunk._[y][x];
	}

	static make2(x, y): schunk {
		return schunk._[y][x] = new schunk(x, y);
	}

	static whichnullable(p: zx): schunk | null {
		//let c = this.get(schunk.big(p));
		return null;
	}

	static which(tile: zx): schunk {
		let b, c, x, y;
		b = schunk.big(tile);
		x = b[0];
		y = b[1];
		return schunk.get2(x, y) || schunk.make2(x, y);
	}

}

namespace schunk {
	export const span = 10

	export var _: schunk | null[][] = []
}

class Map2 {
	static rig() {
		return new Map2;
	}

	schunk: schunk
	mouse: zxc;
	mark: Rekt;

	constructor() {

		(window as any).schunk = schunk;

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

		schunk.which([0, 0]);
		schunk.which([1, 1]);
		schunk.which([1, 2]);
		schunk.which([2, 3]);
		schunk.which([2, 12]);
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
		Win.win.find('#worldSquareChunk').text(`World square chunk: ${points.string(schunk.big(p3))}`);

	}

	update() {
		this.mark_mouse();

		Win.win.find('#chunk').text(`Chunk: ${points.string(schunk.big(Egyt.game.pos))}`);
		Win.win.find('#gamePos').text(`Game pos: ${points.string(Egyt.game.pos)}`);

	}
}

export { Map2 }