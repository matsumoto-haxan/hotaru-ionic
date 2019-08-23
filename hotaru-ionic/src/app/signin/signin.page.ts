import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { ProfileService } from './../service/profile.service';
import { GatheringService } from './../service/gathering.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  data: { email: string, password: string } = { email: '', password: '' };

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    public profileService: ProfileService,
    public gatheringService: GatheringService) { }


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

      // プロフィールを取得してクラス変数に保存
      await this.profileService.loadProfile(firebase.auth().currentUser.uid);

      // ギャザリングリストを取得してクラス変数に保存
      await this.gatheringService.loadGatherdList(firebase.auth().currentUser.uid);

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
        .createUserWithEmailAndPassword(this.data.email, this.data.password).then(
          (resp) => {
            // 新規登録したらプロフィールテーブルにカラのデータを挿入
            const json = {
              uid: resp.user.uid,
              name: '',
              nickname: '',
              profile: 'よろしくね',
              sex: ''
            };
            this.profileService.createProfile(json);
            ProfileService.myLocalProfile = json;
          });

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
