import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { GlowService } from '../../service/glow.service';

@Component({
  selector: 'app-glowmodal',
  templateUrl: './glowmodal.component.html',
  styleUrls: ['./glowmodal.component.scss'],
})
export class GlowmodalComponent implements OnInit {

  bgStyle: any;

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public glowService: GlowService,
  ) { }


  ngOnInit() {
    const uid = this.navParams.data.uid;
    const tid = this.navParams.data.tid;
    const dss = this.glowService.getGlow(uid, tid);

    dss.forEach(elm => {
      if (elm.data()) {
        this.bgStyle = {
          background: elm.data().colorcode
        };
      } else {
        this.bgStyle = {
          background: this.glowService.createGlow(uid, tid)
        };
      }
    });


  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
