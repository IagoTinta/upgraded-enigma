import { Container, Sprite, Text, Texture} from "pixi.js";
import { Keyboard } from "../util.ts/Keyboard";
import { Button } from "./Utils/Button";

export class ScoreAndRating extends Container {

    private Exit:Button;
    private lastKeyPressed:Text;

    constructor() {

        super();

        const menuSuperior: Container = new Container();
        this.Exit = new Button(
            Texture.from("BExit"),
             Texture.from("SExit"), 
             Texture.from("WExit"));
        this.Exit.on("buttonClick",this.onButtonClick,this);
        const rePlay: Sprite = Sprite.from("BrePlay");
        const changeSound: Sprite = Sprite.from("BmusicOn");
        this.Exit.position.x = 790;
        rePlay.anchor.set(0.5);
        rePlay.position.x = 685;
        changeSound.anchor.set(0.5);
        menuSuperior.scale.set(0.65);
        menuSuperior.position.set(380,90);


        menuSuperior.addChild(this.Exit,rePlay,changeSound);

        const Rating: Container = new Container();
        const Star1: Sprite  = Sprite.from("Star");
        const Star2: Sprite  = Sprite.from("Star");
        const emptyStar: Sprite  = Sprite.from("emptyStar");
        Star1.anchor.set(0.5);
        Star2.anchor.set(0.5);
        emptyStar.anchor.set(0.5);
        Rating.pivot.set(1000,50);
        Star2.position.x = 1000;
        Star1.position.y = 150;
        emptyStar.position.set(2000,150);
        Rating.scale.set(0.125);
        Rating.position.set(640,225);
        Star1.rotation = 45;
        emptyStar.rotation = -45;
        Rating.addChild(Star1,Star2,emptyStar);

        const Scores: Container = new Container();
        const First: Sprite = Sprite.from("BfirstPlace");
        const Second: Sprite = Sprite.from("BsecondPlace");
        const Third: Sprite = Sprite.from("BthirdPlace");
        const yourScore: Text = new Text("Your Score: 50000", {fontSize: 30, fill: 0x000000});
        const highScores: Text = new Text("Highscores:     80000\n                         70000\n                         60000", 
            {fontSize: 30, fill:0x000000});
        yourScore.position.set(400,325);
        highScores.position.set(400,375);
        First.scale.set(0.45);
        Second.scale.set(0.45);
        Third.scale.set(0.45);
        First.position.set(555,370);
        Second.position.set(555,403);
        Third.position.set(555,436);
        Scores.addChild(First,Second,Third,yourScore,highScores);

        this.addChild(menuSuperior,Rating,Scores);

        this.lastKeyPressed = new Text("Presione una Tecla", {fontSize:30});
        this.lastKeyPressed.anchor.set(0.5);
        this.lastKeyPressed.position.set(640,500);
        this.addChild(this.lastKeyPressed);

        Keyboard.down.on("KeyB", this.onKeyBdown, this)
        Keyboard.up.on("KeyB", this.onKeyBup, this)

    }

    private onKeyBdown():void{
        console.log("aprete la B!", this);
    }
    private onKeyBup():void{
        console.log("solte la B!", this);
    }

    private onButtonClick():void {
        console.log("mi boton hizo click!",Keyboard.state.get("KeyA"),this);
    }

}