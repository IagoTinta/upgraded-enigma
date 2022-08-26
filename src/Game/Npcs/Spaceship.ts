import { GlowFilter } from "@pixi/filter-glow";
import { sound } from "@pixi/sound";
import { Container, Graphics, ObservablePoint, Rectangle, Texture } from "pixi.js";
import { Tween } from "tweedle.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { Keyboard } from "../Utils/Keyboard";
import { Manager } from "../Utils/Manager";
import { StateAnimations } from "../Utils/StateAnimations";


export class Spaceship extends PhysicsContainer implements InterUpdateable, InterHitbox {

    private SsAnimations: StateAnimations;
    private turboAnimations: StateAnimations;
    private cannonAnimations: StateAnimations;
    private wholeShip: Container;
    private Sshitbox: Graphics;
    private shootingSs = false;
    private damageSs = 10;
    private turboSs = false;
    private damageUpSs = false;
    private shieldSs = true;
    private lifes = 3;
    public tangible = true;
    
    private static readonly SS_SPEED = 200;
    
    constructor() {

        super();
        this.wholeShip = new Container;
        this.SsAnimations = new StateAnimations();
        this.turboAnimations = new StateAnimations();
        this.cannonAnimations = new StateAnimations();
        
        switch (Manager.getType()) {
            case 1:
                this.SsAnimations.addState("idle", [
                    Texture.from("Ship1.png")
                ],0.5);
                this.SsAnimations.addState("explode", [
                    "Ship1_Explosion_001.png",
                    "Ship1_Explosion_003.png",
                    "Ship1_Explosion_008.png",
                    "Ship1_Explosion_009.png",
                    "Ship1_Explosion_012.png",
                    "Ship1_Explosion_013.png",
                    "Ship1_Explosion_014.png",
                    "Ship1_Explosion_017.png",
                    "Ship1_Explosion_019.png",
                    "Ship1_Explosion_020.png",
                ], 0.5, false);
                this.cannonAnimations.addState("shooting", [
                    "shot1_1.png",
                    "shot1_2.png",
                    "shot1_3.png"
                ], 0.25, false);
                this.SsAnimations.playState("idle");
                this.turboAnimations.addState("normal", [
                    "Ship1_normal_flight_01.png",
                    "Ship1_normal_flight_02.png",
                    "Ship1_normal_flight_03.png",
                    "Ship1_normal_flight_04.png"
                ], 0.25);
                this.turboAnimations.addState("turbo", [
                    "Ship1_turbol_flight_001.png",
                    "Ship1_turbol_flight_003.png",
                    "Ship1_turbol_flight_005.png",
                    "Ship1_turbol_flight_007.png",
                ], 0.25, true);
                this.turboAnimations.playState("normal");
                
                this.turboAnimations.position.set(this.SsAnimations.x-40,this.SsAnimations.y);
                this.cannonAnimations.position.set(this.SsAnimations.x+45, this.SsAnimations.y);
                
                this.cannonAnimations.filters = [new GlowFilter({color: 0x19F201})];
                break;
        
            case 2:
                this.SsAnimations.addState("idle", [
                    Texture.from("Ship2.png")
                ],0.5);
                this.SsAnimations.addState("explode", [
                    "Ship2_Explosion_000.png",
                    "Ship2_Explosion_004.png",
                    "Ship2_Explosion_005.png",
                    "Ship2_Explosion_008.png",
                    "Ship2_Explosion_009.png",
                    "Ship2_Explosion_010.png",
                    "Ship2_Explosion_013.png",
                    "Ship2_Explosion_015.png",
                    "Ship2_Explosion_016.png",
                    "Ship2_Explosion_019.png",
                    "Ship2_Explosion_021.png",
                ], 0.5, false);
                this.cannonAnimations.addState("shooting", [
                    "shot2_1.png",
                    "shot2_2.png",
                    "shot2_3.png",
                    "shot2_4.png",
                    "shot2_5.png",
                    "shot2_6.png",
                ], 0.25, false);
                this.SsAnimations.playState("idle");
                this.turboAnimations.addState("normal", [
                    "Ship2_normal_flight_01.png",
                    "Ship2_normal_flight_02.png",
                    "Ship2_normal_flight_03.png",
                    "Ship2_normal_flight_04.png"
                ], 0.25);
                this.turboAnimations.addState("turbo", [
                    "Ship2_turbo_flight_001.png",
                    "Ship2_turbo_flight_003.png",
                    "Ship2_turbo_flight_005.png",
                    "Ship2_turbo_flight_007.png",
                ], 0.25, true);
                this.turboAnimations.playState("normal");
                
                this.turboAnimations.position.set(this.SsAnimations.x-50,this.SsAnimations.y);
                this.cannonAnimations.position.set(this.SsAnimations.x+50, this.SsAnimations.y);
                
                this.cannonAnimations.filters = [new GlowFilter({color: 0x48A5FA})];
                break;
        
            case 3:
                this.SsAnimations.addState("idle", [
                    Texture.from("Spaceship3.png")
                ],0.5);
                this.SsAnimations.addState("explode", [
                    "Ship3_Explosion_01.png",
                    "Ship3_Explosion_02.png",
                    "Ship3_Explosion_03.png",
                    "Ship3_Explosion_04.png",
                    "Ship3_Explosion_05.png",
                    "Ship3_Explosion_06.png",
                    "Ship3_Explosion_07.png",
                    "Ship3_Explosion_08.png",
                    "Ship3_Explosion_09.png",
                    "Ship3_Explosion_010.png",
                    "Ship3_Explosion_011.png",
                ], 0.5, false);
                this.cannonAnimations.addState("shooting", [
                    "shot3_1.png",
                    "shot3_2.png",
                    "shot3_3.png"
                ], 0.25, false);
                this.SsAnimations.playState("idle");
        
                
                this.turboAnimations.addState("normal", [
                    "Ship3_normal_flight_01.png",
                    "Ship3_normal_flight_02.png",
                    "Ship3_normal_flight_03.png",
                    "Ship3_normal_flight_04.png"
                ], 0.25);
                this.turboAnimations.addState("turbo", [
                    "Ship3_turbo_flight_1.png",
                    "Ship3_turbo_flight_2.png",
                    "Ship3_turbo_flight_3.png",
                    "Ship3_turbo_flight_4.png",
                ], 0.25, true);
                this.turboAnimations.playState("normal");
                
                this.turboAnimations.position.set(this.SsAnimations.x-50,this.SsAnimations.y);
                this.cannonAnimations.position.set(this.SsAnimations.x+75, this.SsAnimations.y+5);
                
                this.cannonAnimations.filters = [new GlowFilter({color: 0xFF0000})];
                break;
        
            case 4:
                this.SsAnimations.addState("idle", [
                    Texture.from("Ship4.png")
                ],0.5);
                this.SsAnimations.addState("explode", [
                    "Ship4_Explosion_000.png",
                    "Ship4_Explosion_003.png",
                    "Ship4_Explosion_005.png",
                    "Ship4_Explosion_007.png",
                    "Ship4_Explosion_008.png",
                    "Ship4_Explosion_012.png",
                    "Ship4_Explosion_013.png",
                    "Ship4_Explosion_015.png",
                    "Ship4_Explosion_018.png",
                    "Ship4_Explosion_019.png",
                    "Ship4_Explosion_020.png",
                ], 0.5, false);
                this.cannonAnimations.addState("shooting", [
                    "shot4_1.png",
                    "shot4_2.png",
                    "shot4_3.png",
                    "shot4_4.png",
                    "shot4_5.png",
                ], 0.25, false);
                this.SsAnimations.playState("idle");
                this.turboAnimations.addState("normal", [
                    "Ship4_normal_flight_01.png",
                    "Ship4_normal_flight_02.png",
                    "Ship4_normal_flight_03.png",
                    "Ship4_normal_flight_04.png"
                ], 0.25);
                this.turboAnimations.addState("turbo", [
                    "Ship1_turbol_flight_001.png",
                    "Ship1_turbol_flight_003.png",
                    "Ship1_turbol_flight_005.png",
                    "Ship1_turbol_flight_007.png",
                ], 0.25, true);
                this.turboAnimations.playState("normal");
                
                this.turboAnimations.position.set(this.SsAnimations.x-45,this.SsAnimations.y+2);
                this.cannonAnimations.position.set(this.SsAnimations.x+60, this.SsAnimations.y+2);
                this.turboAnimations.scale.set(0.75);
                this.SsAnimations.scale.set(0.75);

                this.cannonAnimations.filters = [new GlowFilter({color: 0xF77813})];
                break;
        
            case 5:
                this.SsAnimations.addState("idle", [
                    Texture.from("Ship5.png")
                ],0.5);
                this.SsAnimations.addState("explode", [
                    "Ship5_Explosion_001.png",
                    "Ship5_Explosion_003.png",
                    "Ship5_Explosion_006.png",
                    "Ship5_Explosion_007.png",
                    "Ship5_Explosion_008.png",
                    "Ship5_Explosion_011.png",
                    "Ship5_Explosion_013.png",
                    "Ship5_Explosion_014.png",
                    "Ship5_Explosion_017.png",
                    "Ship5_Explosion_019.png",
                    "Ship5_Explosion_020.png",
                ], 0.5, false);
                this.cannonAnimations.addState("shooting", [
                    "shot5_1.png",
                    "shot5_2.png",
                    "shot5_3.png",
                    "shot5_4.png",
                    "shot5_5.png",
                ], 0.25, false);
                this.SsAnimations.playState("idle");
                this.turboAnimations.addState("normal", [
                    "Ship5_normal_flight_01.png",
                    "Ship5_normal_flight_02.png",
                    "Ship5_normal_flight_03.png",
                    "Ship5_normal_flight_04.png"
                ], 0.25);
                this.turboAnimations.addState("turbo", [
                    "Ship5_turbo_flight_001.png",
                    "Ship5_turbo_flight_003.png",
                    "Ship5_turbo_flight_005.png",
                    "Ship5_turbo_flight_007.png",
                ], 0.25, true);
                this.turboAnimations.playState("normal");
                
                this.turboAnimations.position.set(this.SsAnimations.x-50,this.SsAnimations.y+5);
                this.cannonAnimations.position.set(this.SsAnimations.x+77, this.SsAnimations.y+5);
                this.turboAnimations.scale.set(0.75);
                this.SsAnimations.scale.set(0.75);

                this.cannonAnimations.filters = [new GlowFilter({color: 0xFAF405})];
                break;
        
            case 6:
                this.SsAnimations.addState("idle", [
                    Texture.from("Ship6.png")
                ],0.5);
                this.SsAnimations.addState("explode", [
                    "Ship6_Explosion_000.png",
                    "Ship6_Explosion_004.png",
                    "Ship6_Explosion_005.png",
                    "Ship6_Explosion_007.png",
                    "Ship6_Explosion_009.png",
                    "Ship6_Explosion_011.png",
                    "Ship6_Explosion_013.png",
                    "Ship6_Explosion_016.png",
                    "Ship6_Explosion_017.png",
                    "Ship6_Explosion_019.png",
                    "Ship6_Explosion_021.png",
                ], 0.5, false);
                this.cannonAnimations.addState("shooting", [
                    "shot6_1.png",
                    "shot6_2.png",
                    "shot6_3.png",
                    "shot6_4.png",
                ], 0.25, false);
                this.SsAnimations.playState("idle");
                this.turboAnimations.addState("normal", [
                    "Ship6_normal_flight_01.png",
                    "Ship6_normal_flight_02.png",
                    "Ship6_normal_flight_03.png",
                    "Ship6_normal_flight_04.png"
                ], 0.25);
                this.turboAnimations.addState("turbo", [
                    "Ship6_turbo_flight_001.png",
                    "Ship6_turbo_flight_003.png",
                    "Ship6_turbo_flight_005.png",
                    "Ship6_turbo_flight_007.png",
                ], 0.25, true);
                this.turboAnimations.playState("normal");
                
                this.turboAnimations.position.set(this.SsAnimations.x-50,this.SsAnimations.y);
                this.cannonAnimations.position.set(this.SsAnimations.x+90, this.SsAnimations.y+3);
                this.turboAnimations.scale.set(0.75);
                this.SsAnimations.scale.set(0.75);

                this.cannonAnimations.filters = [new GlowFilter({color: 0x7E19DF})];
                break;
        
            default:
                break;
        }

        this.Sshitbox = new Graphics();
        this.Sshitbox.beginFill(0x268212, 0);
        this.Sshitbox.drawRect(-15,-7.5,30,15);
        this.Sshitbox.endFill();

        this.SsAnimations.filters = [new GlowFilter({color: 0xFFFFFF})];
        
        this.wholeShip.addChild(this.SsAnimations,this.turboAnimations);
        this.addChild(this.wholeShip, this.Sshitbox);
        
        Keyboard.down.on("Enter", this.explode, this);
        
    }

    public override destroy(options:any) {
        super.destroy(options);
        Keyboard.down.off("Enter", this.explode);
    }

    public override update(deltaMS: number): void {

        const dt = deltaMS / 60;
        super.update(dt);
        this.SsAnimations.updateAnim(dt);
        this.turboAnimations.updateAnim(dt);
        if (this.tangible) {
            if (Keyboard.state.get("KeyD") || Keyboard.state.get("ArrowRight")) {
                if (this.turboSs) {
                    this.speed.x = Spaceship.SS_SPEED+125;
                } else {
                    this.speed.x = Spaceship.SS_SPEED;
                }
            } else {
                this.speed.x = 0;
            }
            if (Keyboard.state.get("KeyA") || Keyboard.state.get("ArrowLeft")) {
                if (this.turboSs) {
                    this.speed.x = -Spaceship.SS_SPEED-125;
                } else {
                    this.speed.x = -Spaceship.SS_SPEED;
                }
            }
            if (Keyboard.state.get("KeyW") || Keyboard.state.get("ArrowUp")) {
                if (this.turboSs) {
                    this.speed.y = -Spaceship.SS_SPEED-125;
                } else {
                    this.speed.y = -Spaceship.SS_SPEED;
                }
            } else {
                this.speed.y = 0;
            }
            if (Keyboard.state.get("KeyS") || Keyboard.state.get("ArrowDown")) {
                if (this.turboSs) {
                    this.speed.y = Spaceship.SS_SPEED+125;
                } else {
                    this.speed.y = Spaceship.SS_SPEED;
                }
            }

        }

    }

    public explode() {
        if (this.shieldSs) {
            this.shieldSs = false;
            this.SsAnimations.filters = [];
        } else {
            this.lifes--;
            this.damageUpSs = false;
            this.turboSs = false;
            this.shieldSs = true;
            this.speed.set(0);
            const explosion = sound.find("SsExplosion");
            explosion.play({volume: 0.1, singleInstance: true});
            this.wholeShip.removeChild(this.cannonAnimations, this.turboAnimations);
            this.SsAnimations.playState("explode");
            this.removeChild(this.Sshitbox);
            this.tangible = false;
            new Tween({dc:0}).to({dc:1},400).onComplete(()=>{
                this.removeChild(this.wholeShip);
            }).start();
        }
    }

    public shoot() {
        if (!this.shootingSs) {
            this.shootingSs = true;
            this.wholeShip.addChild(this.cannonAnimations);
            this.cannonAnimations.playState("shooting");
            new Tween({dc:0})
            .to({dc:1},100)
            .onComplete(()=>{
                this.shootingSs = false;
                this.wholeShip.removeChild(this.cannonAnimations);
            }).start();
        }
    }

    public respawn() {
        this.wholeShip.addChild(this.cannonAnimations, this.turboAnimations);
        this.SsAnimations.playState("idle");
        this.addChild(this.wholeShip);
        this.SsAnimations.filters = [new GlowFilter({color: 0xFFFFFF})];
        new Tween({dc:0}).
        to({dc:1}, 1500).
        onComplete(()=>{
            this.addChild(this.Sshitbox);
            this.tangible = true;
        }).
        start();
    }

    public getHitbox():Rectangle {
        return this.Sshitbox.getBounds();
    }

    public separate(overlap: Rectangle, solid: ObservablePoint<any>) {
        if (overlap.width < overlap.height){
            if (this.x > solid.x) {
                this.x += overlap.width+1;
            } else if (this.x < solid.x){
                this.x -= overlap.width;
            }
        } else {
            if (this.y < solid.y) {
                this.y -= overlap.height;
            } else if (this.x > solid.y){
                this.y += overlap.height;
            }
        }

    }

    public getBonus(bonus: string) {
        switch (bonus) {
            case "turbo":
                this.turboSs = true;
                this.turboAnimations.playState("turbo");
                break;
        
            case "shield":
                this.shieldSs = true;
                this.SsAnimations.filters = [new GlowFilter({color: 0xFFFFFF})];
                break;
        
            case "damage":
                this.damageUpSs = true;
                break;
        
            default:
                break;
        }
    }

    public dealDamage():number {
        if (this.damageUpSs){
            return this.damageSs*2;
        } else {
            return this.damageSs;
        }
    }

    public isShooting() {
        return this.shootingSs;
    }

    public isDead() {
        if (this.lifes<=0) {
            return true;
        } else {
            return false;
        }
    }

    public getLifes():number {
        return this.lifes;
    }

    public hasDammageUp() : boolean {
        return this.damageUpSs;
    }
}