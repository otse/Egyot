function min3(a, b) {
	return [
		Math.min(a[0], b[0]),
		Math.min(a[1], b[1]),
		Math.min(a[2], b[2])];
}

function max3(a, b) {
	return [
		Math.max(a[0], b[0]),
		Math.max(a[1], b[1]),
		Math.max(a[2], b[2])];
}

function subtr3(a, b) {
	return [
		a[0] - b[0],
		a[1] - b[1],
		a[2] - b[2]];
}

function addit3(a, b) {
	return [
		a[0] + b[0],
		a[1] + b[1],
		a[2] + b[2]];
}

function scalar3(a: Zxc, f: number) {
	let x = a[0] * f;
	let y = a[1] * f;
	let z = a[2] * f;
	return [x, y, z];
}

enum INTERSECTION {
	OUTSIDE,
	INSIDE,
	INTERSECT,
}

export class aabb3 {
	min: Zxc
	max: Zxc

	constructor(v: Zxc) {
		this.min = v;
		this.max = v;
	}

	extend(v: Zxc) {
		this.min = min3(this.min, v) as Zxc;
		this.max = max3(this.max, v) as Zxc;
	}

	diagonal(): Zxc {
		return subtr3(this.max, this.min) as Zxc;
	}

	center(): Zxc {
		return addit3(this.min, scalar3(this.diagonal(), 0.5) as Zxc) as Zxc;
	}

	translate(v: Zxc) {
		addit3(this.min, v);
		addit3(this.max, v);
	}

	intersect(v) {
		if (this.max[0] < v.min[0] || this.min[0] > v.max[0] ||
			this.max[1] < v.min[1] || this.min[1] > v.max[1] ||
			this.max[2] < v.min[2] || this.min[2] > v.max[2])
			return INTERSECTION.OUTSIDE;

		if (this.min[0] <= v.min[0] && this.max[0] >= v.max[0] &&
			this.min[1] <= v.min[1] && this.max[1] >= v.max[1] &&
			this.min[2] <= v.min[2] && this.max[2] >= v.max[2])
			return INTERSECTION.INSIDE;

		return INTERSECTION.INTERSECT;
	}
}