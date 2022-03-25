import { Container, Sprite, Texture } from "pixi.js";


export class Button extends Container{

    private def:Texture;
    private down:Texture;
    private over:Texture;
    private spr:Sprite;

    constructor (def:Texture, down:Texture, over:Texture){

        super();
        this.def = def;
        this.down = down;
        this.over = over;

        this.spr = Sprite.from(def);
        this.spr.anchor.set(0.5);
        this.addChild(this.spr);

        this.spr.interactive = true;
        this.on();

    }

    private onPointerDown():void {

        this.spr

    }

}