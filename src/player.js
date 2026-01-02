export class Player {
    constructor() {
        this.posX = 3.5;
        this.posY = 3.5;
        this.dirX = -1;
        this.dirY = 0;
        this.planeX = 0;
        this.planeY = 0.66;
        this.alturaDeCamera = 0;
        this.rotate(-9);
        this.keys = {};
        document.addEventListener("keydown", e => this.keys[e.key] = true);
        document.addEventListener("keyup", e => this.keys[e.key] = false);
    }

    rotate(angle) {
        const oldDirX = this.dirX;
        this.dirX = this.dirX * Math.cos(angle) - this.dirY * Math.sin(angle);
        this.dirY = oldDirX * Math.sin(angle) + this.dirY * Math.cos(angle);

        const oldPlaneX = this.planeX;
        this.planeX = this.planeX * Math.cos(angle) - this.planeY * Math.sin(angle);
        this.planeY = oldPlaneX * Math.sin(angle) + this.planeY * Math.cos(angle);
    }

    move(map) {
        const moveSpeed = 0.2;
        const rotSpeed = 0.05;

        // Frente
        if (this.keys["w"]) {
            if (map[Math.floor(this.posY)][Math.floor(this.posX + this.dirX * moveSpeed)] === 10)
                this.posX += this.dirX * moveSpeed;
            if (map[Math.floor(this.posY + this.dirY * moveSpeed)][Math.floor(this.posX)] === 10)
                this.posY += this.dirY * moveSpeed;
        }

        // Trás
        if (this.keys["s"]) {
            if (map[Math.floor(this.posY)][Math.floor(this.posX - this.dirX * moveSpeed)] === 10)
                this.posX -= this.dirX * moveSpeed;
            if (map[Math.floor(this.posY - this.dirY * moveSpeed)][Math.floor(this.posX)] === 10)
                this.posY -= this.dirY * moveSpeed;
        }

        // Rotação esquerda
        if (this.keys["a"]) this.rotate(rotSpeed);

        // Rotação direita
        if (this.keys["d"]) this.rotate(-rotSpeed);

        if (this.keys["ArrowUp"]) this.alturaDeCamera += 5;
        if (this.keys["ArrowDown"]) this.alturaDeCamera -= 5;
    }

    getRayDir(x){
        const cameraX = 2 * x / document.getElementById("raycasting").width - 1;
        return {
            x: this.dirX + this.planeX * cameraX,
            y: this.dirY + this.planeY * cameraX
        };
    }
    getMap(){
        return {
            x:Math.floor(this.posX),
            y:Math.floor(this.posY)
        };
    }
    
}