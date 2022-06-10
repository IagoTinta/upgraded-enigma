import { Container } from "@pixi/display";
import { Sound, sound } from "@pixi/sound";
import { NineSlicePlane, Text, Texture, TilingSprite } from "pixi.js";
import { changeScene, HEIGHT, WIDTH } from "..";
import { Button } from "../Game/Utils/Button";
import { InterUpdateable } from "../Game/Utils/InterUpdateable";
import { FrostWoods } from "./FrostWoods";


export class MainMenu extends Container implements InterUpdateable {

    private mainMenuMusic: Sound;
    private backgrounds:TilingSprite[];
    private currentBack:TilingSprite;
    private menuScreen:Container;
    private creditsScreen: Container;
    private SFX: Map<String,Sound>;
    private onCredits = false;

    constructor() {
        super();

        this.backgrounds = [];
        const backg1 = new TilingSprite(Texture.from("AmatistDream"),WIDTH,HEIGHT);
        this.backgrounds.push(backg1);
        const backg2 = new TilingSprite(Texture.from("FrostWoods"),WIDTH,HEIGHT);
        this.backgrounds.push(backg2);
        const backg3 = new TilingSprite(Texture.from("MushroomLand"),WIDTH,HEIGHT);
        this.backgrounds.push(backg3);
        const backg4 = new TilingSprite(Texture.from("TropicalGrounds"),WIDTH,HEIGHT);
        this.backgrounds.push(backg4);
        this.currentBack = this.backgrounds[Math.floor(Math.random()*this.backgrounds.length)];
        this.addChild(this.currentBack);

        this.menuScreen = new Container();

        const menuBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const menuBoardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const menuTittle: Text = new Text("Larry's Adventure Day", {fontSize: 60,align:'center', fill:0x000000, fontFamily: "Cambria"});
        this.menuScreen.addChild(menuBoard,menuBoardtittle,menuTittle);
        menuBoardtittle.position.set(166,-50);
        menuTittle.anchor.set(0.5);
        menuTittle.position.set(522.5,15);
        this.menuScreen.scale.set(0.75);
        this.menuScreen.pivot.set(522.5,358);
        this.menuScreen.position.set(WIDTH/2,HEIGHT/2);
        this.addChild(this.menuScreen);

        this.mainMenuMusic = sound.find("Prueba");
        this.mainMenuMusic.play({volume:0.2,singleInstance:true,loop:true});
        this.mainMenuMusic.muted = false;
        this.SFX = new Map([]);
        const creditsSound = sound.find("Credits"); 
        this.SFX.set("Credits",creditsSound);
        const startSound = sound.find("Start"); 
        this.SFX.set("Start",startSound);

        const start = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        start.position.set(272.5,250);
        const startText: Text = new Text("Let's Go!", {fontSize: 55,align:'center', fill:0x000000, fontFamily: "Cambria"});
        startText.anchor.set(0.5);
        startText.position.copyFrom(start.position);
        start.on(Button.CLICKED_EVENT, this.startGame, this);
        this.menuScreen.addChild(start,startText);
        const muteMusic = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        muteMusic.position.set(272.5,500);
        const muteText: Text = new Text("Mute Music", {fontSize: 55,align:'center', fill:0x000000, fontFamily: "Cambria"});
        muteText.anchor.set(0.5);
        muteText.position.copyFrom(muteMusic.position);
        muteMusic.on(Button.CLICKED_EVENT, this.muteMusic, this);
        this.menuScreen.addChild(muteMusic,muteText);
        const muteSFX = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        muteSFX.position.set(772.5,500);
        const mSFXText: Text = new Text("Mute SFX", {fontSize: 55,align:'center', fill:0x000000, fontFamily: "Cambria"});
        mSFXText.anchor.set(0.5);
        mSFXText.position.copyFrom(muteSFX.position);
        muteSFX.on(Button.CLICKED_EVENT, this.muteSFX, this);
        this.menuScreen.addChild(muteSFX,mSFXText);
        const credits = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        credits.position.set(772.5,250);
        const creditsText: Text = new Text("Credits", {fontSize: 55,align:'center', fill:0x000000, fontFamily: "Cambria"});
        creditsText.anchor.set(0.5);
        creditsText.position.copyFrom(credits.position);
        credits.on(Button.CLICKED_EVENT, this.changeScreen, this);
        this.menuScreen.addChild(credits,creditsText);

        this.creditsScreen = new Container();
        const credtisBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const creditsBoardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const creditsTittle: Text = new Text("Credits", {fontSize: 60,align:'center', fill:0x000000, fontFamily: "Cambria"});
        this.creditsScreen.addChild(credtisBoard,creditsBoardtittle,creditsTittle);
        creditsBoardtittle.position.set(166,-50);
        creditsTittle.anchor.set(0.5);
        creditsTittle.position.set(522.5,15);
        this.creditsScreen.scale.set(0.75);
        this.creditsScreen.pivot.set(522.5,358);
        this.creditsScreen.position.set(WIDTH/2,HEIGHT/2);

        const creditsReturn = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        creditsReturn.position.set(522.5,675);
        const creditsReturnText: Text = new Text("Return", {fontSize: 55,align:'center', fill:0x000000, fontFamily: "Cambria"});
        creditsReturnText.anchor.set(0.5);
        creditsReturnText.position.copyFrom(creditsReturn);
        creditsReturn.on(Button.CLICKED_EVENT, this.changeScreen, this);
        this.creditsScreen.addChild(creditsReturn,creditsReturnText);

    }

    public update (deltaTime: number, _deltaFrame: number):void {

        this.currentBack.tilePosition.x -= this.worldTransform.a * deltaTime;

    }

    public startGame() {
        const auxSound = this.SFX.get("Start");
        auxSound?.play({volume: 0.2, singleInstance: true,speed:1.1});
        this.mainMenuMusic.muted = true;
        const newScene = new FrostWoods();
        changeScene(newScene)
    }
    public changeScreen() {
        if (!this.onCredits) {
            const auxSound = this.SFX.get("Credits");
            auxSound?.play({volume: 0.5, singleInstance: true,speed:1.1});
            this.removeChild(this.menuScreen);
            this.addChild(this.creditsScreen);
            this.onCredits = true;
        } else if (this.onCredits) {
            const auxSound = this.SFX.get("Credits");
            auxSound?.play({volume: 0.5, singleInstance: true,speed:1.1});
            this.removeChild(this.creditsScreen);
            this.addChild(this.menuScreen);
            this.onCredits = false;
        }
    }
    public muteMusic() {
        if (!this.mainMenuMusic.muted) {
            this.mainMenuMusic.muted = true;
        } else {
            this.mainMenuMusic.muted = false;
        }
    }
    public muteSFX() {
        if (!this.SFX.get("Start")?.muted) {
            this.SFX.forEach((key)=> key.muted = true);
        } else {
            this.SFX.forEach((key)=> key.muted = false);
        }
    }

}