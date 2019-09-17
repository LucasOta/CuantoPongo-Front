import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  App,
  ViewController
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
    public viewCtrl: ViewController,
    public socketProvider: SocketProvider,
    public navParams: NavParams,
    public events: Events,
    private app: App
  ) {
    events.subscribe('updatedRoom', pRoom => {
      // console.log(pRoom.room);

      this.room = pRoom.room;
      console.log(this.room);
    });

    if (this.navParams.get('roomNo')) {
      this.roomNo = this.navParams.get('roomNo');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SimpleModePage');
    console.log(this.roomNo);
  }

  volver() {
    this.navCtrl.pop();
    // this.navCtrl.remove(this.viewCtrl.index);
  }
  agregar() {
    this.socketProvider.addSimpleParticipant(
      this.roomNo,
      this.nombre,
      this.puso
    );

    this.nombre = '';
    this.puso = '';
  }

  eliminar(pId) {
    this.socketProvider.delSimpleParticipant(pId, this.roomNo);

    //no anduvo, hice la modificiación del id en el back. Verificar que eso funcione bien
    //Está haciendo las conexiones dos veces, nushe que pasa, y cada vez que agrego a un nuevo participante trae el obj dos veces.
    //Acordate que hice el repo paralelo que apunta a otro localhost para probar el uso del socket y las rooms
    //   ionic serve -p 8002 --dev-logger-port 8103
  }
}
