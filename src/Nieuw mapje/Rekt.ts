import { ThreeQuarter, THREE } from "../ThreeQuarter";

import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3 } from "three";

class Rekt {

	noDimetricization = false
	middleBottom = true
	dontOrder = false

	readonly struct: {
		name?: string
		pos: Zxc
		dim: Zx
		asset?: string
		flip?: boolean
		opacity?: number,
		color?: any
	}

	mesh: Mesh
	meshShadow: Mesh

	material: MeshBasicMaterial
	geometry: PlaneBufferGeometry

	actualpos: Zxc
	center: Zx

	constructor(struct: Rekt.Struct) {

		Rekt.num++;

		this.struct = struct;

		this.actualpos = [0, 0, 0];
		this.center = [0, 0];

		if (this.struct.opacity == undefined) this.struct.opacity = 1;
	}

	public initiate() {

		// At least 2, 1 segments or glitch
		this.geometry = new PlaneBufferGeometry(
			this.struct.dim[0], this.struct.dim[1], 1, 1);

		let map;

		if (this.struct.asset)
			map = ThreeQuarter.loadTexture(`assets/${this.struct.asset}.png`);

		this.material = new MeshBasicMaterial({
			map: map,
			transparent: true,
			opacity: this.struct.opacity,
			color: this.struct.color || 0xffffff
		});

		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = true;
		this.mesh.scale.set(1, 1, 1);

		if (this.struct.flip)
			this.mesh.scale.x = -this.mesh.scale.x;

		//UV.FlipPlane(this.geometry, 0, true);

		this.now_update_pos();

		ThreeQuarter.scene.add(this.mesh);
	}

	public deinitiate() {
		ThreeQuarter.scene.remove(this.mesh);

		this.geometry.dispose();
		this.material.dispose();
	}

	now_update_pos() {
		const p = this.struct.pos;
		const d = this.struct.dim;

		let x, y;

		if (this.noDimetricization) {
			x = p[0];
			y = p[1];
		}
		else {
			x = p[0] / 2 + p[1] / 2;
			y = p[1] / 4 - p[0] / 4;

			this.center = [x, y];

			if (this.middleBottom) {
				let w = d[0] / 2;
				let h = d[1] / 2;
				
				y += h;
			}

			if (!this.dontOrder)
				this.mesh.renderOrder = -p[1] + p[0];

		}

		this.actualpos = [x, y, 0];

		this.mesh.position.fromArray(this.actualpos);
	}
}

namespace Rekt {
	export let num = 0;

	export type Struct = Rekt['struct']
}

export default Rekt;