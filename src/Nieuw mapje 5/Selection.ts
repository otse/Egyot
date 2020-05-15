import Obj from "../Nieuw mapje/Obj";
import Rekt from "../Nieuw mapje/Rekt";

import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3 } from "three";

import { tq } from "../tq";
import points from "../points";
import Egyt from "../Egyt";

class Selection {

	mesh: Mesh
	meshShadow: Mesh

	material: MeshBasicMaterial
	geometry: PlaneBufferGeometry

	dim: Zx
	start: Zx
	end: Zx

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

	Update(mouse: Zx) {
		this.View(mouse);
		this.Save(mouse);
		this.Sufficient(mouse);
		this.Set(mouse);
	}

	Sufficient(mouse: Zx) {
		let rem = points.subtract(
			<zx>points.clone(this.end), this.start);

		const px = points.together(
			points.abs(rem as Zx));

		if (!this.enuf && px > 15) {
			this.enuf = true;

			this.Make();
		}
	}

	View(mouse: Zx) {
		points.subtract(
			mouse, Egyt.game.pos);

		points.subtract(
			mouse, points.divide(
				<zx>points.clone(tq.wh), 2));

		let scale = 1;

		if (Egyt.game.scale == 0.5)
			scale = 2;

		points.multp(
			mouse, scale);
	}

	Save(mouse: Zx) {
		if (!this.start)
			this.start = [...mouse] as Zx;

		this.end = [...mouse] as Zx;
	}

	Set(mouse: Zx) {
		if (!this.enuf)
			return;

		let size = points.subtract(
			<zx>points.clone(this.end), this.start);

		let pos = points.subtract(
			<zx>points.clone(mouse), points.divide(<zx>points.clone(size), 2));

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