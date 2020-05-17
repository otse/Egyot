import Obj from "../objrekt/Obj";
import Rekt from "../objrekt/Rekt";

import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3 } from "three";

import { TQ } from "../lib/TQ";
import points from "../lib/Points";
import Egyt from "../Egyt";

class Selection {

	mesh: Mesh
	meshShadow: Mesh

	material: MeshBasicMaterial
	geometry: PlaneBufferGeometry

	dim: zx
	start: zx
	end: zx

	enuf: boolean

	constructor() {
		this.enuf = false;
	}

	Make() {
		this.geometry = new PlaneBufferGeometry(1, 1);

		this.material = new MeshBasicMaterial({
			transparent: true,
			//opacity: .5,
			color: 'white',
			wireframe: true
		});

		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = false;
		this.mesh.scale.set(1, 1, 1);

		this.mesh.renderOrder = 500;

		TQ.scene.add(this.mesh);
	}

	Update(mouse: zx) {
		this.View(mouse);
		this.Save(mouse);
		this.Sufficient(mouse);
		this.Set(mouse);
	}

	Sufficient(mouse: zx) {
		let rem = points.subtract(
			<zx>points.clone(this.end), this.start);

		const px = points.together(
			points.abs(rem as zx));

		if (!this.enuf && px > 15) {
			this.enuf = true;

			this.Make();
		}
	}

	View(mouse: zx) {
		points.subtract(
			mouse, Egyt.game.pos);

		points.subtract(
			mouse, points.divide(
				<zx>points.clone(TQ.wh), 2));

		let scale = 1;

		if (Egyt.game.scale == 0.5)
			scale = 2;

		points.multp(
			mouse, scale);
	}

	Save(mouse: zx) {
		if (!this.start)
			this.start = [...mouse] as zx;

		this.end = [...mouse] as zx;
	}

	Set(mouse: zx) {
		if (!this.enuf)
			return;

		let size = points.subtract(
			<zx>points.clone(this.end), this.start);

		let pos = points.subtract(
			<zx>points.clone(mouse), points.divide(<zx>points.clone(size), 2));

		this.mesh.scale.set(size[0], size[1], 1);
		this.mesh.position.set(pos[0], pos[1], 0);

		TQ.changes = true;
	}

	End() {
		if (!this.enuf)
			return;

		TQ.scene.remove(this.mesh);

		this.geometry.dispose();
		this.material.dispose();

		TQ.changes = true;
	}
}

namespace Selection {
	//export type Stats = Selection['stats']
}

export default Selection;