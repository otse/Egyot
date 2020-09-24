function min(a: vec2, b: vec2): vec2 { return [Math.min(a[0], b[0]), Math.min(a[1], b[1])]; }
function max(a: vec2, b: vec2): vec2 { return [Math.max(a[0], b[0]), Math.max(a[1], b[1])]; }
function remove(a: vec2, b: vec2): vec2 { return [a[0] - b[0], a[1] - b[1]]; }
function add(a: vec2, b: vec2): vec2 { return [a[0] + b[0], a[1] + b[1]]; }
function multiply(a: vec2, f: number): vec2 { let x = a[0] * f; let y = a[1] * f; return [x, y]; }

class aabb2 {
	min: vec2
	max: vec2
	static dupe(a: aabb2) {
		let b = new aabb2(a.min, a.max);
		return b;
	}
	constructor(a: vec2, b: vec2) {
		this.min = this.max = a;
		if (b) {
			this.extend(b);
		}
	}
	extend(v: vec2) {
		this.min = min(this.min, v);
		this.max = max(this.max, v);
	}
	diagonal(): vec2 {
		return remove(this.max, this.min);
	}
	center(): vec2 {
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
	translate(v: vec2) {
		add(this.min, v);
		add(this.max, v);
	}
	test(v: aabb2) {
		if (this.min[0] <= v.min[0] && this.max[0] >= v.max[0] &&
			this.min[1] <= v.min[1] && this.max[1] >= v.max[1])
			return aabb2.IN;
		if (this.max[0] < v.min[0] || this.min[0] > v.max[0] ||
			this.max[1] < v.min[1] || this.min[1] > v.max[1])
			return aabb2.OOB;
		return aabb2.CROSS;
	}
}

namespace aabb2 {
	export const OOB = 0;
	export const IN = 1;
	export const CROSS = 2;
}

export default aabb2;