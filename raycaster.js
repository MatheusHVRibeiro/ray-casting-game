class Mapa {
    constructor() {
        this.nome = "map1.json";
        this.matris = null;
        this.init();
    }
    async init() {
        this.matris = await this.loadMap(this.nome);
        this.mapWidth = this.matris[0].length;
        this.mapHeight = this.matris.length;
    }

    async loadMap(nome) {
        const response = await fetch("./maps/" + nome);

        if (!response.ok) {
            throw new Error("Erro ao carregar o mapa");
        }

        return await response.json();
    }
}

class Player {
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
            if (map[Math.floor(this.posY)][Math.floor(this.posX + this.dirX * moveSpeed)] === 0)
                this.posX += this.dirX * moveSpeed;
            if (map[Math.floor(this.posY + this.dirY * moveSpeed)][Math.floor(this.posX)] === 0)
                this.posY += this.dirY * moveSpeed;
        }

        // Trás
        if (this.keys["s"]) {
            if (map[Math.floor(this.posY)][Math.floor(this.posX - this.dirX * moveSpeed)] === 0)
                this.posX -= this.dirX * moveSpeed;
            if (map[Math.floor(this.posY - this.dirY * moveSpeed)][Math.floor(this.posX)] === 0)
                this.posY -= this.dirY * moveSpeed;
        }

        // Rotação esquerda
        if (this.keys["a"]) this.rotate(rotSpeed);

        // Rotação direita
        if (this.keys["d"]) this.rotate(-rotSpeed);

        if (this.keys["ArrowUp"]) this.alturaDeCamera += 5;
        if (this.keys["ArrowDown"]) this.alturaDeCamera -= 5;
    }
}

class Raycaster {
    constructor() {
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.mapa = new Mapa();
        this.player = new Player();
        this.update = this.update.bind(this); // mantém o this
        requestAnimationFrame(this.update);
    }


    update() {
        if (!this.mapa.matris) {
            requestAnimationFrame(this.update);
            return;
        }

        this.player.move(this.mapa.matris);
        this.render();

        requestAnimationFrame(this.update);
    }



    render() {
        let resolucao = 5;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let x = 0; x < this.canvas.width; x++) {

            // posição do raio na câmera
            const cameraX = 2 * x / this.canvas.width - 1;

            // direção do raio
            const rayDirX = this.dirX + this.planeX * cameraX;
            const rayDirY = this.dirY + this.planeY * cameraX;

            let mapX = Math.floor(this.player.posX);
            let mapY = Math.floor(this.player.posY);

            const deltaDistX = Math.abs(1 / rayDirX);
            const deltaDistY = Math.abs(1 / rayDirY);

            let stepX, stepY;
            let sideDistX, sideDistY;

            if (rayDirX < 0) {
                stepX = -1;
                sideDistX = (this.player.posX - mapX) * deltaDistX;
            } else {
                stepX = 1;
                sideDistX = (mapX + 1.0 - this.player.posX) * deltaDistX;
            }

            if (rayDirY < 0) {
                stepY = -1;
                sideDistY = (this.player.posY - mapY) * deltaDistY;
            } else {
                stepY = 1;
                sideDistY = (mapY + 1.0 - this.player.posY) * deltaDistY;
            }

            let hit = false;
            let side;
            // DDA
            while (!hit) {
                if (sideDistX < sideDistY) {
                    sideDistX += deltaDistX;
                    mapX += stepX;
                    side = 0;
                } else {
                    sideDistY += deltaDistY;
                    mapY += stepY;
                    side = 1;
                }

                if (this.mapa.matris[mapY][mapX] != 0) hit = true;
            }

            // distância perpendicular
            let perpWallDist;
            if (side === 0)
                perpWallDist = (mapX - this.posX + (1 - stepX) / 2) / rayDirX;
            else
                perpWallDist = (mapY - this.posY + (1 - stepY) / 2) / rayDirY;

            const lineHeight = resolucao * this.canvas.height / perpWallDist;
            let horizonte = this.canvas.height / 2 + this.player.alturaDeCamera;
            let drawEnd = horizonte + lineHeight;
            let drawStart = drawEnd - lineHeight * (this.mapa.matris[mapY][mapX] / 100) * 2;

            //if (drawStart < 0) drawStart = 0;
            if (drawEnd >= this.canvas.height) drawEnd = this.canvas.height - 1;

            // teto
            this.ctx.strokeStyle = `rgb(255, 0, 0)`;

            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, horizonte);
            this.ctx.stroke();

            this.ctx.strokeStyle = `rgb(0, 0, 255)`;

            this.ctx.beginPath();
            this.ctx.moveTo(x, horizonte);
            this.ctx.lineTo(x, this.canvas.width);
            this.ctx.stroke();

            // sombra simples
            let shade = side === 1 ? 160 : 220;
            this.ctx.strokeStyle = `rgb(${shade}, ${shade}, ${shade})`;

            this.ctx.beginPath();
            this.ctx.moveTo(x, drawStart);
            this.ctx.lineTo(x, drawEnd);
            this.ctx.stroke();

            let chao = drawStart;

            shade = side === 1 ? 220 : 160;
            this.ctx.strokeStyle = `rgb(${shade}, ${shade}, ${shade})`;
            this.ctx.beginPath();
            this.ctx.moveTo(x, chao);
            this.ctx.lineTo(x, drawStart);
            this.ctx.stroke();
        }
    }
}

const doom = new Raycaster();