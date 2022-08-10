import { Graphics, Rectangle } from "pixi.js";
import { Tween } from "tweedle.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { Manager } from "../Utils/Manager";
import { StateAnimations } from "../Utils/StateAnimations";


export class XertacBoss extends PhysicsContainer implements InterUpdateable, InterHitbox {

    private boss: StateAnimations;
    private hitbox: Graphics;
    private health = 6000;
    private active = false;
    private static readonly MOVE_SPEED = 100;
    public bossShooting = false;
    public exploding = false;

    constructor() {

        super();
        this.boss = new StateAnimations();
        this.boss.addState("idleBoss", ["Boss1"], 1);
        this.boss.addState("hittingBoss", ["Boss1hit"], 1);
        this.boss.addState("explodingBoss", [
            "Boss1Explode1.png",
            "Boss1Explode2.png",
            "Boss1Explode3.png",
            "Boss1Explode4.png",
            "Boss1Explode5.png",
            "Boss1Explode6.png",
            "Boss1Explode7.png",
            "Boss1Explode8.png",
            "Boss1Explode9.png",
            "Boss1Explode10.png",
            "Boss1Explode11.png",
            "Boss1Explode12.png",
            "Boss1Explode13.png",
            "Boss1Explode14.png",
            "Boss1Explode15.png",
            "Boss1Explode16.png",
            "Boss1Explode17.png",
            "Boss1Explode18.png",
            "Boss1Explode19.png",
            "Boss1Explode20.png",
        ], 0.1, true);
        this.boss.addState("finalExplosion", [
            "MegaExplosion1.png",
            "MegaExplosion2.png",
            "MegaExplosion3.png",
            "MegaExplosion4.png",
            "MegaExplosion5.png",
            "MegaExplosion6.png",
            "MegaExplosion7.png",
            "MegaExplosion8.png",
            "MegaExplosion9.png",
            "MegaExplosion10.png",
        ], 0.1, false);
        this.boss.playState("idleBoss");

        this.hitbox = new Graphics();

        this.boss.rotation = Math.PI*3/2;

        this.addChild(this.boss);
        this.scale.set(2);

    }

    public override update(deltaMS: number) {

        super.update(deltaMS / 60);
        this.boss.updateAnim(deltaMS);

    }

    public getHitbox():Rectangle {
        return this.hitbox.getBounds();
    }

    public activate() {
        this.hitbox = new Graphics();
        this.hitbox.beginFill(0x0000FF, 0);
        this.hitbox.drawRect(-40,-95,80,190);
        this.hitbox.endFill();
        this.hitbox.rotation = Math.PI*3/2;
        this.addChild(this.hitbox);
        this.active = true;
        this.speed.y = XertacBoss.MOVE_SPEED * ((Math.random()>0.5) ? 1 : -1);
    }

    public changeSpeed() {
        this.speed.y = -this.speed.y;
    }

    public receiveDamage(damage: number) {
        new Tween({dc:0}).
        to({dc:1}, 100).
        onStart(()=>{this.boss.playState("hittingBoss")}).
        onComplete(()=>{
            if (this.health <= 0) {
                this.boss.removeChild(this.hitbox);
                this.explode();
            } else {
                this.boss.playState("idleBoss");
            }
        }).
        start();
        this.health -= damage;
    }

    public explode() {
        this.boss.playState("explodingBoss");
        Manager.playSFX("BossExplosion");
        this.exploding = true;
        new Tween({dc:0}).
        to({dc:1}, 5500).
        onComplete(()=>{
            this.boss.playState("finalExplosion");
        }).
        start();
        new Tween({dc:0}).
        to({dc:1}, 6250).
        onComplete(()=>{this.removeChild(this.boss)}).
        start();
    }

    public isDead():boolean {
        if (this.health <= 0) {
            return true;
        } else {
            return false;
        }
    }

    public isActive():boolean {
        if (this.active) {
            return true;
        } else {
            return false;
        }
    }

}