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
	zx: zx
	bound: aabb3
	array: Obj[][][]
	grid: Rekt

	constructor(x, y) {
		this.zx = [x, y];
		this.bound = new aabb3(
			[
				x * schunk.span,
				y * schunk.span, 0],
			[
				x + 1 * schunk.span,
				y + 1 * schunk.span, 0]);
	}

	add(any: any) {
		this.array
	}

	remove(any: any) {
		//
	}

	dimension(p: zx): zx {
		let big = schunk.big(p);

		return big;
	}

	static big(p: zx | zxc): zx {
		let p2 = points.floor(points.divide(
			[...p] as zx, schunk.span)) as zx;

		return p2;
	}

	static whichnullable(p: zx): schunk | null {
		let b = schunk.big(p);
		let c = this.all[
			b[1]][b[0]] || null;
		return c;
	}

	static which(p: zx): schunk {
		let b = schunk.big(p);
		let c = this.all[
			b[1]][b[0]] || null;
		return c;
	}

}

namespace schunk {
	export const span = 100

	export var all: schunk[][]
}

class Map2 {
	static rig() {
		return new Map2;
	}

	schunk: schunk
	mouse: zxc;
	mark: Rekt;

	constructor() {

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

	}

	update() {
		this.mark_mouse();

		Win.win.find('#chunk').text(`Chunk: ${points.string(schunk.big(Egyt.game.pos))}`);
		Win.win.find('#gamePos').text(`Game pos: ${points.string(Egyt.game.pos)}`);

	}
}

export { Map2 }