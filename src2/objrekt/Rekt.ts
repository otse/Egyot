import Lumber from "../Lumber";
import Renderer from "../Renderer";
import Obj from "./Obj";

import pts from "../lib/pts";

import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";

import { Chunk } from "../lod/Chunks";
import aabb2 from "../lib/aabb2";

class Rekt {
	name: string
	tile: vec2 = [0, 0]
	offset: vec2 = [0, 0]
	size: vec2 = [1, 1]
	screen: aabb2
	obj?: Obj
	asset?: string
	color?: string
	flip?: boolean
	opacity: number = 1

	mesh: Mesh
	meshShadow: Mesh

	material: MeshBasicMaterial
	geometry: PlaneBufferGeometry

	center: vec2 = [0, 0]
	position: vec3 = [0, 0, 0]

	//low = false
	used = false
	flick = false
	plain = false

	constructor() {
		Rekt.num++;
	}
	unset() {
		Rekt.num--;
		this.unuse();
	}
	paint_alternate() {
		if (!Lumber.PAINT_OBJ_TICK_RATE)
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
			this.size[0], this.size[1], 2, 2);

		let map;
		if (this.asset)
			map = Renderer.loadtexture(`assets/${this.asset}.png`);

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

		this.update();

		this.getgroup().add(this.mesh);
	}
	getgroup() {
		let c: Chunk | null | undefined;
		if (c = this.obj?.chunk)
			if (this.obj?.rtt && Lumber.USE_CHUNK_RT)
				return c.grouprt;
			else
				return c.group;
		else
			return Renderer.scene;
	}
	dual() {
		let xy = pts.add(this.tile, this.offset);

		return xy;
	}
	update() {
		let x, y;

		let xy = pts.add(this.tile, this.offset);

		//let squared = this.size[0] / 2 / Lumber.HALVE;
		//console.log('squared',squared);

		if (this.plain) {
			x = xy[0];
			y = xy[1];
		}
		else {
			xy = pts.mult(xy, Lumber.EVEN);

			if (Lumber.OFFSET_CHUNK_OBJ_REKT && this.obj?.chunk)
				xy = pts.subtract(xy, this.obj.chunk.rekt_offset);

			x = xy[0] / 2 + xy[1] / 2;
			y = xy[1] / 4 - xy[0] / 4;

			this.center = [x, y];

			// middle bottom
			const w = this.size[0] / 2;
			const h = this.size[1] / 2;

			y += h;
		}

		this.position = [x, y, 0];

		if (this.mesh) {
			this.setdepth();
			this.mesh.position.fromArray(this.position);
			this.mesh.updateMatrix();
		}
	}
	setdepth() {
		if (this.mesh) {
			let depth = this.obj?.depth || Rekt.simpledepth(this.tile);
			this.mesh.renderOrder = depth;
		}
	}
}

namespace Rekt {
	export let num = 0;
	export let active = 0;

	//export type Struct = Rekt['struct']

	export function simpledepth(t: vec2) {
		return -t[1] + t[0];
	}
}

export default Rekt;