import { Component } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import * as firebase from 'firebase';
import { NavController, AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { MessagingService } from './../service/messaging.service';
import { ProfileService } from './../service/profile.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    private fbnotice: Firebase,
    private messagingService: MessagingService,
    public profileService: ProfileService,
  ) {

    // FCM設定
    messagingService.generateToken();

    if (firebase.auth().currentUser === null) {
      // 未ログインの時
      // ルーティング
      this.navCtrl.navigateRoot('signin');

    } else {
      // ログイン済みの時

      // メッセージングトークンをアップデートする
      messagingService.updateFcmToken(
        firebase.auth().currentUser.uid,
        MessagingService.fcmRegistrationToken
      );

      // ルーティング
      this.navCtrl.navigateRoot('tabs');
    }
  }


}
