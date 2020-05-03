import Rekt from "../Nieuw mapje/Rekt";
import Forestation from "../Nieuw mapje 3/Forestation";

class Map2 {
    static rig() {
        return new Map2;
    }

    constructor() {
        
        let tinybarn = new Rekt({
            pos: [0, 0, 0],
            dim: [162, 137],
            asset: 'egyt/tinybarn'
        });

        tinybarn.initiate();

        Forestation.place_tree([0, 0, 0]);
    }

    update() {

    }
}

export { Map2 }