import Obj from "../objrekt/Obj";
import Rekt from "../objrekt/Rekt";

import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3 } from "three";

import { tq } from "../lib/tq";
import pts from "../lib/Pts";
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

		tq.scene.add(this.mesh);
	}

	Update(mouse: zx) {
		this.View(mouse);
		this.Save(mouse);
		this.Sufficient(mouse);
		this.Set(mouse);
	}

	Sufficient(mouse: zx) {
		let rem = pts.subtract(
			<zx>pts.clone(this.end), this.start);

		const px = pts.together(
			pts.abs(rem as zx));

		if (!this.enuf && px > 15) {
			this.enuf = true;

			this.Make();
		}
	}

	View(mouse: zx) {
		pts.subtract(mouse, Egyt.game.pos);

		pts.subtract(
			mouse, pts.divide(
				<zx>pts.clone(tq.wh), 2));

		let scale = 1;

		if (Egyt.game.scale == 0.5)
			scale = 2;

		pts.mult(
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

		let size = pts.subtract(
			<zx>pts.clone(this.end), this.start);

		let pos = pts.subtract(
			<zx>pts.clone(mouse), pts.divide(<zx>pts.clone(size), 2));

		this.mesh.scale.set(size[0], size[1], 1);
		this.mesh.position.set(pos[0], pos[1], 0);

		tq.changes = true;
	}

	End() {
		if (!this.enuf)
			return;

		tq.scene.remove(this.mesh);

		this.geometry.dispose();
		this.material.dispose();

		tq.changes = true;
	}
}

namespace Selection {
	//export type Stats = Selection['stats']
}

export default Selection;