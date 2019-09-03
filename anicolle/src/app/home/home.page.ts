import { Component } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import * as firebase from 'firebase';
import { NavController, AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    private fbnotice: Firebase
  ) {

    platform.ready().then(() => {
      if (platform.is('cordova')) {

        fbnotice.getToken()
          .then(token => this.registerToken(token))
          .catch(error => alert('Error getting token: ' + error));

        fbnotice.hasPermission().then(data => {
          if (data.isEnabled !== true) {
            fbnotice.grantPermission().then(res => {
              // 通知を許可する
              console.log(res.body);
            });
          }
        });

        fbnotice.onNotificationOpen().subscribe(data => {
          this.showAlert(data.body);
        });
      }
    });


    if (firebase.auth().currentUser === null) {
      this.navCtrl.navigateRoot('signin');
    } else {
      this.navCtrl.navigateRoot('tabs');
    }
  }

  private registerToken(token: string) {
    alert('token: ' + token);
    // tokenが取得できれば表示
  }

  private showAlert(message: string) {
    alert('message: ' + message);
    // tokenが取得できれば表示
  }
}
