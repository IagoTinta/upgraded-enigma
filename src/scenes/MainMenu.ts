import { Container } from "@pixi/display";
import { NineSlicePlane, Sprite, Text, Texture } from "pixi.js";
import { BaseScene } from "../Game/Utils/BaseScene";
import { Button } from "../Game/Utils/Button";
import { Manager } from "../Game/Utils/Manager";
import { CreditsScreen } from "./CreditsScreen";
import { ShipAndStageSelect } from "./Ship&StageSelect";


export class MainMenu extends BaseScene {

    private background:Sprite;
    private menuScreen:Container;
    private credits: CreditsScreen;
    public onCredits = false;

    constructor() {
        super();

        this.background = Sprite.from("MainMenuBack");
        this.background.scale.set(0.5);
        this.addChild(this.background);

        this.menuScreen = new Container();

        const menuBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const menuBoardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const menuTittle: Text = new Text("Battle for Andromeda", Manager.TEXT_STYLE);
        this.menuScreen.addChild(menuBoard,menuBoardtittle,menuTittle);
        menuBoardtittle.position.set(166,-50);
        menuTittle.anchor.set(0.5);
        menuTittle.position.set(522.5,15);
        this.menuScreen.scale.set(0.75);
        this.menuScreen.pivot.set(522.5,358);
        this.menuScreen.position.set(Manager.WIDTH/2,Manager.HEIGHT/2);
        this.addChild(this.menuScreen);

        Manager.playMusic("MainMenuMusic");

        const select = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        select.position.set(272.5,250);
        const startText: Text = new Text("Select Stage\n & Ship", Manager.TEXT_STYLE);
        startText.anchor.set(0.5);
        startText.position.copyFrom(select.position);
        select.on(Button.CLICKED_EVENT, this.selectScreen, this);
        this.menuScreen.addChild(select,startText);
        const muteMusic = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        muteMusic.position.set(272.5,500);
        const muteText: Text = new Text("Mute Music", Manager.TEXT_STYLE);
        muteText.anchor.set(0.5);
        muteText.position.copyFrom(muteMusic.position);
        muteMusic.on(Button.CLICKED_EVENT, this.muteMusic, this);
        this.menuScreen.addChild(muteMusic,muteText);
        const muteSFX = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        muteSFX.position.set(772.5,500);
        const mSFXText: Text = new Text("Mute SFX", Manager.TEXT_STYLE);
        mSFXText.anchor.set(0.5);
        mSFXText.position.copyFrom(muteSFX.position);
        muteSFX.on(Button.CLICKED_EVENT, this.muteSFX, this);
        this.menuScreen.addChild(muteSFX,mSFXText);
        const credits = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        credits.position.set(772.5,250);
        const creditsText: Text = new Text("Credits", Manager.TEXT_STYLE);
        creditsText.anchor.set(0.5);
        creditsText.position.copyFrom(credits.position);
        credits.on(Button.CLICKED_EVENT, this.goCredits, this);
        this.menuScreen.addChild(credits,creditsText);

        this.credits = new CreditsScreen();

    }

    public update (_deltaTime: number, _deltaFrame: number):void {

        if (this.credits.destroyed) {
            this.onCredits = false;
        }

    }

    public selectScreen() {
        if (!this.onCredits) {
            Manager.playSFX("Select")
            Manager.changeScene(new ShipAndStageSelect());
        }
    }
    public goCredits() {
        if (!this.onCredits) {
            Manager.playSFX("Select");
            this.credits = new CreditsScreen();
            this.addChild(this.credits);
            this.onCredits = true;
        }
    }
    private muteMusic() {
        if (!this.onCredits) {
            Manager.muteMusic();
        }
    }
    private muteSFX() {
        Manager.muteSFX();
    }

}