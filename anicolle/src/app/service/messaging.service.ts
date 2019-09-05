import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import * as firebase from 'firebase';
import { NavController, AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  /**
   * FCMトークン（アプリ起動時に更新して保持）
   */
  public static fcmRegistrationToken: string;

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    public platform: Platform,
    private fbnotice: Firebase,
    private firestore: AngularFirestore,
    private http: HTTP
  ) { }

  /**
   * 
   */
  generateToken() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {

        // トークン発行
        this.fbnotice.getToken()
          .then(token => this.registerToken(token))
          .catch(error => alert('Error getting token: ' + error));

        // 通知許可
        this.fbnotice.hasPermission().then(data => {
          if (data.isEnabled !== true) {
            this.fbnotice.grantPermission().then(res => {
              console.log(res.body);
            });
          }
        });

        // メッセージ受付開始
        this.fbnotice.onNotificationOpen().subscribe(data => {
          this.showAlert(data.fromname);
        });
      }
    });
  }

  registerToken(token: string) {
    MessagingService.fcmRegistrationToken = token;
  }

  /**
   * メッセージを受信したら通知を表示する
   * @param messageStr メッセージ内容
   */
  async showAlert(fromname: string) {
    const alert = await this.alertController.create({
      header: 'シグナルが届きました',
      message: '近くにいる' + fromname + 'さんからシグナルが届いています。',
      buttons: ['OK']
    });
    alert.present();
  }


  /**
   * FCMトークンを更新する
   * @param userid string
   * @param token string
   */
  updateFcmToken(userid: string, token: string) {
    const record = {
      uid: userid,
      fcmtoken: token,
    };
    return this.firestore.doc('fcmtoken/' + userid).set(record);
  }

  /**
   * プッシュ送信用にレコードを作成する
   * @param myId string
   * @param targetId string
   */
  createMessageRecord(myId: string, targetId: string, myName: string) {
    const record = {
      from: myId,
      fromname: myName,
      to: targetId,
      timestamp: new Date()
    };
    return this.firestore.collection('messaging').add(record);
  }


}
