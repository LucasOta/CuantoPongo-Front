import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { SocketProvider } from '../../providers/socket/socket';

@IonicPage({
  segment: 'admin'
})
@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html'
})
export class AdminHomePage {
  sockets_connected = 0;
  rooms_created = 0;
  sockets_rooms = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public socketProvider: SocketProvider
  ) {
    events.subscribe('refreshedAdmin', pData => {
      this.sockets_connected = pData.data.sockets_connected;
      this.rooms_created = pData.data.rooms_created;
      this.sockets_rooms = pData.data.sockets_rooms;
    });
  }

  ionViewDidLoad() {
    this.refresh();
  }

  refresh() {
    this.socketProvider.refreshAdmin();
  }
}
