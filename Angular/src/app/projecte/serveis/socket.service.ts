import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  messageSubject: Subject<any> = new Subject<any>();
  jocComponent: any;

  constructor() {
    this.socket = io('http://localhost:3000');
    this.socket.on('connection_error', (error) => {
      console.log('Connection error:', error);
    });
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });
    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    this.socket.on('message', (message) => {
      this.messageSubject.next(message);
    });
  }

  sendMessage(message: any): void {
    try {
      const jsonData = JSON.stringify(message);
      this.socket.emit('message', jsonData);
    } catch (error) {
      console.error('Error al enviar el mensaje JSON:', error);
    }
  }
  
  listenForSoldierPositions(): void {
    this.socket.on('soldierPositions', (data: any) => {
      const message = JSON.parse(data);
      const index = message.index;
      const position = message.position;
  
      console.log(`Received message from player: ${data}`);
  
      // Crea un nuevo soldado en la posición recibida
      this.jocComponent.crearSoldadoEnPosicion(position.x, position.y);
    });
  }
  
}
