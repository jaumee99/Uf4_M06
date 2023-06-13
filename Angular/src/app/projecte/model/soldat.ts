export class Soldat {
    salut: number;
    defensa: number;
    atac: number;
    fiabilitat: number;
    posicio: { x: number, y: number };
  
    constructor() {
      this.salut = 100;
      this.defensa = this.generarNumeroAleatori(1, 97);
      this.atac = this.generarNumeroAleatori(1, 100 - this.defensa - 1);
      this.fiabilitat = 100 - this.defensa - this.atac;
      this.posicio = { x: 0, y: 0 };
    }
  
    private generarNumeroAleatori(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
  