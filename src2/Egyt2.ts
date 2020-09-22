import { tq, THREE } from "./lib/tq";

import App from "./lib/App";

import Rekt from "./objrekt/Rekt";
import Obj from "./objrekt/Obj";

import Selection from "./nested/Selection";
import { Object3D, Mesh, PlaneBufferGeometry, MeshBasicMaterial } from "three";
import { aabb2 } from "./lib/AABB";
import pts from "./lib/Pts";
import { Win } from "./lib/Board";
import Lumber from "./Lumber";



class Game {
	rekts: Rekt[]
	objs: Obj[]

	selection: Selection | null

	pos: vec2
	scale: number
	dpi: number

	focal: zxc
	view: aabb2
	frustum: Rekt

	static rig() {
		return new Game();
	}

	constructor() {
		console.log('Game');

		this.rekts = [];
		this.objs = [];

		this.pos = [0, 0];
		this.dpi = 1;//tq.ndpi;
		this.scale = 1;// / this.dpi;

		this.view = new aabb2([0, 0]);

		let rekt = this.frustum = new Rekt;
		rekt.name = 'Frustum';
		rekt.tile = [0, 0];
		rekt.wh = [1, 1];
		rekt.asset = 'egyt/128';

		this.frustum.plain = true; // dont 2:1

		this.frustum.use();
		this.frustum.mesh.renderOrder = 9999999;
		this.frustum.material.wireframe = true;
	}

	update() {

		this.sels();

		let speed = 5;
		const factor = 1 / this.dpi;

		let p = [...this.pos];

		if (App.map['x']) speed *= 10;

		if (App.map['w']) p[1] -= speed;
		if (App.map['s']) p[1] += speed;
		if (App.map['a']) p[0] += speed;
		if (App.map['d']) p[0] -= speed;

		this.pos = <vec2>[...p];

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

		let p2 = pts.mult(this.pos, this.scale);

		tq.scene.position.set(p2[0], p2[1], 0);


		let w = window.innerWidth // tq.target.width;
		let h = window.innerHeight // tq.target.height;

		//console.log(`tq target ${w} x ${h}`)

		let w2 = w / this.dpi / this.scale;
		let h2 = h / this.dpi / this.scale;

		this.view = new aabb2(
			[-p[0] - w2 / 2, -p[1] - h2 / 2],
			[-p[0] + w2 / 2, -p[1] + h2 / 2]
		);
		this.view.min = pts.floor(this.view.min);
		this.view.max = pts.floor(this.view.max);

		this.focal = [-p[0], -p[1], 0];

		//return;

		this.frustum.mesh.scale.set(w2, h2, 1);
		//this.frustumRekt.tile = <vec2><unknown>this.focal;
		this.frustum.now_update_pos();
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