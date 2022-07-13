import { Application, TextStyle, Ticker } from "pixi.js";
import { Group } from "tweedle.js";
import { BaseScene } from "./BaseScene";
import { Keyboard } from "./Keyboard";


export namespace Manager {

    export const WIDTH = 1280;
    export const HEIGHT = 720;
    export const TEXT_STYLE = new TextStyle({
        fontFamily: "PixelFont",
        fontSize: 75,
        fontVariant: "small-caps",
        lineJoin: "bevel",
        stroke: "white",
        strokeThickness: 5,
        textBaseline: 'bottom',
        align: 'center'
    });
    let currentScene: BaseScene;
    let app: Application;
    
    export function initialize() {

        if (app != undefined) {
            console.error("Don't initialize twice");
            return;
        }

        app = new Application({
	        view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	        resolution: window.devicePixelRatio || 1,
	        autoDensity: true,
	        backgroundColor: 0x000000,
	        width: WIDTH,
	        height: HEIGHT,
        });

        Keyboard.initialize();

        window.addEventListener("resize", ()=>{

	        const scaleX = window.innerWidth / app.screen.width;
	        const scaleY = window.innerHeight / app.screen.height;
	        const scale = Math.min(scaleX, scaleY);

	        const gameWidth = Math.round(app.screen.width * scale);
	        const gameHeight = Math.round(app.screen.height * scale);

	        const marginHorizontal = Math.floor((window.innerWidth - gameWidth) / 2);
	        const marginVertical = Math.floor((window.innerHeight - gameHeight) / 2);

	        app.view.style.width = gameWidth + "px";
	        app.view.style.height = gameHeight + "px";

	        app.view.style.marginLeft = marginHorizontal + "px";
	        app.view.style.marginRight = marginHorizontal + "px";
	        app.view.style.marginTop = marginVertical + "px";
	        app.view.style.marginBottom = marginVertical + "px";

        })

        window.dispatchEvent(new Event("resize"));

        Ticker.shared.add(updateTicker);

    }


    export function changeScene(newScene: BaseScene) {
        if (currentScene) {
            currentScene.destroy();
        }
        currentScene = newScene;
        app.stage.addChild(currentScene);
    }

    function updateTicker(deltaFrame: number) {
        Group.shared.update();
        currentScene?.update(deltaFrame, Ticker.shared.elapsedMS);
    }

}
