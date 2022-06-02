import { Container, Graphics, Rectangle } from "pixi.js";
import { InterHitbox } from "../Utils/InterHitbox";


export class Wall extends Container implements InterHitbox {

    private hitbox: Graphics;

    constructor() {

        super();
        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xDFFF3D,0);
        this.hitbox.drawRect(0,0,100,1200);
        this.hitbox.endFill();

        this.addChild(this.hitbox);

    }

    public getHitbox():Rectangle {
        return this.hitbox.getBounds();
    }

}