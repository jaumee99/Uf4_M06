import {Component, ElementRef, ViewChild} from '@angular/core';
import {Soldat} from '../../model/soldat';
import {SocketService} from '../../serveis/socket.service';

@Component({selector: 'app-joc', templateUrl: './joc.component.html', styleUrls: ['./joc.component.css']})
export class JocComponent {
    @ViewChild('canvasElement', {static: true})canvasElement !: ElementRef < HTMLCanvasElement >;
    soldats : Soldat[] = [];
    selectedSoldat : Soldat | null = null;

    constructor(private socketService : SocketService) {
        this.crearSoldats();
        this.socketService.jocComponent = this;
        this.socketService.listenForSoldierPositions();
        this.socketService.messageSubject.subscribe((message : any) => {
            this.colocarSoldatsEnCanvas(JSON.parse(message));
        });
    }

    onCanvasClick(event : MouseEvent): void {
        if (this.selectedSoldat) {
            const canvasRect = this.canvasElement.nativeElement.getBoundingClientRect();
            const posicion = {
                x: event.clientX - canvasRect.left,
                y: event.clientY - canvasRect.top
            };

            const canvas = this.canvasElement.nativeElement;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.clearRect(this.selectedSoldat.posicio.x, this.selectedSoldat.posicio.y, 30, 30);

                this.selectedSoldat.posicio.x = posicion.x;
                this.selectedSoldat.posicio.y = posicion.y;

                const image = new Image();
                image.src = '../../../../assets/aSoldier.png';
                image.onload = () => {
                    ctx.drawImage(image, posicion.x, posicion.y, 30, 30);
                };
            }

            // Envia la nueva posición del soldado al servidor
            if (this.selectedSoldat) {
                this.socketService.sendMessage(JSON.stringify({
                    index: this.soldats.indexOf(this.selectedSoldat),
                    position: this.selectedSoldat.posicio
                }));
            }
            this.selectedSoldat = null;
        }
    }

    moveSoldat(direccion : string): void {
        if (this.selectedSoldat) {
            const canvas = this.canvasElement.nativeElement;
            const ctx = canvas.getContext('2d');

            if (ctx && this.selectedSoldat.posicio) {
                ctx.clearRect(this.selectedSoldat.posicio.x, this.selectedSoldat.posicio.y, 30, 30);

                let newX = this.selectedSoldat.posicio.x;
                let newY = this.selectedSoldat.posicio.y;

                switch (direccion) {
                    case 'amunt': newY -= 5;
                        break;
                    case 'avall': newY += 5;
                        break;
                    case 'esquerda': newX -= 5;
                        break;
                    case 'dreta': newX += 5;
                        break;
                }

                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const soldatSize = 30;

                if (newX < 0) {
                    newX = 0;
                } else if (newX + soldatSize > canvasWidth) {
                    newX = canvasWidth - soldatSize;
                }

                if (newY < 0) {
                    newY = 0;
                } else if (newY + soldatSize > canvasHeight) {
                    newY = canvasHeight - soldatSize;
                }

                this.selectedSoldat.posicio.x = newX;
                this.selectedSoldat.posicio.y = newY;

                const image = new Image();
                image.src = '../../../../assets/Imatges/aSoldier.png';
                image.onload = () => {
                    ctx.drawImage(image, newX, newY, 30, 30);
                };
            }

            // Envia la posición actualizada del soldado al servidor
            this.socketService.sendMessage(JSON.stringify({
                index: this.soldats.indexOf(this.selectedSoldat),
                position: this.selectedSoldat ?. posicio
            }));
        }
    }

    crearSoldats() {
        for (let i = 0; i < 5; i++) {
            const soldat = new Soldat();
            this.soldats.push(soldat);
        }
    }

    onSoldatClick(soldat : Soldat): void {
        this.selectedSoldat = soldat;
    }

    atac() {
        if (this.selectedSoldat) {
            const soldatAtacant = this.selectedSoldat;
            const soldatAtacada = this.soldats.find(soldat => soldat !== soldatAtacant);

            if (soldatAtacada) {
                const dany = Math.floor(soldatAtacant.atac * soldatAtacant.fiabilitat / soldatAtacada.defensa);
                soldatAtacada.salut -= dany;

                if (soldatAtacada.salut<= 0) {
          // borrar soldat
        }

        // Actualitza la interfície per a reflectir els canvis
      }

      // Envia la posición actualizada del soldado atacante al servidor
      this.socketService.sendMessage(JSON.stringify({
        index: this.soldats.indexOf(soldatAtacant), position: soldatAtacant?.posicio
      }));
    }
  }

  colocarSoldatsEnCanvas(soldatPosicions: { index: number, position: { x: number, y: number } }[]): void {
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const soldatPosicio of soldatPosicions) {
        const soldat = this.soldats[soldatPosicio.index];
        const image = new Image();
        image.src = '../../../../assets/aSoldier.png';

        image.onload = () => {
                    ctx.drawImage(image, soldatPosicio.position.x, soldatPosicio.position.y, 30, 30);
                };
            }
        }
    }

    crearSoldadoEnPosicion(x: number, y: number): void {
        const canvas = this.canvasElement.nativeElement;
        const ctx = canvas.getContext('2d');
      
        if (ctx) {
          // Crea un nuevo objeto Soldat con las coordenadas proporcionadas
          const nuevoSoldat = new Soldat();
          nuevoSoldat.posicio.x = x;
          nuevoSoldat.posicio.y = y;
      
          // Agrega el nuevo soldado a la lista de soldados
          this.soldats.push(nuevoSoldat);
      
          // Dibuja el nuevo soldado en el lienzo
          const image = new Image();
          image.src = '../../../../assets/aSoldier.png';
          image.onload = () => {
            ctx.drawImage(image, x, y, 30, 30);
          };
        }
      }
      
}
