import { Container, NineSlicePlane, Sprite, Text, Texture } from "pixi.js";
import { BaseScene } from "../Game/Utils/BaseScene";
import { Manager } from "../Game/Utils/Manager";


export class ShipAndStageSelect extends BaseScene {

    private background: Sprite;
    private SASscreen: Container;

    constructor() {

        super();
        
        this.background = Sprite.from("MainMenuBack");
        this.background.scale.set(0.5);
        this.addChild(this.background);

        this.SASscreen = new Container();

        const SASBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const SASBoardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const SASTittle: Text = new Text("Battle for Andromeda", Manager.TEXT_STYLE);
        this.SASscreen.addChild(SASBoard,SASBoardtittle,SASTittle);
        SASBoardtittle.position.set(166,-50);
        SASTittle.anchor.set(0.5);
        SASTittle.position.set(522.5,15);
        this.SASscreen.scale.set(0.75);
        this.SASscreen.pivot.set(522.5,358);
        this.SASscreen.position.set(Manager.WIDTH/2,Manager.HEIGHT/2);
        this.addChild(this.SASscreen);

    }

    public update (_deltaTime: number, _deltaFrame: number):void {

    }

}