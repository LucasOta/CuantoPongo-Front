import { Component } from '@angular/core';
import {
  NavController,
  Events,
  App,
  AlertController,
  ToastController,
  LoadingController
} from 'ionic-angular';
import { SocketProvider } from '../../providers/socket/socket';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  createdRoomID: number;
  createdRoomName: string;

  loading = this.loadingCtrl.create({
    spinner: 'dots',
    content: 'Creando lista'
  });

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public socketProvider: SocketProvider,
    private app: App,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {
    this.createdRoomID = null;
    this.createdRoomName = null;

    events.subscribe('roomCreated', proomID => {
      console.log('wesaaaaa, pasé por acá');

      this.createdRoomID = proomID.roomID;
      if (this.createdRoomName) {
        this.loading.dismiss();
        this.goToSimpleRoom();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
  }

  async nombreLista(goToSimple: boolean) {
    const alert = await this.alertCtrl.create({
      title: '¡Empecemos!',
      subTitle:
        'Escribe un nombre para que tus amigos sepan que están en la lista correcta.',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de la lista'
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
          text: 'Crear',
          cssClass: 'alert_add',
          handler: data => {
            console.log(data);
            if (data.nombre == '') {
              this.showErrorToast('Completar campo nombre', 'top');
              return false;
            } else {
              this.createdRoomName = data.nombre;

              if (!this.createdRoomID) {
                this.loading.present();
              } else {
                this.goToSimpleRoom();
              }
            }
          }
        }
      ]
    });

    alert.present();
  }

  newSimpleRoom() {
    this.socketProvider.newSimpleRoom();
    this.nombreLista(true);
    // this.nombreLista();
  }
  newDiffRoom() {
    this.nombreLista(false);
    // this.socketProvider.newSimpleRoom();
  }

  //Go To Rooms
  goToSimpleRoom() {
    this.socketProvider.setSimpleRoomName(
      this.createdRoomID,
      this.createdRoomName
    );

    this.navCtrl.push('SimpleModePage', {
      roomID: this.createdRoomID
      // roomName: this.createdRoomName
    });
  }

  // Toasts
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
