import { ThreeQuarter, THREE } from "../ThreeQuarter";

import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3 } from "three";
import Zxcvs from "../Zxcvs";
import Obj from "./Obj";

class Rekt {

	noDimetricization = false
	middleBottom = true
	dontOrder = false

	readonly struct: {
		obj?: Obj
		name?: string
		istile?: boolean
		xy: zx
		wh: zx
		asset?: string
		flip?: boolean
		opacity?: number,
		color?: any
	}

	mesh: Mesh
	meshShadow: Mesh

	material: MeshBasicMaterial
	geometry: PlaneBufferGeometry

	actualpos: zxc
	center: zx

	constructor(struct: Rekt.Struct) {
		this.struct = struct;

		if (struct.istile)
			this.mult();

		this.actualpos = [0, 0, 0];
		this.center = [0, 0];

		if (this.struct.opacity == undefined) this.struct.opacity = 1;
	}
	public mult() {
		this.struct.xy = Zxcvs.multp([...this.struct.xy], 24);
	}
	public initiate() {

		Rekt.num++;

		this.geometry = new PlaneBufferGeometry(
			this.struct.wh[0], this.struct.wh[1], 1, 1);

		let map;
		if (this.struct.asset)
			map = ThreeQuarter.loadTexture(`assets/${this.struct.asset}.png`);

		this.material = new MeshBasicMaterial({
			map: map,
			transparent: true,
			opacity: this.struct.opacity,
			color: this.struct.obj?.chunk?.childobjscolor || this.struct.color || 0xffffff
		});
		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = true;
		this.mesh.scale.set(1, 1, 1);

		if (this.struct.flip)
			this.mesh.scale.x = -this.mesh.scale.x;

		//UV.FlipPlane(this.geometry, 0, true);

		this.now_update_pos();

		let c;
		if (c = this.struct.obj?.chunk) {
			c.group.add(this.mesh);
		}
		else
			ThreeQuarter.scene.add(this.mesh);
	}

	public deinitiate() {
		let c;
		if (c = this.struct.obj?.chunk)
			c.group.remove(this.mesh);
		else
			ThreeQuarter.scene.remove(this.mesh);

		Rekt.num--;

		this.geometry.dispose();
		this.material.dispose();
	}

	now_update_pos() {
		const p = this.struct.xy;
		const d = this.struct.wh;

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