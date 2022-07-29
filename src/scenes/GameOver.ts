import { Sound, sound } from "@pixi/sound";
import { Container, NineSlicePlane, Sprite, Text, Texture} from "pixi.js";
import { BaseScene } from "../Game/Utils/BaseScene";
import { Button } from "../Game/Utils/Button";
import { Manager } from "../Game/Utils/Manager";
import { Level } from "./Level";
import { MainMenu } from "./MainMenu";


export class GameOver extends BaseScene{

    private gameoverScreen: Container;
    private background: Sprite;
    private gameoverMusic: Sound;
    private gameoverSFX: Sound;

    constructor(musicmuted: boolean, sfxmuted: boolean) {
        super();

        this.background = Sprite.from("GameOverBack");
        this.addChild(this.background);

        this.gameoverScreen = new Container();

        const gameoverBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const gameoverBoardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const gameoverTittle: Text = new Text("You can still save Andromeda!", Manager.TEXT_STYLE);
        this.gameoverScreen.addChild(gameoverBoard,gameoverBoardtittle,gameoverTittle);
        gameoverBoardtittle.position.set(135,-50);
        gameoverBoardtittle.scale.set(1.1,0.8);
        gameoverTittle.anchor.set(0.5);
        gameoverTittle.x = gameoverBoard.width/2;
        this.gameoverScreen.scale.set(0.75);
        this.gameoverScreen.pivot.set(522.5,358);
        this.gameoverScreen.position.set(Manager.WIDTH/2,Manager.HEIGHT/2);

        const back = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        back.position.set(272.5,250);
        const backText: Text = new Text("Back to \n Main Menu", Manager.TEXT_STYLE);
        backText.anchor.set(0.5);
        backText.position.copyFrom(back);
        back.on(Button.CLICKED_EVENT, this.back2Menu, this);
        this.gameoverScreen.addChild(back,backText);
        const retry = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        retry.position.set(772.5,250);
        const retryText: Text = new Text("Retry Level", Manager.TEXT_STYLE);
        retryText.anchor.set(0.5);
        retryText.position.copyFrom(retry);
        retry.on(Button.CLICKED_EVENT, this.retrylevel, this);
        this.gameoverScreen.addChild(retry,retryText);
        this.addChild(this.gameoverScreen);
        const muteMusic = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        muteMusic.position.set(272.5,500);
        const muteText: Text = new Text("Mute Music", Manager.TEXT_STYLE);
        muteText.anchor.set(0.5);
        muteText.position.copyFrom(muteMusic.position);
        muteMusic.on(Button.CLICKED_EVENT, this.muteMusic, this);
        this.gameoverScreen.addChild(muteMusic,muteText);
        const muteSFX = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        muteSFX.position.set(772.5,500);
        const mSFXText: Text = new Text("Mute SFX", Manager.TEXT_STYLE);
        mSFXText.anchor.set(0.5);
        mSFXText.position.copyFrom(muteSFX.position);
        muteSFX.on(Button.CLICKED_EVENT, this.muteSFX, this);
        this.gameoverScreen.addChild(muteSFX,mSFXText);

        this.gameoverMusic = sound.find("GameOverMusic");
        this.gameoverMusic.play({volume:0.2,singleInstance:true,loop:true});
        this.gameoverMusic.muted = musicmuted;

        this.gameoverSFX = sound.find("Select");
        this.gameoverSFX.muted = sfxmuted;
        console.log(musicmuted);

    }

    public update (_deltaTime: number, _deltaFrame: number):void {

    }

    public back2Menu() {
        this.gameoverSFX.play({volume: 0.25, singleInstance: true});
        Manager.changeScene(new MainMenu(this.gameoverMusic.muted, this.gameoverSFX.muted));
        this.gameoverMusic.muted = true;
        this.gameoverSFX.muted = true;
    }

    public retrylevel() {

        this.gameoverSFX.play({volume: 0.25, singleInstance: true});
        Manager.changeScene(new Level(this.gameoverMusic.muted, this.gameoverSFX.muted));
        this.gameoverMusic.muted = true;
        this.gameoverSFX.muted = true;

    }

    private muteMusic() {
        if (!this.gameoverMusic.muted) {
            this.gameoverMusic.muted = true;
        } else {
            this.gameoverMusic.muted = false;
        }
    }
    private muteSFX() {
        if (!this.gameoverSFX.muted) {
            this.gameoverSFX.muted = true;
        } else {
            this.gameoverSFX.muted = false;
        }
    }

}