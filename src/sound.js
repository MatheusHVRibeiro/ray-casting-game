export class Sound {
    constructor(nome) {
        this.nome = nome;
        this.pronto = false;
        this.init();

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    async init() {
        let json = await this.loadSprite(this.nome);
        this.tabs = json.tabs;
        this.song = json.song;
        this.pronto = true;
    }

    async loadSprite(nome) {
        const response = await fetch("./sounds/" + nome);

        if (!response.ok) {
            throw new Error("Erro ao carregar o sprite");
        }

        return await response.json();
    }

    playNote(frequency, duration) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }

    // Supondo que você carregou o JSON em 'song'
    playSong() {
        if (this.pronto) {
            let time = 0;
            this.song.forEach(n => {
                setTimeout(() => {
                    this.playNote(this.tabs[n.note], n.duration);
                }, time * 1000);
                time += n.duration;
            });
            this.pronto = false;
        }
    }
}