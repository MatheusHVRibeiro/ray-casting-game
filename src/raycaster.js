import { Mapa } from "./mapa.js";
import { Player } from "./player.js";

export class Raycaster {
    constructor() {
        this.canvas = document.getElementById("raycasting");
        this.ctx = this.canvas.getContext("2d");
        this.canvasW = 800;
        this.canvasH = 600;
        this.canvas.width = this.canvasW;
        this.canvas.height = this.canvasH;
        this.mapa = new Mapa();
        this.player = new Player();
    }

    render() {
        let resolucao = 5;

        for (let x = 0; x < this.canvasW; x++) {

            const rayDir = this.player.getRayDir(x);

            let map = this.player.getMap();

            const deltaDist = {
                x:Math.abs(1 / rayDir.x),
                y:Math.abs(1 / rayDir.y)
            } 

            let stepX, stepY;
            let sideDistX, sideDistY;

            if (rayDir.x < 0) {
                stepX = -1;
                sideDistX = (this.player.posX - map.x) * deltaDist.x;
            } else {
                stepX = 1;
                sideDistX = (map.x + 1.0 - this.player.posX) * deltaDist.x;
            }

            if (rayDir.y < 0) {
                stepY = -1;
                sideDistY = (this.player.posY - map.y) * deltaDist.y;
            } else {
                stepY = 1;
                sideDistY = (map.y + 1.0 - this.player.posY) * deltaDist.y;
            }

            let side;
            // DDA

            while (this.mapa.matris[map.y][map.x] == 10) {
                if (sideDistX < sideDistY) {
                    sideDistX += deltaDist.x;
                    map.x += stepX;
                    side = 0;
                } else {
                    sideDistY += deltaDist.y;
                    map.y += stepY;
                    side = 1;
                }

            }

            // distância perpendicular
            let perpWallDist;
            if (side === 0)
                perpWallDist = (map.x - this.player.posX + (1 - stepX) / 2) / rayDir.x;
            else
                perpWallDist = (map.y - this.player.posY + (1 - stepY) / 2) / rayDir.y;

            const lineHeight = resolucao * this.canvasH / perpWallDist;

            let horizonte = this.canvasH / 2 + this.player.alturaDeCamera;
            let drawEnd = horizonte + lineHeight;
            let drawStart = drawEnd - lineHeight * 2;

            
            this.draw(x,drawStart,drawEnd,side);
        }
        this.ctx.strokeStyle = "#ffffff";
    }

    draw(x, start, end, side) {
        // teto
        this.ctx.strokeStyle = `rgb(255, 0, 0)`;

        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, start);
        this.ctx.stroke();

        //chao
        this.ctx.strokeStyle = `rgb(0, 0, 255)`;

        this.ctx.beginPath();
        this.ctx.moveTo(x, end);
        this.ctx.lineTo(x, this.canvasW);
        this.ctx.stroke();

        // raycasting
        let shade = side === 1 ? 160 : 220;
        this.ctx.strokeStyle = `rgb(${shade}, ${shade}, ${shade})`;

        this.ctx.beginPath();
        this.ctx.moveTo(x, start);
        this.ctx.lineTo(x, end);
        this.ctx.stroke();
    }
}

const doom = new Raycaster();