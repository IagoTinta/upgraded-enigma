import { Container, Graphics, Rectangle } from "pixi.js";
import { InterHitbox } from "../Utils/InterHitbox";


export class Wall extends Container implements InterHitbox {

    private hitbox: Graphics;

    constructor(w: number, h: number) {

        super();
        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xDFFF3D,0);
        this.hitbox.drawRect(0,0,w,h);
        this.hitbox.endFill();

        this.addChild(this.hitbox);

    }

    public getHitbox():Rectangle {
        return this.hitbox.getBounds();
    }

}