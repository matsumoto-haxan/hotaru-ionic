import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { ProfileService } from './../service/profile.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {

  data: { myname: string, nickname: string, profile: string, sex: number } =
    { myname: '', nickname: '', profile: '', sex: 0 };


  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    public profileService: ProfileService
  ) { }



  /**
  　* 画面遷移してきた時に動作する
 　 */
  ionViewDidEnter() {

    // クラウドのデータを取得
    const qss = this.profileService.getProfile(firebase.auth().currentUser.uid);
    qss.forEach(elm => {
      const prof = elm.docs[0].data();
      this.data.myname = prof.name;
      this.data.nickname = prof.nickname;
      this.data.profile = prof.profile;
      this.data.sex = prof.sex;
    });

  }

  /**
   * プロフィールを更新
   */
  async update() {
    try {

      console.log('ログイン中ユーザ：' + firebase.auth().currentUser.uid);

      const json = {
        uid: firebase.auth().currentUser.uid,
        name: this.data.myname,
        nickname: this.data.nickname,
        profile: this.data.profile,
        sex: this.data.sex
      };
      await this.profileService.updateProfile(firebase.auth().currentUser.uid, json);

      const alert = await this.alertController.create({
        header: '更新しました',
        buttons: ['OK']
      });
      alert.present();

    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Oh… Sorry',
        message: 'Hotaruサーバーで、何かエラーが起きたみたいです。ちょっと待ってもう一回やってみてください。' + error.message,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  signout() {
    firebase.auth().signOut();
    this.navCtrl.navigateRoot('signin');
  }

}
