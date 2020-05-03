import Rekt from "../Nieuw mapje/Rekt";
import Forestation from "../Nieuw mapje 3/Forestation";
import { NUI } from "../NUI";
import Egyt from "../Egyt";
import App from "../App";
import Zxcvs from "../Zxcvs";

class Map2 {
	static rig() {
		return new Map2;
	}

	mark: Rekt
	mark_tell: NUI.Watch

	constructor() {

		this.mark_tell = NUI.watch('');
		
		this.mark = new Rekt({
			pos: [0, 0, 0],
			dim: [22, 25],
			asset: 'egyt/iceblock'
		});
		
		this.mark.initiate();
		this.mark.mesh.renderOrder = 2;
		
		let tinybarn = new Rekt({
			pos: [0, 0, 0],
			dim: [162, 137],
			asset: 'egyt/tinybarn'
		});
		
		tinybarn.initiate();
		
		Forestation.place_tree(Zxcvs.multp([10, 0, 0], Egyt.MAGIC_ED) as Zxc);
	}
	
	mark_mouse() {
		/*let p = [...App.move] as Zx;
		p[1] = -p[1];

		let p2 = [...Egyt.game.pos] as Zx;
		Zxcvs.inv(p2);

		Zxcvs.addit(p, p2);

		let p3 = Zxcvs.two_one(p);*/
		let p = [Egyt.game.aabb.min[0], Egyt.game.aabb.max[1]] as Zx;
		let m = [...App.move] as Zx;
		m[1] = -m[1];
		Zxcvs.div(m, Egyt.game.scale);
		Zxcvs.add(p, m);

		let p2 = [...p] as Zx;
		Zxcvs.div(p2, Egyt.MAGIC_ED);
		Zxcvs.floo(p2);
		Zxcvs.multp(p2, Egyt.MAGIC_ED);
		
		this.mark.stats.pos = [...p2, 0] as Zxc;
		this.mark.set_pos(0, 0);

		let s = Zxcvs.string(p);

		this.mark_tell.set_text(`mouse at world tile: ${s}`);

	}

	update() {
		this.mark_mouse();
	}
}

export { Map2 }