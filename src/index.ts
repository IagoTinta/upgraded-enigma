import { Application, Container, Loader, Sprite } from 'pixi.js'

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
Loader.shared.add({url:"./Green_rectangle.png", name:"gRec"});
Loader.shared.add({url:"./Red_rectangle.png", name:"rRec"});
Loader.shared.add({url:"./Purple_diamond.png", name:"pDiam"});
Loader.shared.add({url:"./Leader.png", name:"armyLeader"});
Loader.shared.add({url:"./Ship.png", name:"armyShip"});

Loader.shared.onComplete.add(()=>{

	const Majora: Sprite = Sprite.from("myMajora");
	
	Majora.anchor.set(0.5);

	const marioHat: Sprite = Sprite.from("Mario_Hat");

	marioHat.position.set(-130,-300);

	const majoraWithHat: Container = new Container();

	majoraWithHat.addChild(Majora);
	majoraWithHat.addChild(marioHat);

	majoraWithHat.scale.set(0.5);
	majoraWithHat.position.set(app.screen.width/2,app.screen.height/2);

	// console.log(marioHat.toGlobal(new Point()));
	// console.log(marioHat.parent.toGlobal(marioHat.position));

	// const aux = marioHat.parent.toLocal(new Point(0,0));
	// marioHat.position.copyFrom(aux);

	app.stage.addChild(majoraWithHat);

	const greenRectan1: Sprite = Sprite.from("gRec");
	const greenRectan2: Sprite = Sprite.from("gRec");
	const redRectan1: Sprite = Sprite.from("rRec");
	const redRectan2: Sprite = Sprite.from("rRec");

	greenRectan1.anchor.set(0.5);
	greenRectan2.anchor.set(0.5);
	redRectan1.anchor.set(0.5);
	redRectan2.anchor.set(0.5);

	greenRectan1.position.set(440,160);
	greenRectan2.position.set(840,560);
	redRectan1.position.set(840,160);
	redRectan2.position.set(440,560);

	greenRectan1.angle = -45;
	greenRectan2.angle = -45;
	redRectan1.angle = 45;
	redRectan2.angle = 45;

	greenRectan1.scale.set(2,2);
	greenRectan2.scale.set(2,2);
	redRectan1.scale.set(2,2);
	redRectan2.scale.set(2,2);

	const purpleDiamond1: Sprite = Sprite.from("pDiam");
	const purpleDiamond2: Sprite = Sprite.from("pDiam");
	const purpleDiamond3: Sprite = Sprite.from("pDiam");
	const purpleDiamond4: Sprite = Sprite.from("pDiam");

	purpleDiamond1.anchor.set(0.5);
	purpleDiamond2.anchor.set(0.5);
	purpleDiamond3.anchor.set(0.5);
	purpleDiamond4.anchor.set(0.5);

	purpleDiamond1.position.set(640,140);
	purpleDiamond2.position.set(420,360);
	purpleDiamond3.position.set(860,360);
	purpleDiamond4.position.set(640,580);

	purpleDiamond1.scale.x = 5;
	purpleDiamond2.scale.y = 5;
	purpleDiamond3.scale.y = 5;
	purpleDiamond4.scale.x = 5;

	const myFrame: Container = new Container();

	myFrame.addChild(greenRectan1,greenRectan2,redRectan1,redRectan2,purpleDiamond1,purpleDiamond2,purpleDiamond3,purpleDiamond4);

	app.stage.addChild(myFrame);

	const leaderShip: Sprite = Sprite.from("armyLeader");
	const battleShip1: Sprite = Sprite.from("armyShip");
	const battleShip2: Sprite = Sprite.from("armyShip");
	const battleShip3: Sprite = Sprite.from("armyShip");
	const battleShip4: Sprite = Sprite.from("armyShip");
	const battleShip5: Sprite = Sprite.from("armyShip");

	leaderShip.angle = -90;
	battleShip1.angle = -90;
	battleShip2.angle = -90;
	battleShip3.angle = -90;
	battleShip4.angle = -90;
	battleShip5.angle = -90;

	leaderShip.scale.set(2);

	leaderShip.anchor.set(0.5);
	battleShip1.anchor.set(0.5);
	battleShip2.anchor.set(0.5);
	battleShip3.anchor.set(0.5);
	battleShip4.anchor.set(0.5);
	battleShip5.anchor.set(0.5);

	leaderShip.position.set(640,360);
	battleShip1.position.set(590,360);
	battleShip2.position.set(640,310);
	battleShip3.position.set(590,310);
	battleShip4.position.set(640,410);
	battleShip5.position.set(590,410);

	const Army: Container = new Container();

	Army.position.set(-1000,-360);
	Army.scale.set(2)

	Army.addChild(leaderShip,battleShip1,battleShip2,battleShip3,battleShip4,battleShip5);

	app.stage.addChild(Army);

});

Loader.shared.load();
