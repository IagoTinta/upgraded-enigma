import { AnimatedSprite, Graphics, ObservablePoint, Rectangle, Sprite, Texture } from "pixi.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";


export class Enemy extends PhysicsContainer implements InterUpdateable, InterHitbox {

    private idlePeon: Sprite;
    private walkingPeon: AnimatedSprite;
    private hitbox: Graphics;
    private level: number;
    private health = 30;
    public damageCheck = true;
    private static readonly MOVE_SPEED = 150;

    constructor(level: number) {
        
        super();
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
        this.walkingPeon.play();
        this.walkingPeon.animationSpeed = 0.175;
        this.walkingPeon.visible = false;
        this.addChild(this.idlePeon,this.walkingPeon);

        this.level = level;
        this.speed.x = (Enemy.MOVE_SPEED * (Math.random() < 0.5 ? -1 : 1)) + (Math.random()*100 - 50);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0xFF00FF, 0.5);
        this.hitbox.drawRect(0,0,20,37);
        this.hitbox.endFill();
        this.hitbox.position.set(-10,-20);
        this.addChild(this.hitbox);

    }

    public override update (deltaMS: number):void {
        console.log(this.health);
        const dt = deltaMS / (60);
        super.update(dt);
        this.walkingPeon.update(dt / (1/60));

        if (this.speed.x > 0) {
            this.idlePeon.visible = false;
            this.walkingPeon.visible = true;
            this.scale.set(4);
        } else if (this.speed.x < 0) {
            this.idlePeon.visible = false;
            this.walkingPeon.visible = true;
            this.scale.set(-4, 4);
        } else {
            this.idlePeon.visible = true;
            this.walkingPeon.visible = false;
        }
        //console.log(this.level);

    }

    public separate(overlap: Rectangle, objeto: ObservablePoint<any>) {
        if (overlap.width < overlap.height){
            if (this.x > objeto.x) {
                this.x += overlap.width;
            } else if (this.x < objeto.x){
                this.x -= overlap.width;
            }
        } else {
            if (this.y < objeto.y) {
                this.y -= overlap.height;
            } else if (this.x > objeto.y){
                this.y += overlap.height;
            }
        }

    }

    public resumeSpeed(): void {
        this.speed.x = (Enemy.MOVE_SPEED * (Math.random() < 0.5 ? -1 : 1)) + (Math.random()*100 - 50);
    }

    public getHitbox(): Rectangle {
        return this.hitbox.getBounds();
    }

    public dealDamage():number {
        return this.level*5;
    }

    public receiveDamage(damage: number) {
        this.health -= damage;
    }

    public isDead():boolean {
       if(this.health <= 0) {
           this.visible = false;
           return true;
       } else {
           return false;
       }
    }

}