import { ThreeQuarter, THREE } from "../ThreeQuarter";

import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3 } from "three";
import { game } from "../Game";

class Rekt {

	dontFang = false // use normal coordinates

	readonly stats: {
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

	constructor(ops: Rekt['stats']) {

		this.stats = ops;

		this.posCalc = new Vector3;

		if (this.stats.opacity == undefined) this.stats.opacity = 1;

		//console.log('Rekt ' + ops.name);
	}

	Pos(): Zxc {
		return this.stats.pos;
	}

	Dim(): Zx {
		return this.stats.dim;
	}

	public make() {

		// At least 2, 1 segments or glitch
		this.geometry = new PlaneBufferGeometry(
			this.stats.dim[0], this.stats.dim[1], 1, 1);

		let map;

		if (this.stats.asset)
			map = ThreeQuarter.LoadTexture(`assets/${this.stats.asset}.png`);

		this.material = new MeshBasicMaterial({
			map: map,
			transparent: true,
			opacity: this.stats.opacity,
			//color: this.stats.color || 0xffffff
		});

		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = true;
		this.mesh.scale.set(1, 1, 1);

		if (this.stats.flip)
			this.mesh.scale.x = -this.mesh.scale.x;

		//UV.FlipPlane(this.geometry, 0, true);

		this.set_pos();

		ThreeQuarter.scene.add(this.mesh);
	}

	public unmake() {
		ThreeQuarter.scene.remove(this.mesh);

		this.geometry.dispose();
		this.material.dispose();
	}

	set_pos() {
		const p = this.stats.pos;
		const d = this.stats.dim;

		let x, y;

		if (this.dontFang) {
			x = p[0];
			y = p[1];
		}
		else {
			x = p[0] / 2 + p[1] / 2;
			y = p[1] / 4 - p[0] / 4;

			let w = d[0] / 2;
			let h = d[1] / 2;

			this.mesh.renderOrder = -y;

			x += w;
			y += h;
		}

		this.posCalc.set(x, y, 0);

		//console.log('posCalc '+this.posCalc.x+' '+this.posCalc.y);

		this.mesh.position.copy(this.posCalc);
	}
}

export default Rekt;