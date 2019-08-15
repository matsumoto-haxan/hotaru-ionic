import { Component, OnInit, NgModule, } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker, icon, popup } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeoCrudService } from './../service/geo-crud.service';
import * as firebase from 'firebase';
import { NavController, AlertController, Platform, ModalController } from '@ionic/angular';
import * as geofirex from 'geofirex';
import { TweetmodalComponent } from './tweetmodal/tweetmodal.component';

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
  mytweet: string;

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

    // マップが用意されていなければ生成する（位置情報が手に入らない場合、適当に新宿駅）
    if (!this.map) {
      if (!this.currentPosition) {
        this.currentPosition = [35.6940631, 139.7099038];
      }
      this.map = new Map('mapId').setView(this.currentPosition, 17);
      tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'OSM © CartoDB',
      }).addTo(this.map);

      // 自分のアイコンを作成
      const myIcon = icon({
        iconUrl: 'assets/imgs/kurousa.png',
        iconSize: [100, 100],
        iconAnchor: [50, 100],
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

  testGetGeoFire() {
    const gfx = geofirex.init(firebase);
    const ul = gfx.collection('Locations');
    const center = gfx.point(35.6658834, 139.7656723);
    const radius = 100;
    const field = 'position';
    const query = ul.within(center, radius, field);

    query.subscribe((data) => {
      alert(
        data[0].uid
      );
    });
  }

  /**
   * 近くのユーザ情報を取得する
   */
  getNearUser(centerGeo: number[], radius: number) {
    const dt = new Date();
    const startDate = dt.setMinutes(dt.getMinutes() - 30).toString();
    const field = 'position';
    const gfx = geofirex.init(firebase);
    // TODO: 範囲検索に他の条件を追加する方法がよくわからないです
    // 時間で範囲指定したい・userIDで自分を除外したい
    const ul = gfx.collection('Locations', ref => {
      return ref.where('timestamp', '>=', '0').orderBy('timestamp');
    });
    // const ul = gfx.collection('Locations');
    const center = gfx.point(centerGeo[0], centerGeo[1]);
    const query = ul.within(center, radius, field);
    query.subscribe((data) => {
      data.forEach(elm => {
        console.log('検索にかかったユーザID：' + elm.uid);
        if (elm.uid !== firebase.auth().currentUser.uid) {
          this.setMarker(elm);
        }
      });

    });
  }

  setMarker(elm: any) {

    const elmGeo = [elm.position.geopoint.latitude, elm.position.geopoint.longitude];

    // マーカー
    const uIcon = icon({
      iconUrl: '',
      iconSize: [10, 10],
      iconAnchor: [10, 10],
      shadowUrl: '',
      shadowSize: [0, 0],
      shadowAnchor: [0, 0]

    });
    const mkOption = {
      icon: uIcon
    };
    const newMarker = marker(mkOption);
    newMarker
      .setLatLng(latLng(elmGeo[0], elmGeo[1]))
      .bindPopup(
        '<p>uid:' + elm.uid + '</p>' +
        '<p>timestamp:' + elm.timestamp + '</p>' +
        '<p>tweet:' + elm.tweet + '</p>'
     );
    newMarker.addTo(this.map);

    // ポップアップウインドウ
    const popOption = {
      minWidth: 100,
      autoPanPaddingTopLeft: [10, 10]
    };
    const newPopup = popup(popOption);
    newPopup
      .setLatLng(latLng(elmGeo[0], elmGeo[1]))
      .setContent(
        '<p>uid:' + elm.uid + '</p>' +
        '<p>timestamp:' + elm.timestamp + '</p>')
      .isOpen();
  }

  testGetNear() {
    this.getNearUser(this.currentPosition, 100);
    // this.testGetGeoFire();

  }

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




}
