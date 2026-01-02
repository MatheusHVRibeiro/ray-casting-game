export class Transform {
    constructor(a, b, c, d) {
        this.pos = {
            x: a,
            y: b
        };
        this.scale = {
            x: c,
            y: d
        };
    }
}

export class Sprite {
    constructor(nome, transform) {
        this.nome = nome;
        this.transform = transform;
        this.init();
    }

    async init() {
        let json = await this.loadSprite(this.nome);
        this.paleta = json.paleta;
        this.pixels = json.pixels;
        this.largura = this.pixels[0].length;
        this.altura = this.pixels.length;
    }

    async loadSprite(nome) {
        const response = await fetch("./sprites/" + nome);

        if (!response.ok) {
            throw new Error("Erro ao carregar o sprite");
        }

        return await response.json();
    }
    render(ctx) {
        for (let py = 0; py < this.pixels.length; py++) {
            for (let px = 0; px < this.pixels[py].length; px++) {
                const colorIndex = this.pixels[py][px];
                if (colorIndex === 0) continue;
                
                ctx.fillStyle  = this.paleta[colorIndex];
                //ctx.fillStyle  = "#ffffff";
                ctx.fillRect(
                    this.transform.pos.x + px * this.transform.scale.x,
                    this.transform.pos.y + py * this.transform.scale.y,
                    this.transform.scale.x,
                    this.transform.scale.y
                );
            }
        }
    }
}