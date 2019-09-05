import { Component } from '@angular/core';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { database } from 'firebase';
import { NavController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { ProfileService } from './../service/profile.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.page.html',
  styleUrls: ['./mypage.page.scss'],
})
export class MypagePage {

  data: {
    myname: string,
    nickname: string,
    profile: string,
    sex: string,
    birthday: string,
    animal: string,
    iconurl: string
  } = {
      myname: '',
      nickname: '',
      profile: '',
      sex: '',
      birthday: '',
      animal: '',
      iconurl: ''
    };

  fbBirthday: any;


  constructor(
    public platform: Platform,
    private datePicker: DatePicker,
    public navCtrl: NavController,
    public alertController: AlertController,
    public profileService: ProfileService
  ) { }



  /**
  　* 画面遷移してきた時に動作する
 　 */
  ionViewDidEnter() {

    // クラウドのデータを取得
    this.profileService.getProfile(firebase.auth().currentUser.uid)
      .then(qss => {
        qss.forEach(elm => {
          const prof = elm.docs[0].data();
          this.data.myname = prof.name;
          this.data.nickname = prof.nickname;
          this.data.profile = prof.profile;
          this.data.sex = prof.sex;
          this.data.animal = prof.animal;
          this.data.iconurl = prof.iconurl;
          this.data.birthday = this.generateViewDate(new Date(prof.birthday.seconds));

          this.fbBirthday = prof.birthday;
        });
      });

  }

  /**
   * プロフィールを更新
   */
  async update() {
    try {

      const json = {
        uid: firebase.auth().currentUser.uid,
        name: this.data.myname,
        nickname: this.data.nickname,
        profile: this.data.profile,
        sex: this.data.sex,
        birthday: this.fbBirthday,
        animal: this.data.animal,
        iconurl: this.data.iconurl
      };
      await this.profileService.updateProfile(firebase.auth().currentUser.uid, json);

      const alert = await this.alertController.create({
        header: '更新しました',
        buttons: ['OK']
      });
      alert.present();

      // ローカルに保存してある自分のプロフィールを更新
      ProfileService.myLocalProfile = json;

    } catch (error) {
      const alert = await this.alertController.create({
        header: 'ごめんっ！',
        message: 'サーバーで、何かエラーが起きたみたいです。ちょっと待ってもう一回やってみてください。' + error.message,
        buttons: ['しょーがないなー']
      });
      alert.present();
    }
  }

  /**
   * ログアウトしてログインページに遷移
   */
  signout() {
    firebase.auth().signOut();
    this.navCtrl.navigateRoot('signin');
  }

  /**
   * カレンダーを表示
   */
  async showCalendar() {
      this.datePicker.show({
        date: new Date('2000/1/1 0:0'),
        minDate: new Date('1960/1/1 0:0'),
        maxDate: new Date(),
        mode: 'date',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
      }).then(
        inputdate => {
          this.data.birthday = this.generateViewDate(inputdate);
          this.fbBirthday = new Date(inputdate);
        }
      );
  }

  /**
   * 表示用の日付文字列を生成
   * @param inputdate Date
   */
  generateViewDate(inputdate: Date) {
    const year = inputdate.getUTCFullYear();
    const month = inputdate.getMonth() + 1;
    const day = inputdate.getDate();
    const strDate = year + '年' + month + '月' + day + '日';
    return strDate;
  }

}
