import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public navCtrl: NavController) { }

  OnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref('chatrooms/').on('value', resp => {
        });
      } else {
        this.navCtrl.navigateRoot('signin');
      }
    });
  }

}
