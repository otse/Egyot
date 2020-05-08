import Rekt from "../Nieuw mapje/Rekt";
import Egyt from "../Egyt";
import { aabb3 } from "../Bound";
import Obj from "../Nieuw mapje/Obj";
import App from "../App";
import Zxcvs from "../Zxcvs";

namespace Agriculture {

    let plopping: WheatPlop | null;

    const tillering = [
        'egyt/farm/wheat_i',
        'egyt/farm/wheat_i',
        'egyt/farm/wheat_il',
        'egyt/farm/wheat_il',
        'egyt/farm/wheat_il',
        'egyt/farm/wheat_ili',
    ]

    const ripening = [
        'egyt/farm/wheat_il',
        'egyt/farm/wheat_ili',
        'egyt/farm/wheat_ili',
        'egyt/farm/wheat_ilil',
        'egyt/farm/wheat_ilil',
    ]    

    export class WheatPlop extends Obj {

        rekt: Rekt

        constructor(growth: number, struct: Obj.Struct) {

            super(struct);

            this.rekt = new Rekt({
                asset: growth == 1 ? Egyt.sample(tillering) : growth == 2 ? Egyt.sample(ripening) : growth == 3 ? 'egyt/farm/wheat_ilili' : '',
                pos: this.struct.pos,
                dim: [Egyt.MAGIC_ED, Egyt.MAGIC_ED],
            });

            this.rekt.initiate();
        }

        update() {
            if (plopping != this)
                return;

            let p = Egyt.map2.mouse;

            this.rekt.struct.pos = this.struct.pos = p;

            this.rekt.set_pos();

            if (App.left)
                plopping = null;
        }
    }

    export function init() {
        console.log('agriculture');

        (window as any).Agriculture = Agriculture;
    }

    export function update() {
        if (!plopping && App.map['y'] == 1) {
            plopping = plop_wheat();
        }
    }

    export function plop_wheat() {

        let plop = new WheatPlop(1, {
            pos: Egyt.map2.mouse
        });

        Egyt.world.add(plop);

        return plop;
    }

    export function plop_wheat_area(growth: number, aabb: aabb3) {

        const every = (pos: Zx) => {
            let plop = new WheatPlop(growth, {
                pos: Zxcvs.multp([...pos, 0] as Zxc, Egyt.MAGIC_ED) as Zxc
		    });

            Egyt.world.add(plop);
        }

        Zxcvs.area_every(aabb, every);
    }
}

export default Agriculture;