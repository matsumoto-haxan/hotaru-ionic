import { Component, OnInit } from '@angular/core';

import { NavController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { ProfileService } from './../service/profile.service';

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
  ) { }

  /**
   * 画面遷移時
   */
  ngOnInit() {
  }

  /**
   * サインイン
   */
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

      // TODO: ギャザリングリストを取得してクラス変数に保存
      // await this.gatheringService.loadGatherdList(firebase.auth().currentUser.uid);

      // TODO: マイページに飛ばして個人情報を入力させる
      this.navCtrl.navigateRoot('');

    } catch (error) {
      const alert = await this.alertController.create({
        header: 'ログインに失敗しました',
        message: error.code + ' : ' +　error.message,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  /**
   * 新規登録
   */
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

            // プロファイルレコードを作成
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
}
