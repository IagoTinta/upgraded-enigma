import { AnimatedSprite, Container, Texture} from "pixi.js";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { Keyboard } from "../Utils/Keyboard";


export class Larry extends Container implements InterUpdateable{

    private walkingLarry: AnimatedSprite;
    private facingRight:boolean;

    constructor(){

        super();
        this.walkingLarry = new AnimatedSprite (
            [
                Texture.from("walkLarry1"),
                Texture.from("walkLarry2"),
                Texture.from("walkLarry3"),
                Texture.from("walkLarry4"),
                Texture.from("walkLarry5"),
                Texture.from("walkLarry6"),
            ], false
        );
        this.walkingLarry.anchor.set(0.5);
        this.walkingLarry.scale.set(2.5);
        this.walkingLarry.play();
        this.walkingLarry.animationSpeed = 0.175;
        this.addChild(this.walkingLarry);
        this.facingRight = true;

    }
    public update(deltaFrame: number, _deltaTime: number): void {
        this.walkingLarry.update(deltaFrame);
        if (Keyboard.state.get("KeyD")) {
            this.walkingLarry.x += 5;
            if (!this.facingRight) {
                this.walkingLarry.scale.set(2.5);
                this.facingRight=true;
            }
        }
        if (Keyboard.state.get("KeyA")) {
            this.walkingLarry.x -= 5;
            if (this.facingRight){
                this.walkingLarry.scale.set(-2.5,2.5);
                this.facingRight = false;
            }
        }
    }

}