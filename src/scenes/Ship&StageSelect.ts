import { Container, Graphics, NineSlicePlane, Sprite, Text, Texture } from "pixi.js";
import { BaseScene } from "../Game/Utils/BaseScene";
import { Button } from "../Game/Utils/Button";
import { Manager } from "../Game/Utils/Manager";
import { Level } from "./Level";
import { MainMenu } from "./MainMenu";


export class ShipAndStageSelect extends BaseScene {

    private background: Sprite;
    private ShipSelectScreen: Container;
    private StageSelectScreen: Container;
    private shipType = 0;

    constructor() {

        super();
        
        this.background = Sprite.from("MainMenuBack");
        this.background.scale.set(0.5);
        this.addChild(this.background);

        this.ShipSelectScreen = new Container();

        const ShipBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const ShipBoardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const ShipTittle: Text = new Text("Select Ship", Manager.TEXT_STYLE);
        this.ShipSelectScreen.addChild(ShipBoard,ShipBoardtittle,ShipTittle);
        ShipBoardtittle.position.set(166,-50);
        ShipTittle.anchor.set(0.5);
        ShipTittle.position.set(522.5,15);
        this.ShipSelectScreen.scale.set(0.75);
        this.ShipSelectScreen.pivot.set(522.5,358);
        this.ShipSelectScreen.position.set(Manager.WIDTH/2,Manager.HEIGHT/2);
        this.addChild(this.ShipSelectScreen);

        const select1 = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        select1.pivot.set(select1.width/2,select1.height/2);
        select1.position.set(Manager.WIDTH/2-280,350);
        select1.scale.x = 0.75;
        select1.on(Button.CLICKED_EVENT, ()=>{
            Manager.setType(1);
            Manager.playMusic("Select");
            this.removeChild(this.ShipSelectScreen);
            this.addChild(this.StageSelectScreen);
        }, this);
        const ship1: Sprite = Sprite.from("Ship1.png");
        ship1.anchor.set(0.5);
        ship1.scale.set(2);
        ship1.position.set(225,250);
        const shipname1: Text = new Text("Austerlitz",Manager.TEXT_STYLE);
        shipname1.anchor.set(0.5);
        shipname1.position.set(ship1.x,ship1.y-125);
        shipname1.scale.set(0.5,0.8);
        const select2 = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        select2.pivot.set(select2.width/2,select2.height/2);
        select2.position.set(Manager.WIDTH/2+20,350);
        select2.scale.x = 0.75;
        select2.on(Button.CLICKED_EVENT, ()=>{
            Manager.setType(2);
            Manager.playMusic("Select");
            this.removeChild(this.ShipSelectScreen);
            this.addChild(this.StageSelectScreen);
        }, this);
        const ship2: Sprite = Sprite.from("Ship2.png");
        ship2.anchor.set(0.5);
        ship2.scale.set(2);
        ship2.position.set(525,250);
        const shipname2: Text = new Text("Koschei Makarov",Manager.TEXT_STYLE);
        shipname2.anchor.set(0.5);
        shipname2.position.set(ship2.x,ship2.y-125);
        shipname2.scale.set(0.5,0.8);
        const select3 = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        select3.pivot.set(select3.width/2,select3.height/2);
        select3.position.set(Manager.WIDTH/2+320,350);
        select3.scale.x = 0.75;
        select3.on(Button.CLICKED_EVENT, ()=>{
            Manager.setType(3);
            Manager.playMusic("Select");
            this.removeChild(this.ShipSelectScreen);
            this.addChild(this.StageSelectScreen);
        }, this);
        const ship3: Sprite = Sprite.from("Spaceship3.png");
        ship3.anchor.set(0.5);
        ship3.scale.set(2);
        ship3.position.set(825,250);
        const shipname3: Text = new Text("Mirage 3",Manager.TEXT_STYLE);
        shipname3.anchor.set(0.5);
        shipname3.position.set(ship3.x,ship3.y-125);
        shipname3.scale.set(0.5,0.8);
        const select4 = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        select4.pivot.set(select4.width/2,select4.height/2);
        select4.position.set(Manager.WIDTH/2-280,600);
        select4.scale.x = 0.75;
        select4.on(Button.CLICKED_EVENT, ()=>{
            Manager.setType(4);
            Manager.playMusic("Select");
            this.removeChild(this.ShipSelectScreen);
            this.addChild(this.StageSelectScreen);
        }, this);
        const ship4: Sprite = Sprite.from("Ship4.png");
        ship4.anchor.set(0.5);
        ship4.scale.set(1.75);
        ship4.position.set(225,510);
        const shipname4: Text = new Text("Taipei 4000",Manager.TEXT_STYLE);
        shipname4.anchor.set(0.5);
        shipname4.position.set(ship4.x,ship4.y-125);
        shipname4.scale.set(0.5,0.8);
        const select5 = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        select5.pivot.set(select5.width/2,select5.height/2);
        select5.position.set(Manager.WIDTH/2+20,600);
        select5.scale.x = 0.75;
        select5.on(Button.CLICKED_EVENT, ()=>{
            Manager.setType(5);
            Manager.playMusic("Select");
            this.removeChild(this.ShipSelectScreen);
            this.addChild(this.StageSelectScreen);
        }, this);
        const ship5: Sprite = Sprite.from("Ship5.png");
        ship5.anchor.set(0.5);
        ship5.scale.set(1.75);
        ship5.position.set(525,510);
        const shipname5: Text = new Text("OTAN Liberator",Manager.TEXT_STYLE);
        shipname5.anchor.set(0.5);
        shipname5.position.set(ship5.x,ship5.y-125);
        shipname5.scale.set(0.5,0.8);
        const select6 = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        select6.pivot.set(select6.width/2,select6.height/2);
        select6.position.set(Manager.WIDTH/2+320,600);
        select6.scale.x = 0.75;
        select6.on(Button.CLICKED_EVENT, ()=>{
            Manager.setType(6);
            Manager.playMusic("Select");
            this.removeChild(this.ShipSelectScreen);
            this.addChild(this.StageSelectScreen);
        }, this);
        const ship6: Sprite = Sprite.from("Ship6.png");
        ship6.anchor.set(0.5);
        ship6.scale.set(1.75);
        ship6.position.set(825,510);
        const shipname6: Text = new Text("Faust der Menschheit",Manager.TEXT_STYLE);
        shipname6.anchor.set(0.5);
        shipname6.position.set(ship6.x,ship6.y-125);
        shipname6.scale.set(0.5,0.8);

        const back2Menu = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        back2Menu.position.set(522.5,725);
        const back2MenuText: Text = new Text("Return", Manager.TEXT_STYLE);
        back2MenuText.anchor.set(0.5);
        back2MenuText.position.copyFrom(back2Menu);
        back2Menu.on(Button.CLICKED_EVENT, ()=>{
            Manager.playMusic("Select");
            Manager.changeScene(new MainMenu());
        }, this);
        this.ShipSelectScreen.addChild(
            select1,ship1,shipname1,
            select2,ship2,shipname2,
            select3,ship3,shipname3,
            select4,ship4,shipname4,
            select5,ship5,shipname5,
            select6,ship6,shipname6,
            back2Menu,back2MenuText
        );

        this.StageSelectScreen = new Container();

        const StageBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const StageBoardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const StageTittle: Text = new Text("Select Stage", Manager.TEXT_STYLE);
        this.StageSelectScreen.addChild(StageBoard,StageBoardtittle,StageTittle);
        StageBoardtittle.position.set(166,-50);
        StageTittle.anchor.set(0.5);
        StageTittle.position.set(522.5,15);
        this.StageSelectScreen.scale.set(0.75);
        this.StageSelectScreen.pivot.set(522.5,358);
        this.StageSelectScreen.position.set(Manager.WIDTH/2,Manager.HEIGHT/2);

        const Xertac = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        Xertac.pivot.set(Xertac.width/2,Xertac.height/2);
        Xertac.position.set(Manager.WIDTH/2-180,600);
        Xertac.on(Button.CLICKED_EVENT, ()=>{
            Manager.changeScene(new Level());
        }, this);
        const frame1 = new Graphics();
        frame1.beginFill(0x000000, 1);
        frame1.drawRect(0,0,350,250);
        frame1.endFill();
        frame1.pivot.set(frame1.width/2, frame1.height/2);
        frame1.position.set(280,250);
        const xertacBack: Sprite = Sprite.from("background");
        xertacBack.anchor.set(0.5);
        xertacBack.scale.set(0.15);
        xertacBack.position.set(frame1.x,frame1.y);
        const levelName1: Text = new Text("Fight the\n Xertac",Manager.TEXT_STYLE);
        levelName1.anchor.set(0.5);
        levelName1.position.set(Xertac.x-185,Xertac.y-100);

        const Xermal = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        Xermal.pivot.set(Xermal.width/2,Xermal.height/2);
        Xermal.position.set(Manager.WIDTH/2+310,600);
        Xermal.on(Button.CLICKED_EVENT, ()=>{
            Manager.playSFX("Select");
            Manager.changeScene(new Level());
        }, this);
        const frame2 = new Graphics();
        frame2.beginFill(0x000000, 1);
        frame2.drawRect(0,0,350,250);
        frame2.endFill();
        frame2.pivot.set(frame2.width/2, frame2.height/2);
        frame2.position.set(765,250);
        const xermalBack: Sprite = Sprite.from("level2Background");
        xermalBack.anchor.set(0.5);
        xermalBack.scale.set(0.15);
        xermalBack.position.set(frame2.x,frame2.y);
        const levelName2: Text = new Text("Fight the\n Xermal",Manager.TEXT_STYLE);
        levelName2.anchor.set(0.5);
        levelName2.position.set(Xermal.x-185,Xermal.y-100);
        this.StageSelectScreen.addChild(
            Xertac,frame1,xertacBack,levelName1,
            Xermal,frame2,xermalBack,levelName2
        );

        const back2Ship = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        back2Ship.position.set(522.5,725);
        const back2ShipText: Text = new Text("Return", Manager.TEXT_STYLE);
        back2ShipText.anchor.set(0.5);
        back2ShipText.position.copyFrom(back2Ship);
        back2Ship.on(Button.CLICKED_EVENT, ()=>{
            Manager.playMusic("Select");
            this.removeChild(this.StageSelectScreen);
            this.addChild(this.ShipSelectScreen);
        }, this);
        this.StageSelectScreen.addChild(back2Ship,back2ShipText);

    }

    public update (_deltaTime: number, _deltaFrame: number):void {
        this.shipType += this.shipType - this.shipType;
    }

}