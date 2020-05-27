import Rekt from "../../objrekt/Rekt";
import Egyt from "../../Egyt";
import { aabb2 } from "../../lib/aabb";
import Obj from "../../objrekt/Obj";
import App from "../../lib/App";
import vecs from "../../lib/Vecs";

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
				tiled: true,
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

		}
	}

	export function init() {
		console.log('tilization');

		(window as any).Tilization = Tilization;
	}

	let press;
	let release;

	export function update() {

		if (App.map['escape'] == 1) {
			press = undefined;
		}

		if (App.map['u'] == 1) {
			let middle = Egyt.map.unproject(Egyt.game.view.center()).tile;

			let b = this.master.big(middle);

			press = 1;

			console.log('woo');
		}
	}

	export function place_tile(chance: number, asset: string, pos) {

		if (Math.random() > chance / 100)
			return;

		let tile = new Tile(asset, {
			tile: pos
		});

		//Egyt.world.add(tile);

		return tile;
	}

	export function click_area(asset: string, pos) {

	}

	export function area_sample(chance: number, assets: string[], aabb: aabb2) {
		const every = (pos: zx) => place_tile(chance, Egyt.sample(assets), pos);

		vecs.area_every(aabb, every);
	}

	export function area(chance: number, asset: string, aabb: aabb2) {
		const every = (pos: zx) => place_tile(chance, asset, pos);

		vecs.area_every(aabb, every);
	}
}

export default Tilization;