import Rekt from "../Nieuw mapje/Rekt";
import Egyt from "../Egyt";
import { aabb3 } from "../Bound";
import Obj from "../Nieuw mapje/Obj";
import App from "../App";
import Zxcvs from "../Zxcvs";

namespace Tilization {

	let plopping: Tile | null;

	const colors = [
		//'egyt/tilered',
		//'egyt/tilepink',
		'egyt/tileorange',
	]

	export class Tile extends Obj {

		rekt: Rekt

		constructor(asset, struct: Obj.Struct) {

			super(struct);

			this.rekt = new Rekt({
				asset: asset,
				istile: true,
				xy: this.struct.tile,
				wh: [22, 11],
			});

			this.rekt.initiate();
		}

		update() {
			if (plopping != this)
				return;

			let p = <zx>[...Egyt.map2.mouse_tile];

			this.struct.tile = p;

			this.rekt.struct.xy = <zx>[...p, 0];
			this.rekt.mult();

			this.rekt.now_update_pos();

			if (App.left)
				plopping = null;
		}
	}

	export function init() {
		console.log('tilization');

		(window as any).Tilization = Tilization;
	}

	export function update() {
		if (!plopping && App.map['y'] == 1) {
			plopping = place_tile(Egyt.sample(colors), Egyt.map2.mouse_tile);
		}
	}

	export function place_tile(asset, pos) {

		let tile = new Tile(asset, {
			tile: pos
		});

		Egyt.world.add(tile);

		return tile;
	}
	
	export function area_sample(assets: string[], aabb: aabb3) {
		const every = (pos: Zx) => place_tile(Egyt.sample(assets), pos);

		Zxcvs.area_every(aabb, every);
	}

	export function plop_tile_area(asset: string, aabb: aabb3) {
		const every = (pos: Zx) => place_tile(asset, pos);

		Zxcvs.area_every(aabb, every);
	}
}

export default Tilization;