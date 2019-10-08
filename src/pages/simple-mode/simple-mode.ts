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
  segment: 'simple/:roomID'
})
@Component({
  selector: 'page-simple-mode',
  templateUrl: 'simple-mode.html'
})
export class SimpleModePage {
  roomID: number;
  roomName: string;

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
    this.roomName = 'Hubo algún problema con el nombre, pero este se la banca';

    events.subscribe('updatedRoom', pRoom => {
      this.room = pRoom.room;
      this.roomName = pRoom.room.name;
    });

    if (this.navParams.get('roomID')) {
      this.roomID = parseInt(this.navParams.get('roomID'));
    }
    // if (this.navParams.get('roomName')) {
    //   this.roomName = this.navParams.get('roomName');
    // }
  }

  ionViewDidLeave() {
    this.events.unsubscribe('updatedRoom');
    this.socketProvider.leaveSimpleRoom(this.roomID);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SimpleModePage');
    console.log(this.roomID);
    // if (this.roomName && this.roomID) {
    //   this.socketProvider.setSimpleRoomName(this.roomID, this.roomName);
    // }
    this.socketProvider.roomID = this.roomID.toString();
    this.socketProvider.joinSimpleRoom(this.roomID);
    setTimeout(() => {
      this.socketProvider.getUpdatedSimpleRoom();
    }, 500);
  }

  volver() {
    this.navCtrl.pop();
    // this.navCtrl.remove(this.viewCtrl.index);
  }

  async agregar() {
    const alert = await this.alertCtrl.create({
      cssClass: 'alert_simp_room',
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
          cssClass: 'alert_cancel',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Agregar',
          cssClass: 'alert_add',
          handler: data => {
            console.log(data);
            if (data.nombre == '') {
              this.showErrorToast('Completar campo nombre', 'top');
              return false;
            } else {
              if (data.puso == '') {
                data.puso = '0';
              }
              this.socketProvider.addSimpleParticipant(data.nombre, data.puso);
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
            cssClass: 'alert_cancel',

            handler: () => {
              console.log('Cancelar');
            }
          },
          {
            text: 'Modificar',
            cssClass: 'alert_add',

            handler: data => {
              console.log(data);
              if (data.nombre == '') {
                this.showErrorToast('Completar campo nombre', 'top');
                return false;
              } else {
                if (data.puso.lenght == '') {
                  data.puso = '0';
                }
                this.socketProvider.modSimpleParticipant(
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
    this.socketProvider.delSimpleParticipant(pId);
  }

  async compartir() {
    try {
      // Hay que preguntar primero si es mobile o browser antes del copiado
      // await navigator.clipboard.writeText('Hay que pegar el número de room'); //IMPORTANTEEEEEEEEEEEEEEEE
      this.showSuccesfulToast(
        '¡Link copiado! Compártelo con tus amigos.',
        'bottom'
      );
    } catch (err) {
      this.showErrorToast(
        'Ups, algo no anduvo bien, intenta nuevamente.',
        'bottom'
      );
    }
  }

  showErrorToast(msj: string, pos: string) {
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 1500,
      position: pos,
      cssClass: 'toast_error'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  showSuccesfulToast(msj: string, pos: string) {
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 3000,
      position: pos,
      cssClass: 'toast_succesful'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
