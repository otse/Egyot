import { ThreeQuarter, THREE } from "./ThreeQuarter";

import App from "./App";

import Rekt from "./Nieuw mapje/Rekt";
import Obj from "./Nieuw mapje/Obj";

import Selection from "./Nieuw mapje 5/Selection";
import { Object3D } from "three";

export var game;

export const Fiftytwo = 52

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

export namespace Maths {

	export function Multp(zx: Zx | Zxc, n: number, n2?: number) {
		zx[0] *= n;
		zx[1] *= n2 || n;
		return zx;
	}

	export function MultpClone(zx: Zx | Zxc, n: number, n2?: number): number[] {
		let wen = [...zx] as Zx;

		Multp(wen, n, n2);

		return wen;
	}

	export function Subtr(a: Zx | Zxc, b: Zx | Zxc) {
		a[0] -= b[0];
		a[1] -= b[1];
		return a;
	}

	export function SubtrClone(a: Zx | Zxc, b: Zx | Zxc): number[] {
		let wen = [...a] as Zx;

		Subtr(wen, b);

		return wen;
	}

	export function Divide(a: Zx | Zxc, n: number) {
		a[0] /= n;
		a[1] /= n;
		return a;
	}

	export function DivideClone(a: Zx | Zxc, n: number) {
		let wen = [...a] as Zx;

		Divide(wen, n);

		return wen;
	}

	export function Abs(p: Zx) {
		p[0] = Math.abs(p[0]);
		p[1] = Math.abs(p[1]);
		return p;
	}

	export function Together(p: Zx) {
		//Abs(p);
		return p[0] + p[1];
	}

}

class Game {
	rekts: Rekt[]
	objs: Obj[]

	selection: Selection | null

	pos: Zxc
	scale: number
	scaleRange: [number, number]

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
		this.scale = 1 / window.devicePixelRatio;

		this.scaleRange = [0.25, 4];
	}

	update() {

		this.sels();

		//let pos = [...this.pos];
		//let scale = this.scale;

		let speed = 5;
		const factor = 1 / window.devicePixelRatio;

		let p = [...this.pos] as Zxc;

		if (App.map['x'])
			speed *= 10;

		if (App.map['w'] || App.map['W'])
			p[1] -= speed;

		if (App.map['s'] || App.map['S'])
			p[1] += speed;

		if (App.map['a'] || App.map['A'])
			p[0] += speed;

		if (App.map['d'] || App.map['D'])
			p[0] -= speed;

		this.pos = p as Zxc;

		let oldScale = this.scale;

		if (App.wheel > 0) {
			this.scale += factor;
			if (this.scale > 5 / window.devicePixelRatio)
				this.scale = 5 / window.devicePixelRatio;
			console.log('scale is', this.scale);
		}

		else if (App.wheel < 0) {
			this.scale -= factor;
			if (this.scale < .5)
				this.scale = .5;
		}
		
		if (oldScale != this.scale) {
			console.log('multiply coords to scale?');
			
			//this.pos[0] *= this.scale;
			//this.pos[1] *= this.scale;
			//ThreeQuarter.camera.zoom = this.scale;
			//ThreeQuarter.camera.updateProjectionMatrix();
		}

		ThreeQuarter.scene.scale.set(this.scale, this.scale, 1);

		let p2 = Maths.MultpClone(p, this.scale);

		ThreeQuarter.scene.position.set(p2[0], p2[1], 0);
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