import { WebfontLoaderPlugin } from 'pixi-webfont-loader';
import { Application, Container, Graphics, Loader, Text, TextStyle, Texture, Ticker} from 'pixi.js'
import { Group } from 'tweedle.js';
import { assets } from './assets';
import { Button } from './Game/Utils/Button';
import { Keyboard } from './Game/Utils/Keyboard';
import { Level } from './scenes/Level';
//import { MainMenu } from './scenes/MainMenu';

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

const app = new Application({
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

Loader.registerPlugin(WebfontLoaderPlugin);

Loader.shared.add(assets);

let myScene: any;

const loadingBar= new Container();
const bar = new Graphics();
bar.beginFill(0xFFFFFF,1);
bar.drawRect(0,0,700,250);
bar.endFill();
const fill = new Graphics();
fill.beginFill(0xFF0000,1);
fill.drawRect(25,25,650,200);
fill.endFill();
fill.scale.x = 0;
loadingBar.addChild(bar,fill);
loadingBar.pivot.set(loadingBar.width/2,loadingBar.height/2);
loadingBar.position.set(WIDTH/2,(HEIGHT/2)-100);
loadingBar.scale.y = 0.5;
app.stage.addChild(loadingBar);

Loader.shared.onProgress.add(()=>{
	fill.scale.x = Loader.shared.progress/100;
})

Loader.shared.onComplete.add(()=>{

	const play = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
	play.position.set(WIDTH/2,(HEIGHT/2)+100);
	const playText = new Text("Launch",TEXT_STYLE);
	playText.anchor.set(0.5);
	playText.position.copyFrom(play.position);
	app.stage.addChild(play,playText);
	play.on(Button.CLICKED_EVENT, ()=>{

		myScene = new Level();
		Ticker.shared.add((deltaFrame)=>{
			myScene.update(deltaFrame,Ticker.shared.deltaMS);
			Group.shared.update();
		})
		app.stage.addChild(myScene);
		play.destroy();
		loadingBar.destroy();
		playText.destroy();

	});
});

Loader.shared.load();

export function changeScene(newScene: any) {
	app.stage.removeChild(myScene);
	myScene = newScene;
	app.stage.addChild(myScene);
}
