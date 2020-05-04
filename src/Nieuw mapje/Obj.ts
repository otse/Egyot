class Obj {
	order: number

	readonly struct: {
        pos: Zxc
	}
	
	clickable: boolean

	constructor(struct: Obj['struct']) {
		this.order = 0;
		
		this.struct = struct;
		
		this.clickable = false;
	}

	get_pos(): Zxc {
		return this.struct.pos;
	}

	press(): boolean {
		return false
	}

	update() {

	}

	produce() {
		// override this
	}

}

namespace Obj {
	export type Struct = Obj['struct']
}

export default Obj;