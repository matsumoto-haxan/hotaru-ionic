import { Component } from '@angular/core';
import { GatheringService } from './../service/gathering.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  testList: string;

  constructor(
    public gatheringService: GatheringService
  ) {
  }

  /**
   * 画面遷移時に動作
   */
  ionViewDidEnter() {

    // ↓起動時に取得したい
    this.gatheringService.loadGatherdList(firebase.auth().currentUser.uid);
    
    this.testList = JSON.stringify(GatheringService.localList);


  }

}


