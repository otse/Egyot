import Obj from "../Nieuw mapje/Obj"
import Rekt from "../Nieuw mapje/Rekt";

class Man extends Obj {

    rekt: Rekt

    constructor(stats: Obj.Stats) {
        super(stats);
    }

    produce() {
        this.rekt = new Rekt({
            pos: this.stats.pos,
            dim: [22, 25],
            asset: 'egyt/pumpkin'
        })

        this.rekt.initiate();

        this.rekt.mesh.renderOrder = 1;
    }

    deproduce() {

    }

    update() {
        
    }
}

class Ply extends Man {
    
    constructor(stats: Obj.Stats) {
        super(stats);

        this.order = 9;
    }

    produce() {
        super.produce();
    }

    deproduce() {

    }

    update() {

    }
}

export { Man, Ply }