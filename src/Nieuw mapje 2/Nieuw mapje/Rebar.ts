import Obj from "../../Nieuw mapje/Obj";
import Rekt from "../../Nieuw mapje/Rekt";

import { Fiftytwo, Areas, Maths } from "../../Game";

class Rebar extends Obj {

	private rekt: Rekt

	readonly area: Zxcv

	constructor(stats: Obj['stats'], area: Zxcv) {
		super(stats);

		this.area = area;
	}

	Make() {

		let pos = Maths.MultpClone(
            this.Pos(), Fiftytwo);
            
        this.rekt = new Rekt({
            name: 'Rebar Tile',
            pos: pos as Zxc,
            dim: [52, 26],
            asset: 'rebar'
        });

		this.rekt.Make();
	}

}

export default Rebar;