import { Container, Graphics, Rectangle, Sprite } from "pixi.js";
import { InterHitbox } from "../Utils/InterHitbox";


export class Majora extends Container implements InterHitbox {
    
    private hitbox: Graphics;

    constructor() {
       
        super();
        const spr = Sprite.from("majora");
        spr.anchor.set(0.5);
        spr.scale.set(0.3);
        this.addChild(spr);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0x268212, 0.5);
        this.hitbox.drawRect(0,0,150,150);
        this.hitbox.endFill();
        this.hitbox.position.set(-75,-75);

        this.addChild(this.hitbox);

    }

    public getHitbox():Rectangle {
        return this.hitbox.getBounds();
    }

}