import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL, SOCKET_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class GroupOrderService {
  private apiUrl = `${API_BASE_URL}/group-orders`;
  private http = inject(HttpClient);
  private socket: Socket;
  
  activeGroup = signal<any>(null);

  constructor() {
    this.socket = io(SOCKET_BASE_URL);
    this.socket.on('group_received', (group) => {
      this.activeGroup.set(group);
    });
  }

  createGroup(restaurantId: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { restaurantId }).pipe(
      tap(group => {
        this.activeGroup.set(group);
        this.socket.emit('join_group', group.code);
      })
    );
  }

  joinGroup(code: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${code}`).pipe(
      tap(group => {
        this.activeGroup.set(group);
        this.socket.emit('join_group', group.code);
      })
    );
  }

  updateGroupCart(group: any) {
     this.socket.emit('group_update', { groupCode: group.code, group });
  }
}
