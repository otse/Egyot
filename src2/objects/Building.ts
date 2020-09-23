import Lumber from "../Lumber";
import Obj from "../objrekt/Obj";
import Rekt from "../objrekt/Rekt";

export class Tile extends Obj {
    rekt: Rekt
    asset: string = 'egyt/ground/stone1'
    constructor(asset) {
        super();
        //this.rtt = false;
    }
    finish() {
        this.rekt = new Rekt;
        this.rekt.obj = this;
        this.rekt.asset = this.asset;
        this.rekt.tile = this.tile;
        this.rekt.wh = [24, 12];
    }
    comes() {
        super.comes();
        this.rekt.use();
    }
    goes() {
        super.goes();
        this.rekt.unuse();
    }
    update() {
        if (Lumber.PAINT_OBJ_TICK_RATE)
            this.rekt.paint_alternate();
    }
    unset() {
        super.unset();
        this.rekt.unset();
    }
}