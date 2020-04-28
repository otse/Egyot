import { Maths, Fiftytwo } from "./Game";
import { Points } from "three";
import Rekt from "./Nieuw mapje/Rekt";

export class Map {

	constructor() {

		this.render_chunk(0, -7);
		//this.render_chunk(0, -8);
		//this.render_chunk(1, -7);
		//this.render_chunk(1, -8);
	}

	static rig() {
		return new Map();
	}

	update() {

	}

	render_chunk(a, b) {

		let cx = a;
		let cy = b;
		let ox = (b+1)*32-1;
		let oy = a*31;

		for (let y = 0; y < 32; y++) {
			for (let x = 0; x > -32; x--) {

				let chunk = `${cx}_${cy}`;
				
				let img = `egyt/low/${chunk}/${y+oy}_${x+ox}`;
				
				//console.log(img);
				
				let p = [y+(cx*31), x+((cy+7)*32), 0] as Zxc;
				//let p = [y+((cy+7)*32), x+(cx*32), 0] as Zxc;
				let pos = Maths.MultpClone(p, 128);

				let rekt = new Rekt({
					name: 'A Turf',
					pos: pos as Zxc,
					dim: [128, 128],
					asset: img
				});

				rekt.dontFang = true; // dont 2:1

				rekt.make();
			}

		}
		///this.rekt.mesh.renderOrder = -500;

		console.log('do_tiles');

	}

}