import Rekt from "../Nieuw mapje/Rekt";
import Forestation from "../Nieuw mapje 3/Forestation";
import { Win } from "../Win";
import Egyt from "../Egyt";
import App from "../App";
import Zxcvs from "../Zxcvs";
import Agriculture from "../Nieuw mapje 3/Agriculture";
import { aabb3 } from "../Bound";

class Map2 {
	static rig() {
		return new Map2;
	}

	mouse: Zxc;
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
			pos: [0, -1, 0],
			dim: [192, 156], // 8 x 7
			asset: 'egyt/building/tinybarn'
		});

		let tobaccoshop = new Rekt({
			pos: Zxcvs.multp([-16, -10, 0], 24),
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
		
		let m = [...App.move] as Zx;
		m[1] = -m[1];
		Zxcvs.div(m, Egyt.game.scale);

		let p = [Egyt.game.aabb.min[0], Egyt.game.aabb.max[1]] as Zx;
		Zxcvs.add(p, m);

		// 2:1 correction
		let m2 = Zxcvs.clone(p) as Zx;
		p[0] = m2[0] - m2[1] * 2;
		p[1] = m2[1] * 2 + m2[0];
		
		let p2 = [...p] as Zx;
		Zxcvs.div(p2, 24);
		Zxcvs.floo(p2);
		let p3 = [...p2] as Zx;
		Zxcvs.multp(p2, 24);

		this.mouse = [...p2, 0] as Zxc;
		
		this.mark.struct.pos = [...p2, 0] as Zxc;
		this.mark.set_pos(0, 0);

		Win.win.find('#mouseTile').text(`World square: ${Zxcvs.string(p3)}`);

	}

	update() {
		this.mark_mouse();
	}
}

export { Map2 }