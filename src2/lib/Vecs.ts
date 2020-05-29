import { aabb2 } from "./AABB";

namespace vecs {

	export const clone = (zx: vec2): vec2 => <vec2>[...zx];

	export function area_every(bb: aabb2, callback: (pos: vec2) => any) {
		let y = bb.min[1];
		for (; y <= bb.max[1]; y++) {
			let x = bb.max[0];
			for (; x >= bb.min[0]; x--) {
				callback([x, y]);
			}
		}
	}

	export function project(p: vec2): vec2 {
		let copy = [...p];
		p[0] = copy[0] / 2 + copy[1] / 2;
		p[1] = copy[1] / 4 - copy[0] / 4;
		return p;
	}

	export function unproject(p: vec2): vec2 {
		let copy = [...p];
		p[0] = copy[0] - copy[1] * 2;
		p[1] = copy[1] * 2 + copy[0];
		return p;
	}

	export function to_string(a: vec2 | vec3 | vec4) {
		const pr = (b) => b != undefined ? `, ${b}` : '';

		return `${a[0]}, ${a[1]}` + pr(a[2]) + pr(a[3]);
	}

	export function floor(a: vec2) {
		a[0] = Math.floor(a[0]);
		a[1] = Math.floor(a[1]);
		return a;
	}

	export function ceil(a: vec2) {
		a[0] = Math.ceil(a[0]);
		a[1] = Math.ceil(a[1]);
		return a;
	}

	export function inv(a: vec2) {
		a[0] = -a[0];
		a[1] = -a[1];
		return a;
	}

	export function mult(zx: vec2, n: number, n2?: number) {
		zx[0] *= n;
		zx[1] *= n2 || n;
		return zx;
	}

	export function divide(a: vec2, n: number, n2?: number) {
		a[0] /= n;
		a[1] /= n2 || n;
		return a;
	}

	export function subtract(a: vec2, b: vec2) {
		a[0] -= b[0];
		a[1] -= b[1];
		return a;
	}

	export function add(a: vec2, b: vec2) {
		a[0] += b[0];
		a[1] += b[1];
		return a;
	}
	
	export function abs(zx: vec2) {
		zx[0] = Math.abs(zx[0]);
		zx[1] = Math.abs(zx[1]);
		return zx;
	}

	export function together(zx: vec2) {
		//Abs(p);
		return zx[0] + zx[1];
	}

}

export default vecs;