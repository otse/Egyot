class Obj {
	order: number

	readonly stats: {
        pos: Zxc
	}
	
	clickable: boolean

	constructor(stats: Obj['stats']) {
		this.order = 0;
		
		this.stats = stats;
		
		this.clickable = false;
	}

	Pos(): Zxc {
		return this.stats.pos;
	}

	Click(): boolean {
		return false
	}

	update() {

	}

	produce() {
		// override this
	}

}

namespace Obj {
	export type Stats = Obj['stats']
}

export default Obj;