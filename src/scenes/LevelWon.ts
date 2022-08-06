import { Sound, sound } from "@pixi/sound";
import { Container, NineSlicePlane, Sprite, Text, Texture } from "pixi.js";
import { BaseScene } from "../Game/Utils/BaseScene";
import { Button } from "../Game/Utils/Button";
import { Manager } from "../Game/Utils/Manager";
import { Level } from "./Level";
import { MainMenu } from "./MainMenu";


export class LevelWon extends BaseScene {

    private background: Sprite;
    private wonScreen: Container;
    private wonMusic: Sound;
    private wonSFX: Sound;
    

    constructor(musicmuted: boolean, sfxmuted: boolean, totalpoints: number) {

        super();

        this.background = Sprite.from("LevelWonBack");
        this.addChild(this.background);

        this.wonScreen = new Container();

        const winBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const winBoardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const winTittle: Text = new Text("The Galaxy is Saved!", Manager.TEXT_STYLE);
        this.wonScreen.addChild(winBoard,winBoardtittle,winTittle);
        winBoardtittle.position.set(135,-50);
        winBoardtittle.scale.set(1.1,0.8);
        winTittle.anchor.set(0.5);
        winTittle.x = winBoard.width/2;
        this.wonScreen.scale.set(0.75);
        this.wonScreen.pivot.set(522.5,358);
        this.wonScreen.position.set(Manager.WIDTH/2,Manager.HEIGHT/2);

        const finalscore = new Text("Final Score: " + totalpoints, Manager.TEXT_STYLE);
        finalscore.anchor.set(0.5);
        finalscore.position.set(winBoard.width/2, winBoardtittle.y+200);
        this.wonScreen.addChild(finalscore);

        const back = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        back.position.set(272.5,300);
        const backText: Text = new Text("Back to \n Main Menu", Manager.TEXT_STYLE);
        backText.anchor.set(0.5);
        backText.position.copyFrom(back);
        back.on(Button.CLICKED_EVENT, this.back2Menu, this);
        this.wonScreen.addChild(back,backText);
        const playAgain = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        playAgain.position.set(772.5,300);
        const retryText: Text = new Text("Play Again", Manager.TEXT_STYLE);
        retryText.anchor.set(0.5);
        retryText.position.copyFrom(playAgain);
        playAgain.on(Button.CLICKED_EVENT, this.playAgain, this);
        this.wonScreen.addChild(playAgain,retryText);
        this.addChild(this.wonScreen);
        const muteMusic = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        muteMusic.position.set(272.5,525);
        const muteText: Text = new Text("Mute Music", Manager.TEXT_STYLE);
        muteText.anchor.set(0.5);
        muteText.position.copyFrom(muteMusic.position);
        muteMusic.on(Button.CLICKED_EVENT, this.muteMusic, this);
        this.wonScreen.addChild(muteMusic,muteText);
        const muteSFX = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        muteSFX.position.set(772.5,525);
        const mSFXText: Text = new Text("Mute SFX", Manager.TEXT_STYLE);
        mSFXText.anchor.set(0.5);
        mSFXText.position.copyFrom(muteSFX.position);
        muteSFX.on(Button.CLICKED_EVENT, this.muteSFX, this);
        this.wonScreen.addChild(muteSFX,mSFXText);

        this.wonMusic = sound.find("GameOverMusic");
        this.wonMusic.play({volume:0.2,singleInstance:true,loop:true});
        this.wonMusic.muted = musicmuted;

        this.wonSFX = sound.find("Select");
        this.wonSFX.muted = sfxmuted;

    }

    public update (_deltaTime: number, _deltaFrame: number):void {

    }

    public back2Menu() {
        this.wonSFX.play({volume: 0.25, singleInstance: true});
        Manager.changeScene(new MainMenu(this.wonMusic.muted, this.wonSFX.muted));
        this.wonMusic.muted = true;
        this.wonSFX.muted = true;
    }

    public playAgain() {

        this.wonSFX.play({volume: 0.25, singleInstance: true});
        Manager.changeScene(new Level(this.wonMusic.muted, this.wonSFX.muted));
        this.wonMusic.muted = true;
        this.wonSFX.muted = true;

    }

    private muteMusic() {
        if (!this.wonMusic.muted) {
            this.wonMusic.muted = true;
        } else {
            this.wonMusic.muted = false;
        }
    }
    private muteSFX() {
        if (!this.wonSFX.muted) {
            this.wonSFX.muted = true;
        } else {
            this.wonSFX.muted = false;
        }
    }

}