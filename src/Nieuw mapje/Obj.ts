class Obj {

	order: number = 0
	invented: boolean = false
	clickable: boolean = false

	readonly struct: {
		tile: zx
		//pos: zxc
	}

	constructor(struct: Obj['struct']) {
		Obj.num++;

		this.struct = struct;

	}

	update() {
	}
	
	comes() {
		this.invented = true;
	}

	goes() {
		this.invented = false;
	}

}

namespace Obj {
	export var num = 0;

	export type Struct = Obj['struct']
}

export default Obj;