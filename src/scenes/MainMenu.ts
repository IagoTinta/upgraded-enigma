import { Container } from "@pixi/display";
import { Sound, sound } from "@pixi/sound";
import { NineSlicePlane, Text, Texture, TilingSprite } from "pixi.js";
import { HEIGHT, WIDTH } from "..";
import { Button } from "../Game/Utils/Button";
import { InterUpdateable } from "../Game/Utils/InterUpdateable";


export class MainMenu extends Container implements InterUpdateable {

    private mainMenuMusic: Sound;
    private backgrounds:TilingSprite[];
    private currentBack:TilingSprite;
    private menu:Container;

    constructor() {
        super();

        this.mainMenuMusic = sound.find("Prueba");
        this.mainMenuMusic.play({volume:0.3,singleInstance:true,loop:true});
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

        this.menu = new Container();

        const board = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const boardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const tittle: Text = new Text("Larry's Adventure Day", {fontSize: 60,align:'center', fill:0xFFFFFF, fontFamily: "Cambria"});
        this.menu.addChild(board,boardtittle,tittle);
        boardtittle.position.set(166,-50);
        tittle.anchor.set(0.5);
        tittle.position.set(522.5,15);
        this.menu.scale.set(0.75);
        this.menu.pivot.set(522.5,358);
        this.menu.position.set(WIDTH/2,HEIGHT/2);
        this.addChild(this.menu);

        const play = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        play.position.set(272.5,250);
        const playText: Text = new Text("Let's Go!", {fontSize: 55,align:'center', fill:0xFFFFFF, fontFamily: "Cambria"});
        playText.anchor.set(0.5);
        playText.position.copyFrom(play.position);
        play.on(Button.CLICKED_EVENT, this.selectSound, this);
        this.menu.addChild(play,playText);
        const mute = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        mute.position.set(522.5,500);
        const muteText: Text = new Text("Mute Sound", {fontSize: 55,align:'center', fill:0xFFFFFF, fontFamily: "Cambria"});
        muteText.anchor.set(0.5);
        muteText.position.copyFrom(mute.position);
        mute.on(Button.CLICKED_EVENT, this.toggleMute, this);
        this.menu.addChild(mute,muteText);
        const credits = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        credits.position.set(772.5,250);
        const creditsText: Text = new Text("Credits", {fontSize: 55,align:'center', fill:0xFFFFFF, fontFamily: "Cambria"});
        creditsText.anchor.set(0.5);
        creditsText.position.copyFrom(credits.position);
        this.menu.addChild(credits,creditsText);

    }

    public update (deltaTime: number, _deltaFrame: number):void {

        this.currentBack.tilePosition.x -= this.worldTransform.a * deltaTime;

    }

    public selectSound() {
        sound.play("Select", {volume: 0.3, singleInstance: true,loop:true});
    }
    public toggleMute() {
        sound.toggleMuteAll();
    }

}