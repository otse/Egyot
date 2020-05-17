import Obj from "../../objrekt/Obj"
import Rekt from "../../objrekt/Rekt";

class Man extends Obj {

    rekt: Rekt

    constructor(stats: Obj.Struct) {
        super(stats);
    }

    produce() {
        return;
        this.rekt = new Rekt({
            xy: this.struct.tile,
            wh: [22, 25],
            asset: 'egyt/pumpkin'
        })

        this.rekt.use();

        this.rekt.mesh.renderOrder = 1;
    }

    deproduce() {

    }

    update() {
        
    }
}

class Ply extends Man {
    
    constructor(stats: Obj.Struct) {
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