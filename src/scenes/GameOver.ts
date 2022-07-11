import { Sound, sound } from "@pixi/sound";
import { Container, NineSlicePlane, Text, Texture, TilingSprite } from "pixi.js";
import { Button } from "../Game/Utils/Button";
import { InterUpdateable } from "../Game/Utils/InterUpdateable";
import { Manager } from "../Game/Utils/Manager";
import { MainMenu } from "./MainMenu";


export class GameOver extends Container implements InterUpdateable{

    private gameoverScreen: Container;
    private background: TilingSprite;
    private music: Sound;

    constructor() {
        super();

        this.background = new TilingSprite(Texture.from("GameOverBack"),Manager.WIDTH,Manager.HEIGHT);
        this.addChild(this.background);
        //era de 3500 x 1969

        this.gameoverScreen = new Container();

        const menuBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const menuTittle: Text = new Text("Larry is Dead, how tragic...", Manager.TEXT_STYLE);
        this.gameoverScreen.addChild(menuBoard,menuTittle);;
        menuTittle.anchor.set(0.5);
        menuTittle.position.set(menuBoard.width/2,menuBoard.height/2);
        this.gameoverScreen.scale.set(0.75);
        this.gameoverScreen.pivot.set(522.5,358);
        this.gameoverScreen.position.set(Manager.WIDTH/2,Manager.HEIGHT/2);
        const back = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        back.position.set(522.5,675);
        const backText: Text = new Text("Back to \n Main Menu", Manager.TEXT_STYLE);
        backText.anchor.set(0.5);
        backText.position.copyFrom(back);
        back.on(Button.CLICKED_EVENT, this.back2Menu, this);
        this.gameoverScreen.addChild(back,backText);
        this.addChild(this.gameoverScreen);

        this.music = sound.find("GameOver");
        this.music.play({volume:0.2,singleInstance:true,loop:true});
        this.music.muted = false;

    }

    public update (deltaTime: number, _deltaFrame: number):void {

        this.background.tilePosition.x -= this.worldTransform.a * deltaTime;

    }

    public back2Menu() {
        const auxSound = sound.find("Start");
        auxSound.play({volume: 0.2, singleInstance: true,speed:1.1});
        this.music.muted = true;
        const newScene = new MainMenu();
        Manager.changeScene(newScene)
    }

}