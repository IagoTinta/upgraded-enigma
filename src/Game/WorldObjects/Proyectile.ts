import { Rectangle } from "pixi.js";
import { InterHitbox } from "../Utils/InterHitbox";
import { StateAnimations } from "../Utils/StateAnimations";
import { Wall } from "./Wall";


export class Proyectile extends StateAnimations implements InterHitbox {

    private hitbox: Wall;

    constructor(hitbox: Wall) {

        super();
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
            "BPF10.png",
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
        this.playState("shoted");
        this.hitbox = hitbox;
        this.addChild(this.hitbox);

    }

    public override updateAnim (frames: number) {
        super.updateAnim(frames);
    }

    public getHitbox(): Rectangle {
        return this.hitbox.getBounds();
    }

    public land() {
        this.playState("landed");
    }

} 