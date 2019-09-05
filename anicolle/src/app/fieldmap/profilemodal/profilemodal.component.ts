import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { ProfileService } from './../../service/profile.service';
import { GlowmodalComponent } from './../glowmodal/glowmodal.component';
import { ScanmodalComponent } from './../scanmodal/scanmodal.component';
import { QrmodalComponent } from './../qrmodal/qrmodal.component';
// import { GatheringService } from 'src/app/service/gathering.service';
import { MessagingService } from './../../service/messaging.service';

@Component({
  selector: 'app-profilemodal',
  templateUrl: './profilemodal.component.html',
  styleUrls: ['./profilemodal.component.scss'],
})

export class ProfilemodalComponent implements OnInit {

  @Input() uid: string;
  gatheredFlg = false;
  targetProfile: any;

  data: { nickname: string, profile: string, sex: string, birthday: string, iconurl: string, animal: string }
    = { nickname: '読み込み中', profile: '読み込み中', sex: '読み込み中', birthday: '読み込み中', iconurl: 'assets/imgs/loading.gif', animal: '読み込み中'};

  constructor(
    public navParams: NavParams,
    public alertController: AlertController,
    public profileService: ProfileService,
    public modalController: ModalController,
    public messagingService: MessagingService,
  ) { }

  ngOnInit() {
    /*
    // userIDからゲット済みかどうかチェックする
    GatheringService.localList.forEach(
      json => {
        if (json.uid == this.navParams.data.targetid) {
          this.gatheredFlg = true;
        }
      }
    );
    */
    // 選択したuserIDからプロフィールデータを取得して表示
    this.profileService.getProfile(this.navParams.data.targetid)
      .then(qss => {
        qss.forEach(elm => {
          const prof = elm.docs[0].data();
          // 表示用変数に保存
          this.data.nickname = prof.nickname;
          this.data.profile = prof.profile;
          this.data.sex = prof.sex;
          this.data.birthday = this.generateViewDate(new Date(prof.birthday.seconds)).slice(5);
          this.data.iconurl = prof.iconurl;
          this.data.animal = prof.animal;

          // データ操作用変数に保存
          this.targetProfile = {
            uid: prof.uid,
            nickname: prof.nickname,
            profile: prof.profile,
            sex: prof.sex,
            iconurl: prof.iconurl,
            animal: prof.animal
          };
        });
      });
  }


  /**
   * グローモーダルを表示する
   */
  async showGlowModal() {

    const modal = await this.modalController.create({
      component: GlowmodalComponent,
      componentProps: {
        uid: this.navParams.data.myid,
        tid: this.navParams.data.targetid
      }
    });
    return await modal.present();
  }

  /**
   * スキャンモーダルを表示する
   */
  async showScanModal() {

    // ユーザIDの大小によって役割を分ける
    // 小：両者のIDをQRテーブルに登録してレコードIDを取得し、QRコードを表示
    // 大：QRスキャンしてFBを参照、両者のIDとマッチしていたらギャザリングに保存

    if (this.navParams.data.targetid < this.navParams.data.myid) {
      // QRの役割
      const modal = await this.modalController.create({
        component: QrmodalComponent,
        componentProps: {
          myid: this.navParams.data.myid,
          targetid: this.navParams.data.targetid
        }
      });
      modal.onDidDismiss()
        .then((res) => {
          if (res === true) {
            // TODO: ここで、プロフィールの見え方とかを変化させたいかも
          }
        });
      return await modal.present();

    } else {
      // スキャンの役割
      const modal = await this.modalController.create({
        component: ScanmodalComponent,
        componentProps: {
          myid: this.navParams.data.myid,
          targetid: this.navParams.data.targetid,
          targetprofile: this.targetProfile
        }
      });
      return await modal.present();
    }
  }

  /**
   * シグナルを送信する
   */
  async sendSignal() {
    const fromid = this.navParams.data.myid;
    const toid = this.targetProfile.uid;
    this.messagingService.createMessageRecord(fromid, toid);

    const alert = await this.alertController.create({
      header: 'シグナルを送信しました',
      message: 'シグナルが帰ってきたら、グローで合図してみましょう',
      buttons: ['OK']
    });
    alert.present();

  }

  /**
   * ブロックする
   * TODO: 将来要件か
   */
  async block() {
  }

  /**
   * 表示用の日付文字列を生成する
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
