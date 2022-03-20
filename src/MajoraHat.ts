import { Container, Sprite } from "pixi.js";

export class MajoraHat extends Container{

    constructor() {

        super();

        const Majora: Sprite = Sprite.from("myMajora");
	
	    Majora.anchor.set(0.5);

	    const marioHat: Sprite = Sprite.from("Mario_Hat");

	    marioHat.position.set(-130,-300);

        this.addChild(Majora);
	    this.addChild(marioHat);


    }

}