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
  constructor(
    public navCtrl: NavController,
    public events: Events,
    public socketProvider: SocketProvider,
    private app: App,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController
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

  async nombreLista() {
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
              let loading = this.loadingCtrl.create({
                spinner: 'dots',
                content: 'Loading Please Wait...'
              });

              loading.present();

              setTimeout(() => {
                loading.dismiss();
                // this.socketProvider.newSimpleRoom();
              }, 3000);

              // this.socketProvider.addSimpleParticipant();
              // Hay que hacer algo para mandarle el nombre una vez que tenga el número
            }
          }
        }
      ]
    });

    alert.present();
  }

  newSimpleRoom() {
    // this.nombreLista();
    this.socketProvider.newSimpleRoom();
  }
  newDiffRoom() {
    this.nombreLista();
    // this.socketProvider.newSimpleRoom();
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
