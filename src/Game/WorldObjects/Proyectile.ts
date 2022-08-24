import { Rectangle } from "pixi.js";
import { InterHitbox } from "../Utils/InterHitbox";
import { StateAnimations } from "../Utils/StateAnimations";
import { Wall } from "./Wall";


export class Proyectile extends StateAnimations implements InterHitbox {

    private hitbox: Wall;

    constructor(type: number, hitbox: Wall) {

        super();

        switch (type) {
            case 1:
                this.addState("shoted",["proyectile1.png"], 0.5);
                this.addState("landed", [
                    "shot1_exp0.png",
                    "shot1_exp1.png",
                    "shot1_exp2.png",
                    "shot1_exp3.png",
                    "shot1_exp4.png"
                ], 0.5, false);
                break;
            case 2:
                this.addState("shoted",["proyectile2.png"], 0.5);
                this.addState("landed", [
                    "shot2_exp1.png",
                    "shot2_exp2.png",
                    "shot2_exp3.png",
                    "shot2_exp4.png",
                    "shot2_exp5.png"
                ], 0.5, false);
                break;
            case 3:
                this.addState("shoted",["proyectile3.png"], 0.5);
                this.addState("landed", [
                    "shot3_exp1.png",
                    "shot3_exp2.png",
                    "shot3_exp3.png",
                    "shot3_exp4.png",
                ], 0.5, false);
                break;
            case 4:
                this.addState("shoted",["proyectile4.png"], 0.5);
                this.addState("landed", [
                    "shot4_exp1.png",
                    "shot4_exp2.png",
                    "shot4_exp3.png",
                    "shot4_exp4.png",
                    "shot4_exp5.png",
                    "shot4_exp6.png",
                    "shot4_exp7.png",
                    "shot4_exp8.png"
                ], 0.5, false);
                break;
            case 5:
                this.addState("shoted",["proyectile5.png"], 0.5);
                this.addState("landed", [
                    "shot5_exp1.png",
                    "shot5_exp2.png",
                    "shot5_exp3.png",
                    "shot5_exp4.png",
                    "shot5_exp5.png",
                    "shot5_exp6.png",
                    "shot5_exp7.png",
                    "shot5_exp8.png"
                ], 0.5, false);
                break;
            case 6:
                this.addState("shoted",["proyectile6.png"], 0.5);
                this.addState("landed", [
                    "shot6_exp1.png",
                    "shot6_exp2.png",
                    "shot6_exp3.png",
                    "shot6_exp4.png",
                    "shot6_exp5.png",
                    "shot6_exp6.png",
                    "shot6_exp7.png",
                    "shot6_exp8.png",
                    "shot6_exp9.png",
                    "shot6_exp10.png"
                ], 0.5, false);
                break;

            case 7:
                this.addState("shooted", [
                    "BPF1.png",
                    "BPF2.png",
                    "BPF3.png",
                    "BPF4.png",
                    "BPF5.png",
                    "BPF6.png",
                    "BPF7.png",
                    "BPF8.png",
                    "BPF9.png",
                    "BPF10.png"
                ], 0.5, true);
                this.addState("landed", [
                    "BPE1.png",
                    "BPE2.png",
                    "BPE3.png",
                    "BPE4.png",
                    "BPE5.png",
                    "BPE6.png",
                    "BPE7.png",
                    "BPE8.png",
                    "BPE9.png"
                ], 0.5, false);
                break;

            default:
                break;
        }
        this.playState("shoted");
        this.hitbox = hitbox;
        this.addChild(this.hitbox);

    }

    public getHitbox(): Rectangle {
        return this.hitbox.getBounds();
    }

    public land() {
        this.playState("landed");
    }

} 