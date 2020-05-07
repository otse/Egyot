import { aabb3 } from "./Bound";

namespace Zxcvs {

	export function area_every(aabb: aabb3, callback: (pos: Zx) => any) {
		let y = aabb.min[1];
		for (; y <= aabb.max[1]; y++) {
			let x = aabb.max[0];
			for (; x >= aabb.min[0]; x--) {
				callback([x, y]);
			}
		}
	}

	export function two_one(p: Zx | Zxc) {
		let x = p[0] / 2 + p[1] / 2;
		let y = p[1] / 4 - p[0] / 4;

		//let w = d[0] / 2;
		//let h = d[1] / 2;

		return [x, y] as Zx;
	}
	export function string(a: Zx | Zxc | Zxcv) {
		const pr = (b) => b != undefined ? `, ${b}` : '';

		return `${a[0]}, ${a[1]}` + pr(a[2]) + pr(a[3]);
	}

	export function floo(a: Zx | Zxc) {
		a[0] = Math.floor(a[0]);
		a[1] = Math.floor(a[1]);
		if (a[2] != undefined) a[2] = Math.floor(a[2]);
		return a;
	}

	export function ceil(a: Zx | Zxc) {
		a[0] = Math.ceil(a[0]);
		a[1] = Math.ceil(a[1]);
		if (a[2] != undefined) a[2] = Math.ceil(a[2]);
		return a;
	}

	export function inv(a: Zx | Zxc) {
		a[0] = -a[0];
		a[1] = -a[1];
		return a;
	}

	export function multp(zx: Zx | Zxc, n: number, n2?: number) {
		zx[0] *= n;
		zx[1] *= n2 || n;
		return zx;
	}

	export function div(a: Zx | Zxc, n: number, n2?: number) {
		a[0] /= n;
		a[1] /= n2 || n;
		return a;
	}

	export function clone(zx) {
		return [...zx];
	}

	export function multpClone(zx: Zx | Zxc, n: number, n2?: number): number[] {
		let wen = [...zx] as Zx;

		multp(wen, n, n2);

		return wen;
	}

	export function subtr(a: Zx | Zxc, b: Zx | Zxc) {
		a[0] -= b[0];
		a[1] -= b[1];
		return a;
	}

	export function subtrClone(a: Zx | Zxc, b: Zx | Zxc): number[] {
		let wen = [...a] as Zx;

		subtr(wen, b);

		return wen;
	}

	export function add(a: Zx | Zxc, b: Zx | Zxc) {
		a[0] += b[0];
		a[1] += b[1];
		return a;
	}
	export function divideClone(a: Zx | Zxc, n: number) {
		let wen = [...a] as Zx;

		div(wen, n);

		return wen;
	}

	export function abs(p: Zx) {
		p[0] = Math.abs(p[0]);
		p[1] = Math.abs(p[1]);
		return p;
	}

	export function together(p: Zx) {
		//Abs(p);
		return p[0] + p[1];
	}

}

export default Zxcvs;