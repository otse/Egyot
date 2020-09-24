import pts from "./pts";

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
		this.min = pts.min(this.min, v);
		this.max = pts.max(this.max, v);
	}
	diagonal(): vec2 {
		return pts.subtract(this.max, this.min);
	}
	center(): vec2 {
		return pts.add(this.min, pts.mult(this.diagonal(), 0.5));
	}
	exponent(n: number) {
		this.min[0] *= n;
		this.min[1] *= n;
		this.max[0] *= n;
		this.max[1] *= n;
	}
	translate(v: vec2) {
		this.min = pts.add(this.min, v);
		this.max = pts.add(this.max, v);
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