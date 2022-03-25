import { Container, Sprite, Text} from "pixi.js";

export class ScoreAndRating extends Container {

    constructor() {

        super();

        const menuSuperior: Container = new Container();
        const Exit: Sprite = Sprite.from("Exit");
        const rePlay: Sprite = Sprite.from("rePlay");
        const changeSound: Sprite = Sprite.from("musicOn");
        Exit.position.x = 790;
        rePlay.position.x = 685;
        Exit.on("pointerdown", this.onPointerDown, this);
        Exit.on("pointerup", this.onPointerUp, this);
        Exit.on("pointerover", this.onPointerOver, this);
        Exit.on("pointerout", this.onPointerOut, this);
        Exit.interactive = true;
        menuSuperior.scale.set(0.65);
        menuSuperior.position.set(350,58);


        menuSuperior.addChild(Exit,rePlay,changeSound);

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
        const First: Sprite = Sprite.from("firstPlace");
        const Second: Sprite = Sprite.from("secondPlace");
        const Third: Sprite = Sprite.from("thirdPlace");
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

    }

    private onPointerDown():void {

        console.log("hiciste click");

    }
    private onPointerUp():void {

        console.log("soltaste el click");

    }
    private onPointerOver():void {

        console.log("entraste al icono");

    }
    private onPointerOut():void {

        console.log("saliste del icono");

    }

}