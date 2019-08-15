import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profilemodal',
  templateUrl: './profilemodal.component.html',
  styleUrls: ['./profilemodal.component.scss'],
})
export class ProfilemodalComponent implements OnInit {

  @Input() userObj: any;

  data: { name: string, nickname: string, profile: string, sex: string }
    = { name: '読み込み中', nickname: '読み込み中', profile: '読み込み中', sex: '読み込み中' };

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.data.name = this.userObj.uid;
    this.data.nickname = this.userObj.nickname;
    this.data.profile = this.userObj.profile;
    this.data.sex = this.userObj.sex;
  }


  async sendSignal() {
    /*
    const param = {
      tweet: this.data.mytweet
    };
    this.modalCtrl.dismiss(this.data.mytweet);
    */
  }

  /**
   * 将来要件か
   */
  async block() {
  }
}
