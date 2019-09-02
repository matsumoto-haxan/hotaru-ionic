import { Component } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public platform: Platform,
    private firebase: Firebase
  ) {

    platform.ready().then(() => { 
      if (platform.is('cordova')) {
        alert('isCordova');
        firebase.getToken()
          .then(token => this.registerToken(token))
          .catch(error => alert('Error getting token: ' + error));

        alert('getToken end');

        firebase.hasPermission().then(data => {
          alert('in hasPermission()');
          if (data.isEnabled !== true) {

            firebase.grantPermission().then(res => {
              // 通知を許可する
              console.log(res.body);
              alert(res.body);
            });
          }
        });

        firebase.onNotificationOpen().subscribe(data => {
          console.log(data.body);
          this.showAlert(data.body);
        });
      }
    });

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
