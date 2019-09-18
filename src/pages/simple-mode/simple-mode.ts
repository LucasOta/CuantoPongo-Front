import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  App,
  ViewController,
  AlertController
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
    private app: App,
    private alertCtrl: AlertController
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

  ionViewDidLeave() {
    this.events.unsubscribe('updatedRoom');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SimpleModePage');
    console.log(this.roomNo);
  }

  volver() {
    this.navCtrl.pop();
    // this.navCtrl.remove(this.viewCtrl.index);
  }

  async agregar() {
    const alert = await this.alertCtrl.create({
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre'
        },
        {
          name: 'puso',
          type: 'number',
          placeholder: '$'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Agregar',
          handler: data => {
            console.log(data);
            if (data.nombre.lenght === 0) {
              return;
            }
            if (data.puso.lenght === 0) {
              data.puso = 0;
            }
            this.socketProvider.addSimpleParticipant(
              this.roomNo,
              data.nombre,
              data.puso
            );
          }
        }
      ]
    });

    alert.present();
  }

  async editar(pId) {
    let aux = this.room.participants.findIndex(existeRoom);
    function existeRoom(element: any) {
      return element.id == pId;
    }

    if (aux != -1) {
      const alert = await this.alertCtrl.create({
        inputs: [
          {
            name: 'nombre',
            type: 'text',
            placeholder: 'Nombre',
            value: this.room.participants[aux].alias
          },
          {
            name: 'puso',
            type: 'number',
            placeholder: '$',
            value: this.room.participants[aux].paid
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancelar');
            }
          },
          {
            text: 'Modificar',
            handler: data => {
              console.log(data);
              if (data.nombre.lenght === 0) {
                return;
              }
              if (data.puso.lenght === 0) {
                data.puso = 0;
              }
              this.socketProvider.modSimpleParticipant(
                this.roomNo,
                aux,
                data.nombre,
                data.puso
              );
            }
          }
        ]
      });
      alert.present();
    } else {
      // Mandar mensaje o algo diciendo que la room no existe
    }
  }

  _agregar() {
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
