function min(a: zx, b: zx): zx {
	return [
		Math.min(a[0], b[0]),
		Math.min(a[1], b[1])];
}
function max(a: zx, b: zx): zx {
	return [
		Math.max(a[0], b[0]),
		Math.max(a[1], b[1])];
}
function remove(a: zx, b: zx): zx {
	return [
		a[0] - b[0],
		a[1] - b[1]];
}
function add(a: zx, b: zx): zx {
	return [
		a[0] + b[0],
		a[1] + b[1]];
}
function multiply(a: zx, f: number): zx {
	let x = a[0] * f;
	let y = a[1] * f;
	return [x, y];
}

class aabb2 {
	min: zx
	max: zx
	static dupe(a: aabb2) {
		let b = new aabb2(a.min, a.max);
		return b;
	}
	constructor(a: zx, b: zx | undefined = undefined) {
		this.min = this.max = a;
		if (b) {
			this.extend(b);
		}
	}
	extend(v: zx) {
		this.min = min(this.min, v) as zx;
		this.max = max(this.max, v) as zx;
	}
	diagonal(): zx {
		return remove(this.max, this.min);
	}
	center(): zx {
		return add(this.min, multiply(this.diagonal(), 0.5));
	}
	exponent(n: number) {
		this.min[0] *= n;
		this.min[1] *= n;
		//this.min[2] *= n;
		this.max[0] *= n;
		this.max[1] *= n;
		//this.max[2] *= n;
	}
	translate(v: zx) {
		add(this.min, v);
		add(this.max, v);
	}
	test(v: aabb2) {
		if (this.min[0] <= v.min[0] && this.max[0] >= v.max[0] &&
			this.min[1] <= v.min[1] && this.max[1] >= v.max[1] //&&
			/*this.min[2] <= v.min[2] && this.max[2] >= v.max[2]*/)
			return aabb2.IN;
		if (this.max[0] < v.min[0] || this.min[0] > v.max[0] ||
			this.max[1] < v.min[1] || this.min[1] > v.max[1] //||
				/*this.max[2] < v.min[2] || this.min[2] > v.max[2]*/)
			return aabb2.OOB;
		return aabb2.CROSS;
	}
	test_oob(v: aabb2) {
		if (this.max[0] < v.min[0] || this.min[0] > v.max[0] ||
			this.max[1] < v.min[1] || this.min[1] > v.max[1] //||
														/*this.max[2] < v.min[2] || this.min[2] > v.max[2]*/)
			return aabb2.OOB;
		if (this.min[0] <= v.min[0] && this.max[0] >= v.max[0] &&
			this.min[1] <= v.min[1] && this.max[1] >= v.max[1] //&&
														/*this.min[2] <= v.min[2] && this.max[2] >= v.max[2]*/)
			return aabb2.IN;
		return aabb2.CROSS;
	}
}

namespace aabb2 {

	export const OOB = 0;
	export const IN = 1;
	export const CROSS = 2;

	//export enum TEST {
	//	OOB,
	//	IN,
	//	CROSS,
	//}

}

export { aabb2 };