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
  roomID: string;

  constructor(public events: Events) {
    this.socket = socketIo('http://localhost:3000');
    // this.socket = socketIo('https://cuanto-pongo-back.herokuapp.com');

    console.log('Este es el socket');

    console.log(this.socket);

    this.socket.on('hello', data => console.log(data));

    //Listening Frontend
    events.subscribe('newSimpleRoom', () => this.newSimpleRoom());

    // Listening Socket Server
    this.socket.on('RoomCreated', data => console.log(data));
    this.socket.on('updatedSimpleRoom', data => this.updatedRoom(data));
    this.socket.on('numNewSimpleRoom', roomID => this.roomCreated(roomID));

    this.socket.on('actualSocketIo', data => console.log(data));
  }

  //Emmiting events to the Front
  roomCreated(pRoomID) {
    this.roomID = pRoomID;
    this.events.publish('roomCreated', { roomID: pRoomID });
    console.log('roomNro: ' + pRoomID);
  }
  updatedRoom(pData) {
    this.events.publish('updatedRoom', { room: pData });
  }

  //Emmiting events to the Server
  newSimpleRoom() {
    this.socket.emit('newSimpleRoom', {
      socketID: this.socket.id
    });
  }
  getUpdatedSimpleRoom() {
    this.socket.emit('getUpdatedSimpleRoom', this.roomID);
  }
  setSimpleRoomName(pRoomID, pName) {
    this.socket.emit('setSimpleRoomName', {
      socketID: this.socket.id,
      roomID: pRoomID,
      name: pName
    });
  }
  joinSimpleRoom(pRoomID) {
    this.socket.emit('joinSimpleRoom', pRoomID);
  }
  leaveSimpleRoom(pRoomID) {
    this.socket.emit('leaveSimpleRoom', pRoomID);
  }

  addSimpleParticipant(pAlias, pPaid) {
    this.socket.emit('newSimpleParticipant', {
      roomID: this.roomID,
      alias: pAlias,
      paid: parseInt(pPaid)
    });
  }
  modSimpleParticipant(pId, pAlias, pPaid) {
    this.socket.emit('modSimpleParticipant', {
      roomID: this.roomID,
      id: pId,
      alias: pAlias,
      paid: parseInt(pPaid)
    });
  }
  delSimpleParticipant(pId) {
    this.socket.emit('delSimpleParticipant', {
      roomID: this.roomID,
      id: pId
    });
  }
}
