import { aabb2 } from "./AABB";

namespace pts {

	export interface Pt { x: number; y: number };
	
	export function pt(a: vec2): Pt {
		return { x: a[0], y: a[1] };
	}

	export const clone = (zx: vec2): vec2 => <vec2>[...zx];

	export function make(n: number, m: number): vec2 {
		return [n, m];
	}

	export function area_every(bb: aabb2, callback: (pos: vec2) => any) {
		let y = bb.min[1];
		for (; y <= bb.max[1]; y++) {
			let x = bb.max[0];
			for (; x >= bb.min[0]; x--) {
				callback([x, y]);
			}
		}
	}

	export function project(a: vec2): vec2 {
		let copy = clone(a);
		
		copy[0] = a[0] / 2 + a[1] / 2;
		copy[1] = a[1] / 4 - a[0] / 4;
		return copy;
	}

	export function unproject(a: vec2): vec2 {
		let copy = clone(a);

		copy[0] = a[0] - a[1] * 2;
		copy[1] = a[1] * 2 + a[0];
		return copy;
	}

	export function to_string(a: vec2 | vec3 | vec4) {
		const pr = (b) => b != undefined ? `, ${b}` : '';

		return `${a[0]}, ${a[1]}` + pr(a[2]) + pr(a[3]);
	}

	export function floor(a: vec2) {
		let copy = clone(a);

		copy[0] = Math.floor(a[0]);
		copy[1] = Math.floor(a[1]);
		return copy;
	}

	export function ceil(a: vec2) {
		let copy = clone(a);

		copy[0] = Math.ceil(a[0]);
		copy[1] = Math.ceil(a[1]);
		return copy;
	}

	export function inv(a: vec2) {
		let copy = clone(a);

		copy[0] = -a[0];
		copy[1] = -a[1];
		return copy;
	}

	export function mult(a: vec2, n: number, n2?: number) {
		let copy = clone(a);

		copy[0] *= n;
		copy[1] *= n2 || n;
		return copy;
	}

	export function divide(a: vec2, n: number, n2?: number) {
		let copy = clone(a);

		copy[0] /= n;
		copy[1] /= n2 || n;
		return copy;
	}

	export function subtract(a: vec2, b: vec2) {
		let copy = clone(a);

		copy[0] -= b[0];
		copy[1] -= b[1];
		return copy;
	}

	export function add(a: vec2, b: vec2) {
		let copy = clone(a);

		copy[0] += b[0];
		copy[1] += b[1];
		return copy;
	}

	export function abs(a: vec2) {
		let copy = clone(a);

		copy[0] = Math.abs(a[0]);
		copy[1] = Math.abs(a[1]);
		return copy;
	}

	export function together(zx: vec2) {
		//Abs(p);
		return zx[0] + zx[1];
	}

}

export default pts;