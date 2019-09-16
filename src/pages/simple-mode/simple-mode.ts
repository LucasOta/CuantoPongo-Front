import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  App
} from 'ionic-angular';
import { SocketProvider } from '../../providers/socket/socket';

/**
 * Generated class for the SimpleModePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'simple/:roomNo'
})
@Component({
  selector: 'page-simple-mode',
  templateUrl: 'simple-mode.html'
})
export class SimpleModePage {
  private roomNo: number;

  nombre;
  puso;

  room;

  constructor(
    public navCtrl: NavController,
    public socketProvider: SocketProvider,
    public navParams: NavParams,
    public events: Events,
    private app: App
  ) {
    events.subscribe('updatedRoom', pRoom => {
      this.room = pRoom.room;
    });

    if (this.navParams.get('roomNo')) {
      this.roomNo = this.navParams.get('roomNo');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SimpleModePage');
    console.log(this.roomNo);
  }

  agregar() {
    this.socketProvider.addSimpleParticipant(
      this.roomNo,
      this.nombre,
      this.puso
    );
    // this.events.publish('newSimpleParticipant');
    // this.socketProvider.socket.emit('newSimpleParticipant', {
    //   roomNo: this.roomNo,
    //   alias: this.nombre,
    //   paid: parseInt(this.puso)
    // });

    this.nombre = '';
    this.puso = '';
  }
}
