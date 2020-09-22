import Rekt from "../../objrekt/Rekt";
import Lumber from "../../Lumber";
import { aabb2 } from "../../lib/aabb";
import Obj from "../../objrekt/Obj";
import App from "../../lib/App";
import pts from "../../lib/Pts";
import { Map } from "../Map";
import { World } from "../World";

namespace Tilization {

	let plopping: Tile | null;

	const colors = [
		//'egyt/tilered',
		//'egyt/tilepink',
		'egyt/tileorange',
	]

	export class Tile extends Obj {
		rekt: Rekt
		asset: string = 'egyt/ground/stone1'
		constructor(asset) {
			super();
			this.rtt = false;
		}
		finish() {
			let rekt = this.rekt = new Rekt;
			rekt.obj = this;
			rekt.asset = this.asset;
			rekt.tile = this.tile;
			rekt.wh = [24, 12];
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
			if (Lumber.PAINT_OBJ_TICK_RATE)
				this.rekt.paint_alternate();
		}
		unset() {
			super.unset();
			this.rekt.unset();
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
			let middle = World.unproject(Lumber.game.view.center()).tiled;

			let b = this.master.big(middle);

			press = 1;
		}
	}

	export function place_tile(chance: number, asset: string, pos: vec2) {

		if (Math.random() > chance / 100)
			return;

		let tile = new Tile(asset);
		tile.tile = pos;
		tile.asset = asset;
		tile.finish();

		Lumber.world.add(tile);

		return tile;
	}

	export function click_area(asset: string, pos) {

	}

	export function area_sample(chance: number, assets: string[], aabb: aabb2) {
		const every = (pos: zx) => place_tile(chance, Lumber.sample(assets), pos);

		pts.area_every(aabb, every);
	}

	export function area(chance: number, asset: string, aabb: aabb2) {
		const every = (pos: zx) => place_tile(chance, asset, pos);

		pts.area_every(aabb, every);
	}
}

export default Tilization;