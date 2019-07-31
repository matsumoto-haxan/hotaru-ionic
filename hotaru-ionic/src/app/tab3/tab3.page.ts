import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public navCtrl: NavController,
              public alertController: AlertController) { }

  signout() {
    firebase.auth().signOut();
    this.navCtrl.navigateRoot('signin');
  }

}
