import { AnimatedSprite, Container, Rectangle, Texture } from "pixi.js";
import { InterHitbox } from "../Utils/InterHitbox";


export class Weapon extends Container implements InterHitbox {

    private swing: AnimatedSprite;

    constructor() {
        super();

        this.swing = new AnimatedSprite (
            [
                Texture.from("verticalSword1"),
                Texture.from("verticalSword2"),
                Texture.from("verticalSword3"),
                Texture.from("verticalSword4"),
            ], false
        );
        this.swing.anchor.set(0.5);
        this.swing.position.set(0.5);

    }
    
    getHitbox(): Rectangle {
        throw new Error("Method not implemented.");
    }

    

}