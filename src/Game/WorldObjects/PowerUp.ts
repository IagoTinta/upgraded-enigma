import { Graphics, Rectangle } from "pixi.js";
import { Tween } from "tweedle.js";
import { InterHitbox } from "../Utils/InterHitbox";
import { StateAnimations } from "../Utils/StateAnimations";


export class PowerUp extends StateAnimations implements InterHitbox {

    private hitbox: Graphics;
    public pickeable: boolean = false;

    constructor() {

        super();
        this.addState("PUmoving", [
            "powerUp1.png",
            "powerUp2.png",
            "powerUp3.png",
            "powerUp4.png",
            "powerUp5.png",
            "powerUp6.png",
            "powerUp7.png",
            "powerUp8.png",
            "powerUp9.png",
            "powerUp10.png",
        ], 0.1);
        this.addState("PUexplode", [
            "PUexp1.png",
            "PUexp2.png",
            "PUexp3.png",
            "PUexp4.png",
            "PUexp5.png",
            "PUexp6.png",
            "PUexp7.png",
            "PUexp8.png",
            "PUexp9.png",
        ], 0.5, false);
        this.playState("PUmoving");

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF0000, 0);
        this.hitbox.drawRect(-100,-100,200,200);
        this.hitbox.endFill();
        this.scale.set(0.2);
        this.addChild(this.hitbox);

    }

    public getHitbox():Rectangle {
        return this.hitbox.getBounds();
    }

    public explode() {
        this.playState("PUexplode");
        new Tween({dc:0}).
        to({dc:1}, 100).
        onComplete(()=>{this.pickeable = true}).
        start();
    }
    public respawn() {
        this.playState("PUmoving");
    }

}