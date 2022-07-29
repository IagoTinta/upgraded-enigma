import { Graphics, Rectangle } from "pixi.js";
import { Tween } from "tweedle.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { StateAnimations } from "../Utils/StateAnimations";


export class XertacBoss extends PhysicsContainer implements InterUpdateable, InterHitbox {

    private boss: StateAnimations;
    private hitbox: Graphics;
    private health = 1600;
    private active = false;
    private static readonly MOVE_SPEED = 100;

    constructor() {

        super();
        this.boss = new StateAnimations();
        this.boss.addState("idleBoss", ["Boss1"], 1);
        this.boss.addState("hittingBoss", ["Boss1hit"], 1);
        this.boss.playState("idleBoss");

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0x0000FF, 1);
        this.hitbox.drawRect(0,0,0,0);
        this.hitbox.endFill();

        this.addChild(this.boss); 

    }

    public override update(deltaMS: number) {

        super.update(deltaMS / 60);
        this.boss.updateAnim(deltaMS);

        if (this.active) {
        
        }

    }

    public getHitbox():Rectangle {
        return this.hitbox.getBounds();
    }

    public activate() {
        this.addChild(this.hitbox);
        this.active = true;
        this.speed.y = XertacBoss.MOVE_SPEED * ((Math.random()>0.5) ? 1 : -1);
    }

    public changeSpeed() {
        this.speed.y = -XertacBoss.MOVE_SPEED;
    }

    public receiveDamage(damage: number) {
        new Tween({dc:0}).
        to({dc:1}, 100).
        onStart(()=>{this.boss.playState("hittingBoss")}).
        onComplete(()=>{this.boss.playState("idleBoss")}).
        start();
        this.health -= damage;
    }

    public isDead():boolean {
        if (this.health <= 0) {
            return true;
        } else {
            return false;
        }
    }

}