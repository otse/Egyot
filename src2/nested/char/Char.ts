import { Lumber, World, Obj, Rekt, aabb2, pts } from "./../../Re-exports";

class Man extends Obj {

    rekt: Rekt

    constructor() {
        super();
    }

    produce() {
        return;
        this.rekt = new Rekt;
        this.rekt.tile = this.tile;
        this.rekt.wh = [22, 25];
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