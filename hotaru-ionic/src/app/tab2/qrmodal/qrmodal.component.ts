import { Component, OnInit } from '@angular/core';
import { QrtokenService } from './../../service/qrtoken.service';
import { NavParams, ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-qrmodal',
  templateUrl: './qrmodal.component.html',
  styleUrls: ['./qrmodal.component.scss'],
})
export class QrmodalComponent implements OnInit {

  imageUrl = 'assets/imgs/kurousa.png';
  template = 'http://chart.apis.google.com/chart?cht=qr&chs=200x200&chl=';


  constructor(
    public navParams: NavParams,
    public modalController: ModalController,
    public qrtokenService: QrtokenService
  ) { }

  ngOnInit() {

    const myid = this.navParams.data.myid;
    const targetid = this.navParams.data.targetid;

    // QRトークンテーブルに登録する
    this.qrtokenService.createToken(myid, targetid).then(token => {

      // トークン（DocID）でQRコード画像URLを生成
      this.imageUrl = this.template + token;

    });




  }

}
