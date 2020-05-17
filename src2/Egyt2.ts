import { tq, THREE } from "./lib/tq";

import App from "./lib/App";

import Rekt from "./objrekt/Rekt";
import Obj from "./objrekt/Obj";

import Selection from "./nested/Selection";
import { Object3D, Mesh, PlaneBufferGeometry, MeshBasicMaterial } from "three";
import { aabb2 } from "./lib/AABB";
import points from "./lib/Points";
import { Win } from "./lib/Board";

class Game {
	rekts: Rekt[]
	objs: Obj[]

	selection: Selection | null

	pos: zxc
	scale: number
	dpi: number

	focal: zxc
	view: aabb2
	frustumRekt: Rekt

	static rig() {
		return new Game();
	}

	constructor() {
		console.log('Game');

		this.rekts = [];
		this.objs = [];

		this.pos = [0, 0, 0]; //[-1665, 3585, 0];
		this.dpi = window.devicePixelRatio;
		this.scale = 1 / this.dpi;

		this.view = new aabb2([0, 0]);

		this.frustumRekt = new Rekt({
			name: 'Frustum',
			xy: [0, 0],
			wh: [1, 1],
			asset: 'egyt/128'
		});

		this.frustumRekt.noDimetricization = true; // dont 2:1

		this.frustumRekt.use();
		this.frustumRekt.mesh.renderOrder = 9999999;
		this.frustumRekt.material.wireframe = true;
	}

	update() {

		this.sels();

		let speed = 5;
		const factor = 1 / this.dpi;

		let p = [...this.pos] as zxc;

		if (App.map['x']) speed *= 10;

		if (App.map['w'] || App.map['W']) p[1] -= speed;
		if (App.map['s'] || App.map['S']) p[1] += speed;
		if (App.map['a'] || App.map['A']) p[0] += speed;
		if (App.map['d'] || App.map['D']) p[0] -= speed;

		this.pos = [...p] as zxc;

		if (App.wheel > 0) {
			if (this.scale < 1) {
				this.scale = 1;
			}
			else {
				this.scale += factor;
			}
			if (this.scale > 2 / this.dpi)
				this.scale = 2 / this.dpi;

			console.log('scale up', this.scale);
		}

		else if (App.wheel < 0) {
			this.scale -= factor;
			if (this.scale < .5 / this.dpi)
				this.scale = .5 / this.dpi;

			console.log('scale down', this.scale);
		}

		tq.scene.scale.set(this.scale, this.scale, 1);

		let p2 = points.multpClone(p, this.scale);

		tq.scene.position.set(p2[0], p2[1], 0);


		let w = tq.target.width;
		let h = tq.target.height;

		let w2 = w / this.dpi / this.scale;
		let h2 = h / this.dpi / this.scale;

		this.view = new aabb2(
			[-p[0] - w2 / 2, -p[1] - h2 / 2],
			[-p[0] + w2 / 2, -p[1] + h2 / 2]
		);
		points.floor(this.view.min);
		points.floor(this.view.max);

		this.focal = [-p[0], -p[1], 0];

		return;

		this.frustumRekt.mesh.scale.set(w2, h2, 1);
		this.frustumRekt.struct.xy = <zx>[...this.focal];
		this.frustumRekt.now_update_pos();
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