import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import * as socketIo from 'socket.io-client';

/*
  Generated class for the SocketProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SocketProvider {
  private socket;

  constructor(public events: Events) {
    this.socket = socketIo('http://localhost:3000');
    this.socket.on('hello', data => console.log(data));

    //Listening Frontend
    events.subscribe('newSimpleRoom', () => this.newSimpleRoom());

    // Listening Socket Server
    this.socket.on('RoomCreated', data => console.log(data));
    this.socket.on('updatedSimpleRoom', data => this.updatedRoom(data));
    this.socket.on('numNewSimpleRoom', data => this.goToRoom(data));
  }

  //Emmiting events to the Front
  goToRoom(pData) {
    this.events.publish('goToRoom', { roomNo: pData });
  }
  updatedRoom(pData) {
    this.events.publish('updatedRoom', { room: pData });
  }

  //Emmiting events to the Server
  newSimpleRoom() {
    this.socket.emit('newSimpleRoom');
  }
  addSimpleParticipant(pRoomNo, pAlias, pPaid) {
    this.socket.emit('newSimpleParticipant', {
      roomNo: pRoomNo,
      alias: pAlias,
      paid: parseInt(pPaid)
    });
  }
}
