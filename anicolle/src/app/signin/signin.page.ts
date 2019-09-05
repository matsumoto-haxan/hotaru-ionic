import { Component, OnInit } from '@angular/core';

import { NavController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { ProfileService } from './../service/profile.service';
import { MessagingService } from '../service/messaging.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {


  data: { email: string, password: string } = { email: '', password: '' };

  animals = [
    ['assets/imgs/animal/bee.svg', 'はち'],
    ['assets/imgs/animal/chick.svg', 'ひよこ'],
    ['assets/imgs/animal/cock.svg', 'にわとり'],
    ['assets/imgs/animal/dog.svg', 'いぬ'],
    ['assets/imgs/animal/elephant.svg', 'ぞう'],
    ['assets/imgs/animal/horse.svg', 'うま'],
    ['assets/imgs/animal/lion.svg', 'らいおん'],
    ['assets/imgs/animal/monkey.svg', 'さる'],
    ['assets/imgs/animal/ounce.svg', 'ひょう'],
    ['assets/imgs/animal/rat.svg', 'ねずみ'],
    ['assets/imgs/animal/wolf.svg', 'おおかみ'],
    ['assets/imgs/animal/zebra.svg', 'しまうま'],
  ];

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    public profileService: ProfileService,
    public messagingService: MessagingService
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

      // メッセージングトークンをアップデートする
      this.messagingService.updateFcmToken(
        firebase.auth().currentUser.uid,
        MessagingService.fcmRegistrationToken
      );

      // ルーティング
      this.navCtrl.navigateRoot('/tabs');

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

      // TODO: メール確認させるフローを追加すること！
      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.data.email, this.data.password).then(
          (resp) => {

            const animalNo = Math.floor(Math.random() * 1000 % 12);

            // 新規登録したらプロフィールテーブルにデフォルトのデータを挿入
            const json = {
              uid: resp.user.uid,
              name: '',
              nickname: '',
              profile: 'よろしくね',
              sex: '',
              birthday: new Date(),
              animal: this.animals[animalNo][1],
              iconurl: this.animals[animalNo][0]
            };

            // プロファイルレコードを作成
            this.profileService.updateProfile(resp.user.uid, json);
            ProfileService.myLocalProfile = json;

            // メッセージングトークンをアップデートする
            this.messagingService.updateFcmToken(
              resp.user.uid,
              MessagingService.fcmRegistrationToken
            );

          });

      const alert = await this.alertController.create({
        header: 'さあはじめましょう！',
        message: 'まずはあなたの情報を登録してください。',
        buttons: ['OK']
      });
      alert.present();



      this.navCtrl.navigateRoot('/tabs/tabs/mypage');

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
