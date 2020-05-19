import { tq, THREE } from "../lib/tq";

import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3, Color } from "three";
import points from "../lib/Points";
import Obj from "./Obj";
import Egyt from "../Egyt";
import { tqlib } from "../lib/tqlib";

class Rekt {

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

	inuse = false
	flick = false
	pforpixels = false

	constructor(struct: Rekt.Struct) {
		this.struct = struct;

		Rekt.num++;

		if (struct.istile)
			this.mult();

		this.actualpos = [0, 0, 0];
		this.center = [0, 0];

		if (this.struct.opacity == undefined) this.struct.opacity = 1;
	}
	public mult() {
		this.struct.xy = points.multp([...this.struct.xy], 24);
	}
	paint_alternate() {
		if (!Egyt.PAINT_OBJ_TICK_RATE)
			return;
		if (!this.inuse)
			return;
		this.flick = !this.flick;
		this.material.color.set(new Color(this.flick ? 'red' : 'blue'));
		if (this.struct.obj?.chunk)
			this.struct.obj.chunk.changed = true;
	}
	public use() {

		if (this.inuse)
			console.warn('rekt already inuse');

		Rekt.active++;

		this.inuse = true;

		this.geometry = new PlaneBufferGeometry(
			this.struct.wh[0], this.struct.wh[1], 1, 1);

		let map;
		if (this.struct.asset)
			map = tqlib.loadtexture(`assets/${this.struct.asset}.png`);

		this.material = new MeshBasicMaterial({
			map: map,
			transparent: true,
			opacity: this.struct.opacity,
			color: this.struct.obj?.chunk?.childobjscolor || this.struct.color || 0xffffff
		});
		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.frustumCulled = false;
		this.mesh.matrixAutoUpdate = false;
		this.mesh.scale.set(1, 1, 1);

		if (this.struct.flip)
			this.mesh.scale.x = -this.mesh.scale.x;

		//UV.FlipPlane(this.geometry, 0, true);

		this.now_update_pos();

		let c;
		if (c = this.struct.obj?.chunk)
			if (this.struct.obj?.usesrtt && Egyt.USE_CHUNK_RT)
				c.rttgroup.add(this.mesh);
			else
				c.group.add(this.mesh);
		else
			tq.scene.add(this.mesh);
	}
	public unuse() {
		if (!this.inuse)
			return;
		this.inuse = false;

		let c;
		if (c = this.struct.obj?.chunk)
			if (this.struct.obj?.usesrtt && Egyt.USE_CHUNK_RT)
				c.rttgroup.remove(this.mesh);
			else
				c.group.add(this.mesh);
		else
			tq.scene.remove(this.mesh);

		Rekt.active--;

		this.geometry.dispose();
		this.material.dispose();
	}

	now_update_pos() {
		const d = this.struct.wh;

		let x, y;

		let p = <zx>[...this.struct.xy];

		if (this.pforpixels) { // todo phase out
			x = p[0];
			y = p[1];
		}
		else {
			if (Egyt.OFFSET_CHUNK_OBJ_REKT) {
				let c = this.struct.obj?.chunk;
				if (c) {
					points.subtract(p, c.rekt_offset);
				}
			}
			x = p[0] / 2 + p[1] / 2;
			y = p[1] / 4 - p[0] / 4;

			this.center = [x, y];

			// middle bottom
			let w = d[0] / 2;
			let h = d[1] / 2;

			y += h;
		}

		this.actualpos = [x, y, 0];

		if (this.mesh) {
			this.mesh.renderOrder = -p[1] + p[0];
			this.mesh.position.fromArray(this.actualpos);
			this.mesh.updateMatrix();
		}
	}
}

namespace Rekt {
	export let num = 0;
	export let active = 0;

	export type Struct = Rekt['struct']
}

export default Rekt;