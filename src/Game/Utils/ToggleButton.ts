import { Container, Texture } from "pixi.js";
import { Button } from "./Button";


export class ToggleButton extends Container {
    
    private toggledOn:Button;
    private toggledOff:Button;
    public state:boolean;
    
    constructor(toggledOnDef:Texture,toggledOnDown:Texture,toggledOnOver:Texture,
        toggledOffDef:Texture,toggledOffDown:Texture,toggledOffOver:Texture,) {

        super();
        this.toggledOn = new Button(toggledOnDef,toggledOnDown,toggledOnOver);
        this.toggledOff = new Button(toggledOffDef,toggledOffDown,toggledOffOver);
        this.toggledOff.visible = false;
        this.state = true;

    }

    public onButtonToggled():void {
        if(this.state = true){
            this.state = false;
            this.toggledOn.visible = false;
            this.toggledOff.visible = true;
        } else {
            this.state = true;
            this.toggledOff.visible = false;
            this.toggledOn.visible = true;
        }

    }

}