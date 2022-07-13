import { Container } from "@pixi/display";
import { Sound, sound } from "@pixi/sound";
import { NineSlicePlane, Sprite, Text, Texture } from "pixi.js";
import { BaseScene } from "../Game/Utils/BaseScene";
import { Button } from "../Game/Utils/Button";
import { Manager } from "../Game/Utils/Manager";
import { Level } from "./Level";


export class MainMenu extends BaseScene {

    private mainMenuMusic: Sound;
    private background:Sprite;
    private menuScreen:Container;
    private creditsScreen: Container;
    private SFX: Map<String,Sound>;
    private onCredits = false;

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

        this.mainMenuMusic = sound.find("MainMenuMusic");
        this.mainMenuMusic.play({volume:0.2,singleInstance:true,loop:true});
        this.mainMenuMusic.muted = false;
        this.SFX = new Map([]);
        const selectSound = sound.find("Select"); 
        this.SFX.set("Select",selectSound);

        const start = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        start.position.set(272.5,250);
        const startText: Text = new Text("Start", Manager.TEXT_STYLE);
        startText.anchor.set(0.5);
        startText.position.copyFrom(start.position);
        start.on(Button.CLICKED_EVENT, this.startGame, this);
        this.menuScreen.addChild(start,startText);
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
        credits.on(Button.CLICKED_EVENT, this.changeScreen, this);
        this.menuScreen.addChild(credits,creditsText);

        this.creditsScreen = new Container();
        const creditsBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const creditsBoardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const creditsTextWindow = new NineSlicePlane(Texture.from("textWindow"),35,35,35,35);
        const creditsTittle: Text = new Text("Credits\nMade by Tragedy Boy", Manager.TEXT_STYLE);
        const creditsLore: Text = new Text(
            "Pending Text", 
            Manager.TEXT_STYLE);
        this.creditsScreen.addChild(creditsBoard,creditsTextWindow,creditsLore,creditsBoardtittle,creditsTittle);
        creditsBoardtittle.position.set(166,-50);
        creditsTextWindow.pivot.set(260,195.5);
        creditsTextWindow.position.set(creditsBoard.width/2,creditsBoard.height/2);
        creditsTextWindow.scale.set(1.685,1.1);
        creditsLore.scale.set(0.6,0.75);
        creditsLore.anchor.set(0.5);
        creditsLore.position.copyFrom(creditsTextWindow);
        creditsTittle.anchor.set(0.5);
        creditsTittle.position.set(522.5,15);
        this.creditsScreen.scale.set(0.75);
        this.creditsScreen.pivot.set(522.5,358);
        this.creditsScreen.position.set(Manager.WIDTH/2,Manager.HEIGHT/2);

        const creditsReturn = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        creditsReturn.position.set(522.5,675);
        const creditsReturnText: Text = new Text("Return", Manager.TEXT_STYLE);
        creditsReturnText.anchor.set(0.5);
        creditsReturnText.position.copyFrom(creditsReturn);
        creditsReturn.on(Button.CLICKED_EVENT, this.changeScreen, this);
        this.creditsScreen.addChild(creditsReturn,creditsReturnText);

    }

    public update (_deltaTime: number, _deltaFrame: number):void {

    }

    public startGame() {
        const auxSound = this.SFX.get("Select");
        auxSound?.play({volume: 0.2, singleInstance: true,speed:1.1});
        this.mainMenuMusic.muted = true;
        Manager.changeScene(new Level());
    }
    public changeScreen() {
        if (!this.onCredits) {
            const auxSound = this.SFX.get("Select");
            auxSound?.play({volume: 0.5, singleInstance: true,speed:1.1});
            this.removeChild(this.menuScreen);
            this.addChild(this.creditsScreen);
            this.onCredits = true;
        } else if (this.onCredits) {
            const auxSound = this.SFX.get("Select");
            auxSound?.play({volume: 0.5, singleInstance: true,speed:1.1});
            this.removeChild(this.creditsScreen);
            this.addChild(this.menuScreen);
            this.onCredits = false;
        }
    }
    private muteMusic() {
        if (!this.mainMenuMusic.muted) {
            this.mainMenuMusic.muted = true;
        } else {
            this.mainMenuMusic.muted = false;
        }
    }
    private muteSFX() {
        if (!this.SFX.get("Select")?.muted) {
            this.SFX.forEach((key)=> key.muted = true);
        } else {
            this.SFX.forEach((key)=> key.muted = false);
        }
    }

}