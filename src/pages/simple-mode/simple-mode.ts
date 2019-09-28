import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  App,
  ViewController,
  AlertController,
  ToastController
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
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
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
            if (data.nombre == '') {
              this.showErrorToast();
              return false;
            } else {
              if (data.puso == '') {
                data.puso = '0';
              }
              this.socketProvider.addSimpleParticipant(
                this.roomNo,
                data.nombre,
                data.puso
              );
            }
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
              if (data.nombre == '') {
                this.showErrorToast();
                return false;
              } else {
                if (data.puso.lenght == '') {
                  data.puso = '0';
                }
                this.socketProvider.modSimpleParticipant(
                  this.roomNo,
                  pId,
                  data.nombre,
                  data.puso
                );
              }
            }
          }
        ]
      });
      alert.present();
    } else {
      // Mandar mensaje o algo diciendo que la room no existe
    }
  }

  eliminar(pId) {
    this.socketProvider.delSimpleParticipant(pId, this.roomNo);

    //Hasta ahora logré hacer el abm de los participantes
    // Hay que testear, la modificación a veces no funca
    //Faltan validaciones, UI, y listorti el modo simple
    //   ionic serve -p 8002 --dev-logger-port 8103
  }

  compartir() {
    let newVariable: any;

    newVariable = window.navigator;

    if (newVariable && newVariable.share) {
      newVariable
        .share({
          title: 'title',
          text: 'description',
          url: 'https://soch.in//'
        })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error));
    } else {
      alert('share not supported');
    }
  }

  showErrorToast() {
    let toast = this.toastCtrl.create({
      message: 'Completar campo nombre',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
