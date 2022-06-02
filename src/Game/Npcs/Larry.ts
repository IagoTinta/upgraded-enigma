import { AnimatedSprite, Graphics, ObservablePoint, Rectangle, Sprite, Texture} from "pixi.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { Keyboard } from "../Utils/Keyboard";


export class Larry extends PhysicsContainer implements InterUpdateable,InterHitbox {

    //Animaciones
    private walking: AnimatedSprite;
    private idle:Sprite;
    private crouching:AnimatedSprite;
    private jumping:Sprite;
    private standingAttack: AnimatedSprite;

    //hitboxes
    private hitbox:Graphics;

    //stats
    private health = 100;

    //constantes y condiciones
    private static readonly GRAVITY = 200;
    private static readonly MOVE_SPEED = 300;
    public canJump = true;
    private facingRight = true;
    public damageCheck = true;

    constructor(){

        super();
        this.walking = new AnimatedSprite (
            [
                Texture.from("walkLarry1"),
                Texture.from("walkLarry2"),
                Texture.from("walkLarry3"),
                Texture.from("walkLarry4"),
                Texture.from("walkLarry5"),
                Texture.from("walkLarry6"),
            ], false
        );
        this.idle = Sprite.from("idleLarry");
        this.crouching = new AnimatedSprite (
            [
                Texture.from("crouchLarry3")
            ], false
        );
        this.standingAttack = new AnimatedSprite (
            [
                Texture.from("groundAttack1"),
                Texture.from("groundAttack2"),
                Texture.from("groundAttack3"),
                Texture.from("groundAttack4"),
            ], false
        );
        this.jumping = Sprite.from("jumpLarry1");
        this.idle.anchor.set(0.5);
        this.walking.anchor.set(0.5);
        this.walking.play();
        this.walking.animationSpeed = 0.175;
        this.walking.visible = false;
        this.crouching.anchor.set(0.5);
        this.crouching.position.y = 7;
        this.crouching.play();
        this.crouching.visible = false;
        this.jumping.anchor.set(0.5);
        this.jumping.visible = false;
        this.standingAttack.anchor.set(0.5);
        this.standingAttack.animationSpeed = 0.175;
        this.standingAttack.visible = false;
        

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0x268212, 0.5);
        this.hitbox.drawRect(0,0,18,46);
        this.hitbox.endFill();
        this.hitbox.position.set(-9,-23);

        this.acceleration.y = Larry.GRAVITY;
        this.addChild(
            this.walking,
            this.idle,
            this.crouching,
            this.jumping,
            this.standingAttack
        );
        this.addChild(this.hitbox);

        Keyboard.down.on("KeyW", this.jump, this);
        Keyboard.down.on("Space", this.attack, this);

    }

    public override destroy(options:any) {
        super.destroy(options);
        Keyboard.down.off("KeyW", this.jump);
        Keyboard.down.off("Space", this.attack);
    }

    public override update(deltaMS: number): void {
        const dt = deltaMS / (60);
        super.update(dt);
        this.walking.update(dt / (1/60));
        this.standingAttack.update(dt / (1/60));
        if (Keyboard.state.get("KeyS") && this.canJump && !this.standingAttack.playing) {
            this.idle.visible = false;
            this.walking.visible = false;
            this.crouching.visible = true;
            this.speed.x = 0;
            if (!this.facingRight) {
                this.scale.set(-4,4);
            } else {
                this.scale.set(4);
            }
        } else {
            this.crouching.visible = false;
            if (Keyboard.state.get("KeyD") && this.canJump && !this.standingAttack.playing) {
                this.walking.visible = true;
                this.idle.visible = false;
                this.speed.x = Larry.MOVE_SPEED;
                this.facingRight = true;
                if (this.facingRight) {
                    this.scale.set(4);
                }
            } else if (!this.standingAttack.playing) {
                this.walking.visible = false;
                if (this.canJump) {
                    this.idle.visible = true;
                    this.jumping.visible = false;
                }
                this.speed.x = 0;
                if(this.facingRight) {
                    this.scale.set(4);
                } else {
                    this.scale.set(-4,4);
                }
            }
            if (Keyboard.state.get("KeyA") && this.canJump && !this.standingAttack.playing) {
                this.walking.visible = true;
                this.idle.visible = false;
                this.speed.x = -Larry.MOVE_SPEED;
                this.facingRight = false;
                if (!this.facingRight){
                    this.scale.set(-4,4);
                }
            }
        }
        if (Keyboard.state.get("KeyD") && !this.canJump && this.y < 900) {
            this.speed.x = Larry.MOVE_SPEED;
            this.scale.set(4);
        } else if (Keyboard.state.get("KeyA") && !this.canJump && this.y < 900) {
            this.speed.x = -Larry.MOVE_SPEED;
            this.scale.set(-4,4);
        } else  if (this.y > 900 || this.speed.y == 0) {
            this.jumping.visible = false;
            this.canJump = true;
        }
        
    }

    public getHitbox():Rectangle {
        return this.hitbox.getBounds();
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
                this.canJump = true;
            } else if (this.x > objeto.y){
                this.y += overlap.height;
            }
        }

    }

    public receiveDamage(damage: number) {
        this.health -= damage;
    }

    public isDead():boolean {
       if(this.health <= 0) {
           return true;
       } else {
           return false;
       }
    }

    private jump() {
        if (this.canJump && !this.standingAttack.playing) {
            this.idle.visible = false;
            this.jumping.visible = true;
            this.speed.y = -Larry.MOVE_SPEED-100;
            this.canJump = false;
        }
    }

    private attack() {
        if (!this.standingAttack.playing && this.canJump) {
            this.speed.x = 0;
            this.walking.visible = false;
            this.standingAttack.play();
            this.idle.visible = false;
            this.standingAttack.visible = true;
            setTimeout(() => {
                this.standingAttack.stop();
                this.standingAttack.visible = false;
                this.idle.visible = true;
            }, 350);
        }
    }

}