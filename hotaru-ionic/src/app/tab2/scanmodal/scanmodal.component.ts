import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { GatheringService } from './../../service/gathering.service';
import { QrtokenService } from './../../service/qrtoken.service';
import {
  BarcodeScannerOptions,
  BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-scanmodal',
  templateUrl: './scanmodal.component.html',
  styleUrls: ['./scanmodal.component.scss'],
})
export class ScanmodalComponent implements OnInit {

  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  isSuccess = false;



  constructor(
    public navParams: NavParams,
    public modalController: ModalController,
    private barcodeScanner: BarcodeScanner,
    public qrtokenService: QrtokenService,
    public gatheringService: GatheringService,
    public alertController: AlertController
  ) {

    this.encodeData = 'https://www.FreakyJolly.com';
    // Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  ngOnInit() {



  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        // alert('Barcode data ' + JSON.stringify(barcodeData));
        this.scannedData = barcodeData;

        this.authPairing(barcodeData.text);
      })
      .catch(err => {
        console.log('Error', err);
      });
  }

  async authPairing(token: string) {
    const res = await this.qrtokenService.readToken(token);
    res.forEach(async elm => {
      const gid = elm.data().generaterId;
      const sid = elm.data().scannerId;

      // トークンでFBから取得したIDと自分が持ってるIDが同一であるか
      if (gid == this.navParams.data.targetid &&
          sid == this.navParams.data.myid
      ) {

        // スキャンした人（本人）のプロフィールを取得
        const sprofile = ProfileService.myLocalProfile;

        // QR生成した人（相手）のプロフィールを取得
        const gprofile = this.navParams.data.targetprofile;

        this.gatheringService.createGathering(sid, gid, sprofile, gprofile);

        // TODO: 要エラーハンドリング。↑が成功した時のみ動作

        const alert = await this.alertController.create({
          header: 'ゲットしました！',
          message: '○◯人目のお友達です！！',
          buttons: ['OK']
        });
        alert.present();

        this.isSuccess = true;

        this.modalController.dismiss(this.isSuccess);
      } else {
        const alert = await this.alertController.create({
          header: 'ゲット失敗',
          message: '正しくデータ交換できませんでした',
          buttons: ['OK']
        });
        alert.present();
      }

    });
  }


  /**
   * QRコードを生成する。今回は使わない見込み
   */
  encodedText() {
    this.barcodeScanner
      .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData)
      .then(
        encodedData => {
          console.log(encodedData);
          this.encodeData = encodedData;
        },
        err => {
          console.log('Error occured : ' + err);
        }
      );
  }

}
