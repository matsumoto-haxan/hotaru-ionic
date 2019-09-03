import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tweetmodal',
  templateUrl: './tweetmodal.component.html',
  styleUrls: ['./tweetmodal.component.scss'],
})
export class TweetmodalComponent implements OnInit {

  data: { mytweet: string } = { mytweet: '' };
  @Input() value: string;

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) {
  }

  ngOnInit() { }

  async sendTweet() {
    const param = {
      tweet: this.data.mytweet
    };
    this.modalCtrl.dismiss(this.data.mytweet);
  }


}
