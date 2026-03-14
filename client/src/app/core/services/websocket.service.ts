import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { SOCKET_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket;
  private url = SOCKET_BASE_URL;

  constructor() {
    this.socket = io(this.url);
  }

  joinOrder(orderId: string) {
    this.socket.emit('join_order', orderId);
  }

  onOrderUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('order_updated', (data) => {
        observer.next(data);
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
