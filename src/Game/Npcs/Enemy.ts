import { AnimatedSprite, Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";


export class Enemy extends PhysicsContainer implements InterUpdateable, InterHitbox {

    private idlePeon: Sprite;
    private walkingPeon: AnimatedSprite;
    private hitbox: Graphics;
    private level: number;

    constructor(level: number) {
        
        super();
        this.level = level;
        this.idlePeon = Sprite.from("idlePeon");
        this.walkingPeon = new AnimatedSprite(
            [
                Texture.from("walkingPeon1"),
                Texture.from("walkingPeon2"),
                Texture.from("walkingPeon3"),
                Texture.from("walkingPeon4"),
                Texture.from("walkingPeon5"),
                Texture.from("walkingPeon6"),
            ], false
        )
        this.idlePeon.anchor.set(0.5);
        this.walkingPeon.anchor.set(0.5);
        this.idlePeon.scale.set(2.5);
        this.walkingPeon.scale.set(2.5);
        this.walkingPeon.play();
        this.walkingPeon.animationSpeed = 0.175;
        this.walkingPeon.visible = false;
        this.addChild(this.idlePeon,this.walkingPeon);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF00FF, 0.5);
        this.hitbox.drawRect(0,0,50,90);
        this.hitbox.endFill();
        this.hitbox.position.set(-25,-45);
        this.addChild(this.hitbox);

    }

    public override update (deltaMS: number):void {
        const dt = deltaMS / (60);
        super.update(dt);
        this.walkingPeon.update(dt / (1/60));
    }

    public getHitbox(): Rectangle {
        return this.hitbox.getBounds();
    }

    public dealDamage():number {
        return this.level*5;
    }

}