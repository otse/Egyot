import { ThreeQuarter, THREE } from "./ThreeQuarter";

import App from "./App";

import Rekt from "./Nieuw mapje/Rekt";
import Obj from "./Nieuw mapje/Obj";

import Selection from "./Nieuw mapje 5/Selection";
import { Object3D, Mesh, PlaneBufferGeometry, MeshBasicMaterial } from "three";
import { aabb3 } from "./Bound";
import Zxcvs from "./Zxcvs";

export var game;

// todo, aweful
export namespace Areas {

	export function Loop(area: Zxcv, callback: (p: Zx) => any) {
		for (let x = area[0]; x < area[2] + area[0]; x++)
			for (let y = area[1]; y < area[3] + area[1]; y++)
				callback([x, y]);
	}

	export function Corner(a: Zxcv, p: Zx | Zxc): boolean {
		return (
			p[0] == a[0] && p[1] == a[1] ||
			p[0] == a[0] && p[1] == a[3] + a[1] - 1 ||
			p[0] == a[2] + a[0] - 1 && p[1] == a[3] + a[1] - 1 ||
			p[0] == a[2] + a[0] - 1 && p[1] == a[1]);
	}

	export function Border(a: Zxcv, p: Zx) {
		return (
			p[0] == a[0] ||
			p[1] == a[1] ||
			p[0] == a[2] + a[0] - 1 ||
			p[1] == a[3] + a[1] - 1);
	}

	export function NotBorder(a: Zxcv, p: Zx) {
		return !Border(a, p);
	}
}

class Game {
	rekts: Rekt[]
	objs: Obj[]

	selection: Selection | null

	pos: Zxc
	scale: number
	dpi: number

	focal: Zxc
	aabb: aabb3
	rekt: Rekt

	static init() {
		game = new Game();

		(window as any).game_ = game;
	}

	static update2() {
		game.update();
	}

	constructor() {
		console.log('Game');

		this.rekts = [];
		this.objs = [];

		this.pos = [-1665, 3585, 0];
		this.dpi = window.devicePixelRatio;
		this.scale = 1 / this.dpi;

		this.aabb = new aabb3([0, 0, 0]);

		this.rekt = new Rekt({
			name: 'Frustum',
			pos: [0, 0, 0],
			dim: [1, 1],
			asset: 'egyt/128'
		});

		this.rekt.dontFang = true; // dont 2:1

		this.rekt.initiate();
		this.rekt.mesh.renderOrder = 9999999;
		this.rekt.material.wireframe = true;
	}

	update() {

		this.sels();

		let speed = 5;
		const factor = 1 / this.dpi;

		let p = [...this.pos] as Zxc;

		if (App.map['x']) speed *= 10;

		if (App.map['w'] || App.map['W']) p[1] -= speed;
		if (App.map['s'] || App.map['S']) p[1] += speed;
		if (App.map['a'] || App.map['A']) p[0] += speed;
		if (App.map['d'] || App.map['D']) p[0] -= speed;

		this.pos = [...p] as Zxc;

		if (App.wheel > 0) {
			if (this.scale < 1) {
				this.scale = 1;
			}
			else {
				this.scale += factor;
			}
			if (this.scale > 4 / this.dpi)
				this.scale = 4 / this.dpi;

			console.log('scale up', this.scale);
		}

		else if (App.wheel < 0) {
			this.scale -= factor;
			if (this.scale < .5 / this.dpi)
				this.scale = .5 / this.dpi;

			console.log('scale down', this.scale);
		}

		ThreeQuarter.scene.scale.set(this.scale, this.scale, 1);

		let p2 = Zxcvs.MultpClone(p, this.scale);

		ThreeQuarter.scene.position.set(p2[0], p2[1], 0);

		this.focal = [-p[0], -p[1], 0];

		let w = ThreeQuarter.target.width;
		let h = ThreeQuarter.target.height;

		this.aabb = new aabb3(
			[-p[0] - (w / this.dpi / 2 / this.scale), -p[1] - (h / this.dpi / 2 / this.scale), 0],
			[-p[0] + (w / this.dpi / 2 / this.scale), -p[1] + (h / this.dpi / 2 / this.scale), 0]
		);

		this.rekt.mesh.scale.set(w / this.dpi / this.scale, h / this.dpi / this.scale, 1);
		this.rekt.stats.pos = this.focal;
		this.rekt.set_pos();
	}

	sels() {
		/*if (App.left) {
			if (!this.selection)
				this.selection = new Selection();

			let pos = [...App.move];

			pos[1] = window.innerHeight - pos[1];

			this.selection.Update(
				pos as Zx);
		}
		else if (this.selection) {
			this.selection.End();
			this.selection = null;
		}*/
	}
}

//function Std(ops: RektStat) {
//if (!ops.img) ops.img = '';
//}

export default Game;