import Obj from "../../objrekt/Obj";
import Rekt from "../../objrekt/Rekt";


class Man extends Obj {

    rekt: Rekt

    constructor() {
        super();
    }

    produce() {
        return;
        this.rekt = new Rekt;
        this.rekt.tile = this.tile;
        this.rekt.size = [22, 25];
        this.rekt.asset = 'egyt/pumpkin'

        this.rekt.use();

        this.rekt.mesh.renderOrder = 1;
    }

    deproduce() {

    }

    update() {
        
    }
}

class Ply extends Man {
    
    constructor() {
        super();

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