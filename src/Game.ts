import { Two, THREE } from "./Two";

import App from "./App";

import Rekt from "./Nieuw mapje/Rekt";
import Obj from "./Nieuw mapje/Obj";

import Estate from "./Nieuw mapje 2/Estate";
import Turf from "./Nieuw mapje 3/Turf";
import Land from "./Nieuw mapje 3/Land";
import Selection from "./Nieuw mapje 5/Selection";

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

	static Init() {
		game = new Game();
		(window as any).game_ = game;
		game.LilTown();
		game.Turfs();
	}

	static Update2() {
		game.Update();
	}

	constructor() {
		console.log('Game');

		this.rekts = [];
		this.objs = [];

		this.pos = [0, 0, 0];
		this.scale = 1;

		this.scaleRange = [0.5, 2];
	}

	LilTown() {

		// Make Land Lots
		const every = (p: Zx) => {

			let pos = Maths.MultpClone(
				p, 20 + 5, 16 + 5);

			let zone = new Land({ pos: pos as Zx, dim: [20, 16] });

			console.log('New Land Lot');

			zone.Make();
		};

		Areas.Loop([0, 0, 2, 2], every);

		Two.changes = true;

		let estate = new Estate({
			name: "Brick House",
			pos: [0, 0],
			dim: [9, 9]
		}, null);

		let estate2 = new Estate({
			name: "Soup Kitchen",
			pos: [9, 0],
			dim: [11, 12]
		}, null);

		let estate3 = new Estate({
			name: "Soup Kitchen",
			pos: [0, 9],
			dim: [9, 7]
		}, null);

		estate.Make();
		estate2.Make();
		estate3.Make();

	}

	Turfs() {
		let area: Zxcv = [-5, -5, 10, 10];

		const every = (p: Zx) => {
			let turf = new Turf({
				pos: [...p, 0] as Zxc
			});

			turf.Make();
		}

		Areas.Loop(area, every);
	}

	Update() {

		this.Selections();

		let pos = [...this.pos];
		let scale = this.scale;

		const speed = 5;
		const add = .5;

		if (App.map['w'] || App.map['W'])
			this.pos[1] -= speed;
		if (App.map['s'] || App.map['S'])
			this.pos[1] += speed;
		if (App.map['a'] || App.map['A'])
			this.pos[0] += speed;
		if (App.map['d'] || App.map['D'])
			this.pos[0] -= speed;

		if (App.wheel > 0)
			this.scale += add;
		else if (App.wheel < 0)
			this.scale -= add;

		if (pos[0] != this.pos[0] ||
			pos[1] != this.pos[1] ||
			scale != this.scale) {
			Two.changes = true;
		}

		this.scale = Math.max(
			this.scaleRange[0], Math.min(
				this.scale, this.scaleRange[1]));

		Two.scene.scale.set(this.scale, this.scale, 1);

		Two.scene.position.set(this.pos[0], this.pos[1], this.pos[2]);
	}

	Selections() {
		if (App.left) {
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
		}
	}
}

//function Std(ops: RektStat) {
//if (!ops.img) ops.img = '';
//}

export default Game;