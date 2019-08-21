import { Component, OnInit, NgModule, } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker, icon, popup } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeoCrudService } from './../service/geo-crud.service';
import * as firebase from 'firebase';
import { NavController, AlertController, Platform, ModalController } from '@ionic/angular';
import * as geofirex from 'geofirex';
import { TweetmodalComponent } from './tweetmodal/tweetmodal.component';
import { ProfilemodalComponent } from './profilemodal/profilemodal.component';


declare var GeoFire: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

/**
 * マップ画面クラス
 */
export class Tab2Page {

  constructor(
    public geolocation: Geolocation,
    public geoClud: GeoCrudService,
    public navCtrl: NavController,
    public platform: Platform,
    public modalController: ModalController
    ) { }

  // メンバー
  map: Map;
  currentPosition: number[];
  watch: any;
  subscription: any;
  // currentRecordId: string;
  // userId: string;
  myMarker: any;
  lastUpdatePosition = [0, 0];
  range = 0.0001; // 移動基準距離（20mくらい）
  mytweet = '';

/**
 * ◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾ 使うメソッド ◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾
 */

/**
 * 画面遷移してきた時に動作する
 */
  ionViewDidEnter() {

    // userIdがカラなら取得
    if (firebase.auth().currentUser.uid != null) {
      // this.userId = firebase.auth().currentUser.uid;
      // console.log('ユーザーID：' + this.userId);
    } else {
      console.log('サインインしていません');
      this.navCtrl.navigateRoot('signin');
    }

    // マップが用意されていなければ生成する（位置情報が手に入らない場合、適当に築地市場駅）
    if (!this.map) {
      if (!this.currentPosition) {
        this.currentPosition = [35.6654651, 139.7653611];
      }
      this.map = new Map('mapId').setView(this.currentPosition, 17);
      tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'OSM © CartoDB',
        closePopupOnClick: false
      }).addTo(this.map);

      // 自分のアイコンを作成
      const myIcon = icon({
        iconUrl: 'assets/imgs/kurousa.png',
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        opacity: 0.3,
        zIndexOffset: 0,
        // popupAnchor: [-3, -76],
        // shadowUrl: 'my-icon-shadow.png',
        // shadowSize: [68, 95],
        // shadowAnchor: [22, 94]
      });

      this.myMarker = marker(this.currentPosition, { icon: myIcon }).addTo(this.map);

      this.getNearUser(this.currentPosition, 100);
    }

    if (!this.watch) {
      this.setTracking();
    }
  }

  /**
   * 自分の位置情報をトラッキングしてマップを更新する
   * TODO: バックグラウンド取得できるようにする
   */
  setTracking() {
    this.watch = this.geolocation.watchPosition();
    this.subscription = this.watch.subscribe((data) => {
      this.currentPosition = [data.coords.latitude, data.coords.longitude];

      const latlng = new latLng(this.currentPosition[0], this.currentPosition[1]);
      const panopt = { animate: true };
      this.map.panTo(latlng, panopt);
      this.myMarker.setLatLng(latlng);

      this.setGeoRecord(this.currentPosition);
    });
  }

  /**
   * 自分の位置情報をクラウドに更新する
   * @param userId string
   * @param geo number[]
   */
  updateGeoRecord(userId: string, geo: number[]) {

    const gfx = geofirex.init(firebase);
    const ul = gfx.collection('Locations');
    const point = gfx.point(geo[0], geo[1]);
    const json = {
      timestamp: Date.parse(new Date().toString()),
      position: point.data,
      uid: firebase.auth().currentUser.uid,
      tweet: this.mytweet
    };
    ul.setDoc(userId, json);

    // 最終更新位置を更新
    this.lastUpdatePosition = geo;
  }

  setGeoRecord(geo: number[]) {
    // 動いていれば更新
    if (this.isMoved(geo, this.lastUpdatePosition)) {
      this.updateGeoRecord(firebase.auth().currentUser.uid, geo);
    }
  }

  /**
   * ２地点の距離が規定値以上離れているかチェックする
   * @param geo1 number[]
   * @param geo2 number[]
   * @returns boolean
   */
  isMoved(geo1: number[], geo2: number[]) {
    const abLat = Math.abs(geo1[0] - geo2[0]);
    const abLng = Math.abs(geo1[1] - geo2[1]);
    return abLat > this.range && abLng > this.range;
  }

  /**
   * 画面遷移して出るときに動作
   */
  ionViewWillLeave() {
    // this.subscription.unsubscribe();
    // this.map.remove();
  }

/**
 * ◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾ テスト用のメソッド ◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾◾
 */

  /**
   * 近くのユーザ情報を取得する
   */
  getNearUser(centerGeo: number[], radius: number) {
    const myid = firebase.auth().currentUser.uid;
    const dt = new Date();
    const startDate = dt.setMinutes(dt.getMinutes() - 30).toString();
    const field = 'position';
    const gfx = geofirex.init(firebase);
    // TODO: 範囲検索に他の条件を追加する方法がよくわからないです
    // 時間で範囲指定したい・userIDで自分を除外したい
    // const ul = gfx.collection(
    //   'Locations',
    //   ref =>
    //     ref.where('timestamp', '>', 0).orderBy('position.geohash').orderBy('timestamp'));
    const ul = gfx.collection('Locations');
    const center = gfx.point(centerGeo[0], centerGeo[1]);
    const query = ul.within(center, radius, field);
    query.subscribe((data) => {
      data.forEach(elm => {

        /*
        // 本番はこっち
        if (
          // あまりここで条件分岐をさせたくないけどやむなしか
          elm.uid != myid
          && elm.timestamp > startDate) {
          this.setMarker(elm);
        }
        */

        // 時間によるフィルタリング無しバージョン
        if (
          // あまりここで条件分岐をさせたくないけどやむなしか
          elm.uid != myid) {
          this.setMarker(elm);
        }

      });


    });
  }

  setMarker(elm: any) {

    const elmGeo = [elm.position.geopoint.latitude, elm.position.geopoint.longitude];

    const uIcon = icon({
      iconUrl: 'assets/imgs/umaru.png',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      opacity: 0.3,
      zIndexOffset: 0,
      popupAnchor: [0, -55],
      closeButton: false,
      // shadowUrl: 'my-icon-shadow.png',
      // shadowSize: [68, 95],
      // shadowAnchor: [22, 94]
    });

    const uMarker = marker(elmGeo, { icon: uIcon }).addTo(this.map);
    uMarker
      .on('click', func => {
        this.showProfileModal(firebase.auth().currentUser.uid, elm.uid);
      })
      .bindPopup(
        '<p>' + elm.tweet + '</p>')
      .openPopup();

    /*
    // マーカー
    const uIcon = icon({
      iconUrl: 'assets/imgs/umaru.png',
      iconSize: [10, 10],
      iconAnchor: [10, 10],
      // shadowUrl: '',
      // shadowSize: [0, 0],
      // shadowAnchor: [0, 0]

    });
    const mkOption = {
      icon: uIcon
    };
    const newMarker = marker(mkOption);
    newMarker
      .setLatLng(latLng(elmGeo[0], elmGeo[1]))
      .bindPopup(
        '<p>tweet:' + elm.tweet + '</p>')
      .on('click', func => { alert('test'); });
    newMarker.addTo(this.map);
    */


    // ポップアップウインドウ
    /*
    const popOption = {
      minWidth: 100,
      autoPanPaddingTopLeft: [10, 10]
    };
    const newPopup = popup(popOption);
    newPopup
      .setLatLng(latLng(elmGeo[0], elmGeo[1]))
      .setContent(
        '<p>tweet:' + elm.tweet + '</p>')
      .isOpen();
      */
  }

  testGetNear() {
    this.getNearUser(this.currentPosition, 100);
    // this.testGetGeoFire();

  }

  /**
   * ツイートモーダルを表示する
   */
  async showTweetModal() {
    const modal = await this.modalController.create({
      component: TweetmodalComponent,
      componentProps: {  }
    });

    modal.onDidDismiss().then((res) => {
      this.mytweet = res.data;
      this.updateGeoRecord(firebase.auth().currentUser.uid, this.currentPosition);
    });
    return await modal.present();
  }

  /**
   * プロフィールモーダルを表示する
   */
  async showProfileModal(uid: string, tid: string) {

    const modal = await this.modalController.create({
      component: ProfilemodalComponent,
      componentProps: {
        myid: uid,
        targetid: tid,
        // glowobj: this.showGlowModal(uid, tid)
      }
    });

    modal.onDidDismiss().then((res) => {
      // this.mytweet = res.data;
      // this.updateGeoRecord(firebase.auth().currentUser.uid, this.currentPosition);
    });
    return await modal.present();
  }




}
