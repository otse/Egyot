import Obj from "../Nieuw mapje/Obj";
import Egyt from "../Egyt";
import { Ply } from "./Guy";

class World {
    static rig() {
        return new World;
    }

    objs: Obj[]

    constructor() {
        this.objs = [];

        this.init();

        console.log('world');
    }

    add(obj: Obj) {
        this.objs.push(obj);
        this.objs.sort((a, b) => a.order - b.order);
    }

    update() {

        for (let obj of this.objs) {
            obj.update();
        }

    }

    init() {

        Egyt.ply = new Ply({
            pos: [0, 0, 0]
        });

        Egyt.ply.produce();
    }
}

export { World }