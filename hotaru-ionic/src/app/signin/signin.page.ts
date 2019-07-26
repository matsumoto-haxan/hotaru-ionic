import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  data: { email: string, password: string } = { email: '', password: '' };

  constructor(public navCtrl: NavController,
              public alertController: AlertController) { }


  async signIn() {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(this.data.email, this.data.password);

      const alert = await this.alertController.create({
        header: 'ログインしました',
        message: 'ようこそ',
        buttons: ['OK']
      });
      alert.present();

      this.navCtrl.navigateRoot('');

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
      const alert = await this.alertController.create({
        header: '登録しました',
        message: 'ようこそ',
        buttons: ['OK']
      });
      alert.present();

      this.navCtrl.navigateRoot('');

    } catch (error) {
      const alert = await this.alertController.create({
        header: '警告',
        message: error.message,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  ngOnInit() {
    // ユーザ認証してなければサインインページへ
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.navCtrl.navigateRoot('');
      } else {
      }
    });
  }

}
