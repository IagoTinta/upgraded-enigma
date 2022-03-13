import { Application, Container, Loader, Point, Sprite } from 'pixi.js'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 1280,
	height: 720
});

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

Loader.shared.add({url:"./Majora.png", name:"myMajora"});
Loader.shared.add({url:"./Mario_Hat.png", name:"Mario_Hat"});

Loader.shared.onComplete.add(()=>{

	const Majora: Sprite = Sprite.from("myMajora");
	
	Majora.anchor.set(0);

	const marioHat: Sprite = Sprite.from("Mario_Hat");

	marioHat.position.set(210,0);

	const majoraWithHat: Container = new Container();

	majoraWithHat.addChild(Majora);
	majoraWithHat.addChild(marioHat);

	majoraWithHat.scale.set(0.5);
	majoraWithHat.position.set(200,300);

	console.log(marioHat.toGlobal(new Point()));
	console.log(marioHat.parent.toGlobal(marioHat.position));

	const aux = marioHat.parent.toLocal(new Point(0,0));
	marioHat.position.copyFrom(aux);

	app.stage.addChild(majoraWithHat);

});

Loader.shared.load();
