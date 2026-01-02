export class Mapa {
    constructor() {
        this.nome = "map.json";
        this.matris = null;
        this.init();
        document.getElementById("novoMapa").onclick = this.createmap.bind(this);
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

    createmap() {
        const size = 100;

        const matrix = [];

        for (let y = 0; y < size; y++) {
            const row = [];
            for (let x = 0; x < size; x++) {
                if (x === 0 || y === 0 || x === size - 1 || y === size - 1) {
                    row.push(99);
                } else if (Math.random() > 0.99) {
                    row.push(Math.floor(Math.random() * 100));
                } else {
                    row.push(10);
                }
            }

            matrix.push(row);
        }

        const jsonString = this.matrixToVisualJSON(matrix);

        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "map.json";
        a.click();

        URL.revokeObjectURL(url);

    }

    matrixToVisualJSON(matrix) {
        let lines = [];

        for (let i = 0; i < matrix.length; i++) {
            const row = matrix[i];
            if(i==0){
                lines.push(`[[ ${row} ]\n`);
            }else if(i==matrix.length-1){
                lines.push(`[ ${row} ]]`);
            }else{
                lines.push(`[ ${row} ]\n`);
            }
            
        }

        return lines;
    }
}