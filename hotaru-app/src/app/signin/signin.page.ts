import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  data: {
    email: string,
    password: string,
    phoneNumber: string
  } = {
      email: '',
      password: '',
      phoneNumber: ''
    };

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController) { }

  async signIn() {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(this.data.email, this.data.password);

      this.navCtrl.navigateRoot ('room');

    } catch (error) {
      const alert = await this.alertController.create({
        header: '警告',
        message: error.message,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async signUp() {
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.data.email, this.data.password);

      this.navCtrl.navigateRoot('room');

    } catch (error) {
      const alert = await this.alertController.create({
        header: '警告',
        message: error.message,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  /**
   * SMSでログインする仕組みは未実装
   * https://firebase.google.com/docs/auth/web/phone-auth#send-a-verification-code-to-the-users-phone
   * https://qiita.com/k5trismegistus/items/6e6340e145f178983182
   */


  ngOnInit() {
  }

}
