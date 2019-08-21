import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { GlowService } from '../../service/glow.service';

@Component({
  selector: 'app-glowmodal',
  templateUrl: './glowmodal.component.html',
  styleUrls: ['./glowmodal.component.scss'],
})
export class GlowmodalComponent implements OnInit {

  colorcode: string;

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public glowService: GlowService
  ) { }


  ngOnInit() {
    const uid = this.navParams.data.uid;
    const tid = this.navParams.data.tid;
    let newFlg = false;

    const dss = this.glowService.getGlow(uid, tid);
    /*
    dss.forEach(elm => {
      if (!elm.data) {
        newFlg = true;
      } else {
        alert(elm.data().colorcode);
        // this.colorcode = elm.data().colorcode;
      }
    });

    if (newFlg) {
      this.colorcode = this.glowService.createGlow(uid, tid);
    }
    */
    this.colorcode = this.glowService.createGlow(uid, tid);

  }

}
