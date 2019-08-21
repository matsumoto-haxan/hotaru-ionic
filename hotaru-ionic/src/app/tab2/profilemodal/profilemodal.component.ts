import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { ProfileService } from './../../service/profile.service';
import { GlowmodalComponent } from './../glowmodal/glowmodal.component';
import { ScanmodalComponent } from './../scanmodal/scanmodal.component';
import { QrmodalComponent } from './../qrmodal/qrmodal.component';

@Component({
  selector: 'app-profilemodal',
  templateUrl: './profilemodal.component.html',
  styleUrls: ['./profilemodal.component.scss'],
})

export class ProfilemodalComponent implements OnInit {

  @Input() uid: string;
  public glowmodal: HTMLIonModalElement;

  data: { name: string, nickname: string, profile: string, sex: string }
    = { name: '読み込み中', nickname: '読み込み中', profile: '読み込み中', sex: '読み込み中' };

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public profileService: ProfileService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    // userIDからゲット済みかどうかチェックする

    // userIDからプロフィールデータを取得して表示
    const qss = this.profileService.getProfile(this.navParams.data.targetid);
    qss.forEach(elm => {
      const prof = elm.docs[0].data();
      this.data.name = prof.name;
      this.data.nickname = prof.nickname;
      this.data.profile = prof.profile;
      this.data.sex = prof.sex;
    });

    // this.glowmodal = this.navParams.data.glowobj;
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
          uid: this.navParams.data.myid,
          tid: this.navParams.data.targetid
        }
      });
      return await modal.present();

    } else {
      // スキャンの役割
      const modal = await this.modalController.create({
        component: ScanmodalComponent,
        componentProps: {
          uid: this.navParams.data.myid,
          tid: this.navParams.data.targetid
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
