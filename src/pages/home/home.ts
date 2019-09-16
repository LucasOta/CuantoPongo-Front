import { Component } from '@angular/core';
import { NavController, Events, App } from 'ionic-angular';
import { SocketProvider } from '../../providers/socket/socket';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public events: Events,
    public socketProvider: SocketProvider,
    private app: App
  ) {
    events.subscribe('goToRoom', pRoomNo => {
      console.log(pRoomNo.roomNo);

      // this.app.getRootNavs()[0].push('SimpleModePage', { roomNo: pRoomNo });
      this.navCtrl.push('SimpleModePage', { roomNo: pRoomNo.roomNo });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
  }

  newSimpleRoom() {
    // this.events.publish('newSimpleRoom');
    this.socketProvider.newSimpleRoom();
  }
}
