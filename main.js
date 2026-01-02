import { Raycaster } from "./src/raycaster.js";
import { Sprite, Transform } from "./src/sprite.js";

export class Main{
    constructor(){
        this.canvas = document.getElementById("raycasting");
        this.ctx = this.canvas.getContext("2d");
        this.raycast = new Raycaster();
        this.update = this.update.bind(this);
        this.sprites = [];
        this.sprites.push(new Sprite("arma.json",new Transform(this.canvas.width/2,this.canvas.height-200,14,14)));
        requestAnimationFrame(this.update);
    }

    update() {
        if (!this.raycast.mapa.matris) {
            requestAnimationFrame(this.update);
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.raycast.player.move(this.raycast.mapa.matris);
        this.raycast.render();
        
        this.sprites.forEach(sprite =>{
            sprite.render(this.ctx);
        });
        
        requestAnimationFrame(this.update);
    }
}

const main = new Main();