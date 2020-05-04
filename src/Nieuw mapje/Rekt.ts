import { ThreeQuarter, THREE } from "../ThreeQuarter";

import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3 } from "three";

class Rekt {

	dont21 = false // use normal coordinates
	leftBottom = false
	bottomCenter = true
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

	posCalc: Vector3

	constructor(struct: Rekt.Struct) {

		this.struct = struct;

		this.posCalc = new Vector3;

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
			//color: this.stats.color || 0xffffff
		});

		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = true;
		this.mesh.scale.set(1, 1, 1);

		if (this.struct.flip)
			this.mesh.scale.x = -this.mesh.scale.x;

		//UV.FlipPlane(this.geometry, 0, true);

		this.set_pos();

		ThreeQuarter.scene.add(this.mesh);
	}

	public deinitiate() {
		ThreeQuarter.scene.remove(this.mesh);

		this.geometry.dispose();
		this.material.dispose();
	}

	set_pos(ox?, oy?) {
		const p = this.struct.pos;
		const d = this.struct.dim;

		let x, y;

		if (this.dont21) {
			x = p[0];
			y = p[1];
			if (ox) x += ox;
			if (oy) y += oy;
		}
		else {
			x = p[0] / 2 + p[1] / 2;
			y = p[1] / 4 - p[0] / 4;

			if (!this.dontOrder)
			this.mesh.renderOrder = -y;

			if (this.bottomCenter) {
				let w = d[0] / 2;
				let h = d[1] / 2;

				//x += w;
				y += h;
			}

			else if (this.leftBottom) {
				let w = d[0] / 2;
				let h = d[1] / 2;

				x += w;
				y += h;
			}
		}

		this.posCalc.set(x, y, 0);

		//console.log('posCalc '+this.posCalc.x+' '+this.posCalc.y);

		this.mesh.position.copy(this.posCalc);
	}
}

namespace Rekt {
	export type Struct = Rekt['struct']
}

export default Rekt;