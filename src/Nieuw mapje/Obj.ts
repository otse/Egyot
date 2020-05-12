class Obj {

	order: number

	readonly struct: {
        tile: zx
        //pos: zxc
	}
	
	clickable: boolean

	constructor(struct: Obj['struct']) {
		Obj.num++;

		this.order = 0;
		
		this.struct = struct;
		
		this.clickable = false;
	}

	//get_pos(): Zxc {
	//	return this.struct.pos;
	//}

	//press(): boolean {
	//	return false
	//}

	update() {

	}

	create() {
		// commonly overrided
	}

}

namespace Obj {
	export var num = 0;

	export type Struct = Obj['struct']
}

export default Obj;