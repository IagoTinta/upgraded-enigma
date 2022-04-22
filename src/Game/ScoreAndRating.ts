import { Container, Sprite, Text, Texture} from "pixi.js";
import { Keyboard } from "./Utils/Keyboard";
import { Button } from "./Utils/Button";
import { ToggleButton } from "./Utils/ToggleButton";

export class ScoreAndRating extends Container {

    private Exit:Button;
    //private lastKeyPressed:Text;
    private rePlay:Button;
    private changeSound: ToggleButton;

    constructor() {

        super();
        const menuSuperior: Container = new Container();
        this.Exit = new Button(
            Texture.from("BExit"),
             Texture.from("SExit"), 
             Texture.from("WExit"));
        this.rePlay = new Button(
            Texture.from("BrePlay"),
            Texture.from("SrePlay"),
            Texture.from("WrePlay")
        );
        this.changeSound = new ToggleButton(
            Texture.from("BmusicOn"),
            Texture.from("SmusicOn"),
            Texture.from("WmusicOn"),
            Texture.from("BmusicOff"),
            Texture.from("SmusicOff"),
            Texture.from("WmusicOff")
        )
        this.Exit.position.x = 790;
        this.rePlay.position.x = 685;
        this.changeSound.on(ToggleButton.TOGGLE_EVENT, (newState)=>{
            console.log("sound changed to:", newState)
        });
        this.changeSound.on("pointerdown",this.onButtonClick, this)
        menuSuperior.scale.set(0.65);
        menuSuperior.position.set(380,90);


        menuSuperior.addChild(this.Exit,this.rePlay,this.changeSound);

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

        /*this.lastKeyPressed = new Text("Presione una Tecla", {fontSize:30});
        this.lastKeyPressed.anchor.set(0.5);
        this.lastKeyPressed.position.set(640,500);
        this.addChild(this.lastKeyPressed);*/

        Keyboard.down.on("KeyW", this.onKeyWdown, this)
        Keyboard.up.on("KeyW", this.onKeyWup, this)
        Keyboard.down.on("KeyA", this.onKeyAdown, this)
        Keyboard.up.on("KeyA", this.onKeyAup, this)
        Keyboard.down.on("KeyS", this.onKeySdown, this)
        Keyboard.up.on("KeyS", this.onKeySup, this)
        Keyboard.down.on("KeyD", this.onKeyDdown, this)
        Keyboard.up.on("KeyD", this.onKeyDup, this)
        Keyboard.down.on("Space", this.onKeySpacedown, this)
        Keyboard.up.on("Space", this.onKeySpaceup, this)

    }

    private onKeyWdown():void{
        console.log("jump");
    }
    private onKeyWup():void{
        console.log("stop jumping");
    }
    private onKeyAdown():void{
        console.log("move left");
    }
    private onKeyAup():void{
        console.log("stop left");
    }
    private onKeySdown():void{
        console.log("crouch");
    }
    private onKeySup():void{
        console.log("stop crouching");
    }
    private onKeyDdown():void{
        console.log("move right");
    }
    private onKeyDup():void{
        console.log("stop right");
    }
    private onKeySpacedown():void{
        console.log("jump");
    }
    private onKeySpaceup():void{
        console.log("stop jumping");
    }
    private onButtonClick():void {
        console.log("my sound is", this.changeSound.State);
        this.changeSound.State = !this.changeSound.State;
        console.log("but i changed it to", this.changeSound.State);
    } 

}