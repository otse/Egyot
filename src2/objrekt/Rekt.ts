import { tq, THREE } from "../lib/tq";

import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";
import vecs from "../lib/Vecs";
import Obj from "./Obj";
import Egyt from "../Egyt";
import { tqlib } from "../lib/tqlib";
import { Chunk } from "../lod/Chunks";

class Rekt {

	name: string
	tiled: boolean = true
	xy: vec2 = [0, 0]
	of: vec2 = [0, 0]
	wh: vec2 = [1, 1]
	obj?: Obj
	asset?: string
	color?: string
	opacity?: number = 1
	flip?: boolean


	mesh: Mesh
	meshShadow: Mesh

	material: MeshBasicMaterial
	geometry: PlaneBufferGeometry

	center: vec2
	position: vec3

	used = false
	flick = false
	plain = false

	constructor() {
		Rekt.num++;

		this.center = [0, 0];
	}
	unset() {
		Rekt.num--;
	}
	multNone() {
	}
	paint_alternate() {
		if (!Egyt.PAINT_OBJ_TICK_RATE)
			return;
		if (!this.used)
			return;
		this.flick = !this.flick;
		this.material.color.set(new Color(this.flick ? 'red' : 'blue'));
		if (this.obj?.chunk)
			this.obj.chunk.changed = true;
	}
	unuse() {
		if (!this.used)
			return;
		this.used = false;
		this.getgroup().remove(this.mesh);
		Rekt.active--;
		this.geometry.dispose();
		this.material.dispose();
	}
	use() {
		if (this.used)
			console.warn('rekt already inuse');

		Rekt.active++;

		this.used = true;

		this.geometry = new PlaneBufferGeometry(
			this.wh[0], this.wh[1], 1, 1);

		let map;
		if (this.asset)
			map = tqlib.loadtexture(`assets/${this.asset}.png`);

		this.material = new MeshBasicMaterial({
			map: map,
			transparent: true,
			opacity: this.opacity,
			color: this.obj?.chunk?.childobjscolor || this.color || 0xffffff
		});
		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = false;
		this.mesh.matrixAutoUpdate = false;
		this.mesh.scale.set(1, 1, 1);

		if (this.flip)
			this.mesh.scale.x = -this.mesh.scale.x;

		//UV.FlipPlane(this.geometry, 0, true);

		this.now_update_pos();

		this.getgroup().add(this.mesh);
	}
	getgroup() {
		let c: Chunk | null | undefined;
		if (c = this.obj?.chunk)
			if (this.obj?.rtt && Egyt.USE_CHUNK_RT)
				return c.grouprt;
			else
				return c.group;
		else
			return tq.scene;
	}
	dual() {
		let xy = <vec2>vecs.clone(this.xy);
		let offset = <vec2>vecs.clone(this.of);

		vecs.add(xy, offset);

		if (this.tiled) {
			xy = Rekt.mult(xy);
		}

		return xy;
	}
	now_update_pos() {
		const d = this.wh;

		let x, y;

		let xy = this.dual();

		if (this.plain) {
			x = xy[0];
			y = xy[1];
		}
		else {
			if (Egyt.OFFSET_CHUNK_OBJ_REKT) {
				let c = this.obj?.chunk;
				if (c) {
					vecs.subtract(xy, c.rekt_offset);
				}
			}
			x = xy[0] / 2 + xy[1] / 2;
			y = xy[1] / 4 - xy[0] / 4;

			this.center = [x, y];

			// middle bottom
			const w = d[0] / 2;
			const h = d[1] / 2;

			y += h;
		}

		this.position = [x, y, 0];

		if (this.mesh) {
			this.mesh.renderOrder = Rekt.depth(xy);
			this.mesh.position.fromArray(this.position);
			this.mesh.updateMatrix();
		}
	}
}

namespace Rekt {
	export let num = 0;
	export let active = 0;

	//export type Struct = Rekt['struct']

	export function depth(p: vec2) {
		return -p[1] + p[0];
	}

	export function mult(p: vec2) {
		return vecs.mult(p, 24);
	}
}

export default Rekt;