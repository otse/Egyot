class Obj {
	readonly stats: {
        pos: Zxc
	}
	
	clickable: boolean

	constructor(stats: Obj['stats']) {
		this.stats = stats;
		
		this.clickable = false;
	}

	Pos(): Zxc {
		return this.stats.pos;
	}

	Click(): boolean {
		return false
	}

}

namespace Obj {
	export type Stats = Obj['stats']
}

export default Obj;