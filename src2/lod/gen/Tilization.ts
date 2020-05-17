import Rekt from "../../objrekt/Rekt";
import Egyt from "../../Egyt";
import { aabb2 } from "../../lib/aabb";
import Obj from "../../objrekt/Obj";
import App from "../../lib/App";
import points from "../../lib/Points";

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
				wh: [24, 12],
			});
		}
		comes() {
			super.comes();
			this.rekt.use();
		}
		goes() {
			super.goes();
			this.rekt.unuse();
		}
		update() {
			if (plopping != this)
				return;

			let p = <zx>[...Egyt.map.mouse_tile];

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
			plopping = <Tile>place_tile(100, Egyt.sample(colors), Egyt.map.mouse_tile);
		}
	}

	export function place_tile(chance: number, asset: string, pos) {

		if (Math.random() > chance / 100)
			return;

		let tile = new Tile(asset, {
			tile: pos
		});

		Egyt.world.add(tile);

		return tile;
	}

	export function area_sample(chance: number, assets: string[], aabb: aabb2) {
		const every = (pos: zx) => place_tile(chance, Egyt.sample(assets), pos);

		points.area_every(aabb, every);
	}

	export function area(chance: number, asset: string, aabb: aabb2) {
		const every = (pos: zx) => place_tile(chance, asset, pos);

		points.area_every(aabb, every);
	}
}

export default Tilization;