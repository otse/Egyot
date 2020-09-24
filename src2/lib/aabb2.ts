import pts from "./pts";

enum TEST {
    Outside,
    Inside,
    Overlap
}

class aabb2 {
	static readonly TEST = TEST;
	min: vec2
	max: vec2
	static dupe(bb: aabb2) {
		return new aabb2(bb.min, bb.max);
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
	translate(v: vec2) {
		this.min = pts.add(this.min, v);
		this.max = pts.add(this.max, v);
	}
	test(v: aabb2) {
		if (this.min[0] <= v.min[0] && this.max[0] >= v.max[0] &&
			this.min[1] <= v.min[1] && this.max[1] >= v.max[1])
			return aabb2.TEST.Inside;
		if (this.max[0] < v.min[0] || this.min[0] > v.max[0] ||
			this.max[1] < v.min[1] || this.min[1] > v.max[1])
			return aabb2.TEST.Outside;
		return aabb2.TEST.Overlap;
	}
}

export default aabb2;