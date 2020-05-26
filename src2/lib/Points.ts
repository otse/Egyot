import { aabb2 } from "./AABB";

namespace points {

	export const clone = (zx) => [...zx];

	export function area_every(aabb: aabb2, callback: (pos: zx) => any) {
		let y = aabb.min[1];
		for (; y <= aabb.max[1]; y++) {
			let x = aabb.max[0];
			for (; x >= aabb.min[0]; x--) {
				callback([x, y]);
			}
		}
	}

	export function two_one(p: zx | zxc) {
		let copy = clone(p);
		copy[0] = p[0] / 2 + p[1] / 2;
		copy[1] = p[1] / 4 - p[0] / 4;
		return copy;
	}

	export function un_two_one(p: zx | zxc): zx {
		let x = p[0] - p[1] * 2;
		let y = p[1] * 2 + p[0];
		return [x, y];
	}

	export function string(a: zx | zxc | zxcv) {
		const pr = (b) => b != undefined ? `, ${b}` : '';

		return `${a[0]}, ${a[1]}` + pr(a[2]) + pr(a[3]);
	}

	export function floor(a: zx | zxc) {
		a[0] = Math.floor(a[0]);
		a[1] = Math.floor(a[1]);
		if (a[2] != undefined) a[2] = Math.floor(a[2]);
		return a;
	}

	export function ceil(a: zx | zxc) {
		a[0] = Math.ceil(a[0]);
		a[1] = Math.ceil(a[1]);
		if (a[2] != undefined) a[2] = Math.ceil(a[2]);
		return a;
	}

	export function inv(a: zx | zxc) {
		a[0] = -a[0];
		a[1] = -a[1];
		return a;
	}

	export function multp(zx, n: number, n2?: number) {
		zx[0] *= n;
		zx[1] *= n2 || n;
		return zx;
	}

	export function divide(a: zx | zxc, n: number, n2?: number) {
		a[0] /= n;
		a[1] /= n2 || n;
		return a;
	}

	export function multpClone(zx: zx | zxc, n: number, n2?: number): number[] {
		let wen = [...zx] as zx;

		multp(wen, n, n2);

		return wen;
	}

	export function subtract(a: zx | zxc, b: zx | zxc) {
		a[0] -= b[0];
		a[1] -= b[1];
		return a;
	}

	export function add(a: zx, b: zx) {
		a[0] += b[0];
		a[1] += b[1];
		return a;
	}
	
	export function abs(p: zx) {
		p[0] = Math.abs(p[0]);
		p[1] = Math.abs(p[1]);
		return p;
	}

	export function together(p: zx) {
		//Abs(p);
		return p[0] + p[1];
	}

}

export default points;