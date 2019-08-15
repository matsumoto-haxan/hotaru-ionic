import { Component, OnInit, NgModule } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import * as firebase from 'firebase';

import { ModalUploadComponent } from './modal-upload/modal-upload.component';


@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})

export class RoomPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public modalController: ModalController
  ) { }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalUploadComponent, // さっき作ったComponentを指定
      componentProps: { value: 123 }
    });
    return await modal.present();
  }











  ngOnInit() {
    // ユーザ認証してなければサインインページへ
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.navCtrl.navigateRoot('main');
      } else {
        this.navCtrl.navigateRoot('signin');
      }
    });
  }

  async signOut() {
    try {
      await firebase.auth().signOut();
      this.navCtrl.navigateRoot('signin');

    } catch (error) { }
  }
}
