import Obj from "../Nieuw mapje/Obj";
import Rekt from "../Nieuw mapje/Rekt";
import { Fiftytwo, Areas, Maths } from "../Game";

class Fence extends Obj {

	private rekt: Rekt

	readonly area: Zxcv

	post: boolean

	constructor(stats: Obj['stats'], area: Zxcv) {
		super(stats);

		this.area = area;
	}

	Make() {
		this.post = Areas.Corner(
			this.area, this.stats.pos);

		let flip =
			!this.post && this.stats.pos[1] == this.area[1] ||
			!this.post && this.stats.pos[1] == this.area[3] + this.area[1] - 1;

		let zxc = Maths.MultpClone(
			this.Pos(), Fiftytwo);

		if (this.post)

			this.rekt = new Rekt({
				name: 'Stone Fence',
				pos: zxc as Zxc,
				dim: [104, 104],
				asset: 'fence post'
			});

		else

			this.rekt = new Rekt({
				name: 'Stone Fence',
				pos: zxc as Zxc,
				dim: [52, 52],
				asset: 'fence',
				flip: flip
			});

		this.rekt.Make();

		let fiftytwo = new Rekt({
			name: 'Gray Tile',
			pos: zxc as Zxc,
			dim: [52, 26],
			asset: 'fiftytwo',
		});

		fiftytwo.Make();
		fiftytwo.mesh.renderOrder -= 2;
	}

}

export default Fence;