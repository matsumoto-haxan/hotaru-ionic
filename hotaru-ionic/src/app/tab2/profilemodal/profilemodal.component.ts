import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { ProfileService } from './../../service/profile.service';
import { GlowmodalComponent } from './../glowmodal/glowmodal.component';
import { ScanmodalComponent } from './../scanmodal/scanmodal.component';
import { QrmodalComponent } from './../qrmodal/qrmodal.component';
import { GatheringService } from 'src/app/service/gathering.service';

@Component({
  selector: 'app-profilemodal',
  templateUrl: './profilemodal.component.html',
  styleUrls: ['./profilemodal.component.scss'],
})

export class ProfilemodalComponent implements OnInit {

  @Input() uid: string;
  gatheredFlg = false;
  targetProfile: any;

  data: { nickname: string, profile: string, sex: string }
    = { nickname: '読み込み中', profile: '読み込み中', sex: '読み込み中' };

  constructor(
    public navParams: NavParams,
    public profileService: ProfileService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    alert();
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
          // 変数に保存
          this.data.nickname = prof.nickname;
          this.data.profile = prof.profile;
          this.data.sex = prof.sex;

          this.targetProfile = {
            uid: prof.uid,
            nickname: prof.nickname,
            profile: prof.profile,
            sex: prof.sex
          };
        });
      });
  }

  /**
   * ギャザーに保存するテスト
   */
  async addGatherTest() {

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


  async sendSignal() {
  }

  /**
   * 将来要件か
   */
  async block() {
  }

}
