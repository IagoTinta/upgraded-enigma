import { sound } from "@pixi/sound";
import { NineSlicePlane, Text, Texture } from "pixi.js";
import { BaseScene } from "../Game/Utils/BaseScene";
import { Button } from "../Game/Utils/Button";
import { Manager } from "../Game/Utils/Manager";


export class CreditsScreen extends BaseScene {

    constructor() {

        super();

        const creditsBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const creditsBoardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const creditsTextWindow = new NineSlicePlane(Texture.from("textWindow"),35,35,35,35);
        const creditsTittle: Text = new Text("Credits\nMade by Tragedy Boy", Manager.TEXT_STYLE);
        const creditsLore: Text = new Text(
            "It is the year 3405, humanity has achieved its way to the \n" + 
            "Andromeda galaxy in search of other planets to inhabit.\n" + 
            "Unfortunately, it was invaded by the Xerkai, a technologically\n" + 
            "advanced species whose goal is to take this and all nearby\n" + 
            "galaxies to consume them. Fortunately for humans, they find\n" + 
            "themselves in the middle of a civil war: On the one hand\n" + 
            "the Xertac, fanatics of technology and metal; and on the\n" + 
            "other the Xermal, whose beliefs are oriented towards the old\n" + 
            "customs of the species, centered on its carnal form. Now,\n" + 
            "everything is up to you, the best general of humanity, to take\n" + 
            "advantage of this weakness in the enemy forces to destroy them\n" + 
            "and put an end once and for all to the Xerkian invasion.\n",
            Manager.TEXT_STYLE);
        this.addChild(creditsBoard,creditsTextWindow,creditsLore,creditsBoardtittle,creditsTittle);
        creditsBoardtittle.position.set(166,-50);
        creditsTextWindow.pivot.set(260,195.5);
        creditsTextWindow.position.set(creditsBoard.width/2,(creditsBoard.height/2)+10);
        creditsTextWindow.scale.set(1.685,1.3);
        creditsLore.scale.set(0.6,0.75);
        creditsLore.anchor.set(0.5);
        creditsLore.position.set(creditsTextWindow.x,creditsTextWindow.y+10);
        creditsTittle.anchor.set(0.5);
        creditsTittle.position.set(522.5,15);
        this.scale.set(0.75);
        this.pivot.set(522.5,358);

        const creditsReturn = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        creditsReturn.position.set(522.5,725);
        const creditsReturnText: Text = new Text("Return", Manager.TEXT_STYLE);
        creditsReturnText.anchor.set(0.5);
        creditsReturnText.position.copyFrom(creditsReturn);
        creditsReturn.on(Button.CLICKED_EVENT, this.goBack, this);
        this.addChild(creditsReturn,creditsReturnText);
        this.position.set(Manager.WIDTH/2, Manager.HEIGHT/2);
        
    }

    public update (_deltaTime: number, _deltaFrame: number):void {

    }

    public goBack () {
        this.destroy();
        const select = sound.find("Select");
        select.play({volume: 0.5, singleInstance: true});
    }

}