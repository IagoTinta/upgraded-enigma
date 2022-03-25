import { Application, Loader} from 'pixi.js'
import { assets } from './assets';
import { Scene } from './scenes/Scene';
//imports from pixi libraries

//creates a game app with set characteristics
const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 1280,
	height: 720
});

//adjusts game screen everytime web browser
//is resized and centers the game screen
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

//imports archives
Loader.shared.add(assets);

//loads sprites on screen on run time
Loader.shared.onComplete.add(()=>{

	const myScene = new Scene();
	app.stage.addChild(myScene);

	// console.log(marioHat.toGlobal(new Point()));
	// console.log(marioHat.parent.toGlobal(marioHat.position));

	// const aux = marioHat.parent.toLocal(new Point(0,0));
	// marioHat.position.copyFrom(aux);

});

Loader.shared.load();
