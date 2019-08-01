import { Component} from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker, icon } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { Geolocation } from 'ionic-native';
import { GeoCrudService } from './../service/geo-crud.service';
import * as firebase from 'firebase';
import { Timestamp } from 'rxjs';
import { NavController, AlertController, Platform } from '@ionic/angular';
import * as geofirex from 'geofirex';
import { toGeoJSON } from 'geofirex';
import { element } from '@angular/core/src/render3';


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

  constructor(public geolocation: Geolocation,
              public geoClud: GeoCrudService,
              public navCtrl: NavController,
              public platform: Platform,
              ) { }

  // メンバー
  map: Map;
  currentPosition: number[];
  watch: any;
  subscription: any;
  currentRecordId: string;
  userId: string;
  myMarker: any;
  lastUpdatePosition: number[];
  range = 0.0001; // 移動基準距離（20mくらい）


  setGeoRecord() {
    const gfx = geofirex.init(firebase);
  }

  testGeoFire() {
    this.addGeoFire([35, 135]);
  }

  addGeoFire(geo: number[]) {
    const gfx = geofirex.init(firebase);
    const ul = gfx.collection('Locations');
    const point = gfx.point(geo[0], geo[1]);
    ul.add({
      uid: this.userId,
      timestamp: new Date(),
      position: point.data
    }).then((elm) => {
      this.currentRecordId = elm.id;
    });
  }

  updateGeoFire(currentID: string, geo: number[]) {
    const gfx = geofirex.init(firebase);
    const ul = gfx.collection('Locations');
    const point = gfx.point(geo[0], geo[1]);
    ul.setPoint(currentID, 'position', geo[0], geo[1]);
  }

  testGetGeoFire() {
    const gfx = geofirex.init(firebase);
    const ul = gfx.collection('Locations');
    const center = gfx.point(40.1, -119.1);
    const radius = 100;
    const field = 'position';
    const query = ul.within(center, radius, field);

    query.subscribe((data) => {
      alert(
        data[0].name
      );
    });
  }


  obtenerPosicion() {
    this.geolocation.getCurrentPosition().then(resp => {
      this.currentPosition = [resp.coords.latitude, resp.coords.longitude];
      this.createMap(this.currentPosition);
    })
      .catch(error => {
        console.log('obtenerPosicion():' + error.message);
        alert('obtenerPosicion():' + error.message);
      });
  }

  /**
   * 画面遷移してきた時に動作する
   */
  ionViewDidEnter() {

    // userIdがカラなら取得
    if (firebase.auth().currentUser.uid) {
      this.userId = firebase.auth().currentUser.uid;
      console.log('ユーザーID：' + this.userId);
    } else {
      console.log('サインインしていません');
      this.navCtrl.navigateRoot('signin');
    }

    // GeoFirex用のDB参照を設定

    // this.platform.ready().then(() => this.obtenerPosicion());

    /*
    const options = {
      timeout: 3000
    };
    this.geolocation.getCurrentPosition(options).then((resp) => {
      this.currentPosition = [resp.coords.latitude, resp.coords.longitude];
      this.createMap(this.currentPosition);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    */

    // マップが用意されていなければ生成する（位置情報が手に入らないので、適当に日本標準時）
    if (!this.map) {
      if (!this.currentPosition) {
        this.currentPosition = [35, 135];
      }
      this.map = new Map('mapId').setView(this.currentPosition, 17);
      tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'OSM © CartoDB',
      }).addTo(this.map);

      // this.addMarker(geo);
      const myIcon = icon({
        iconUrl: 'assets/imgs/kurousa.png',
        iconSize: [100, 100],
        iconAnchor: [100, 100],
        // popupAnchor: [-3, -76],
        // shadowUrl: 'my-icon-shadow.png',
        // shadowSize: [68, 95],
        // shadowAnchor: [22, 94]
      });

      this.myMarker = marker(this.currentPosition, { icon: myIcon }).addTo(this.map)
        // .bindPopup('ここにいる')
        .openPopup();
    }

    // 位置情報を追跡して、変化があったら動作する
    if (!this.watch) {
      this.watch = this.geolocation.watchPosition();
      this.subscription = this.watch.subscribe((data) => {
        this.currentPosition = [data.coords.latitude, data.coords.longitude];
        // alert('変化あり: ' + this.currentPosition);

        const latlng = new latLng(this.currentPosition[0], this.currentPosition[1]);
        this.myMarker.setLatLng(latlng);

        this.updateGeoRecord(this.currentRecordId, this.currentPosition);
      });
    }
  }

  createMap(geo: number[]) {
    // In setView add latLng and zoom
    this.map = new Map('mapId').setView(geo, 17);
    tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'OSM © CartoDB',
    }).addTo(this.map);

    // this.addMarker(geo);
    this.myMarker = marker(geo).addTo(this.map)
      .bindPopup('ここにいる')
      .openPopup();
  }

  addMarker(geo: number[]) {
    this.myMarker = marker(geo);
    this.myMarker.bindPopup('<p>Tashi Delek - Bangalore.</p>');
    // this.map.addLayer(markPoint);
    this.myMarker.addTo(this.map);
  }

  testMoveMarker() {
    const latlng = new latLng(this.currentPosition[0] + 0.0001, this.currentPosition[1] + 0.0001);
    this.myMarker.setLatLng(latlng);
  }

  setSampleMarker() {
    alert('setSampleMarker()');
    this.addMarker([35.666, 139.765]);
  }

  ionViewWillLeave() {
    // this.subscription.unsubscribe();
    // this.map.remove();
  }

  savegeo() {
    alert(this.currentPosition);
    this.createGeoRecord(this.userId, this.currentPosition);
  }

/**
 * 自分の位置情報をクラウドに保存する
 * @param uid string
 * @param geo number[]
 */
  createGeoRecord(uid: string, geo: number[]) {
    const record = {};
    record['uid'] = uid;
    record['latitude'] = geo[0];
    record['longitude'] = geo[1];
    record['timestamp'] =  this.getCurrentTime();
    this.geoClud.create_NewGeo(record).then(resp => {
      // 自分のレコードIDをローカルに保存
      this.currentRecordId = resp.id;

      // 最終更新位置を保存
      this.lastUpdatePosition = geo;
      // alert('位置情報をクラウドに新規作成');
    })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * 自分の位置情報をクラウドに更新する
   * @param currentId 
   * @param geo 
   */
  updateGeoRecord(currentId: string, geo: number[]) {
    if (currentId) {
      // 既にレコードがある場合
      const abLat = Math.abs(geo[0] - this.lastUpdatePosition[0]);
      const abLng = Math.abs(geo[1] - this.lastUpdatePosition[1]);

      // クラウド保存の値から20m以上動いていたらクラウドにアップデート
      if (abLat > this.range && abLng > this.range) {
        const record = {};
        record['latitude'] = geo[0];
        record['longitude'] = geo[1];
        record['timestamp'] = this.getCurrentTime();
        this.geoClud.update_Geo(currentId, record);

        // 最終更新位置を更新
        this.lastUpdatePosition = geo;
        // alert('位置情報をクラウド更新');
      } else {
        // alert('近距離なのでクラウド更新しません');
      }

    } else {
      // レコードがなければ新規作成
      this.createGeoRecord(this.userId, geo);
    }
  }

  /**
   * 現在時刻をタイムスタンプで取得
   * TODO: FB側でタイムスタンプだと認識してくれないので形式は要検討
   */
  getCurrentTime() {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = (d.getHours() < 10) ? '0' + d.getHours() : d.getHours();
    const min = (d.getMinutes() < 10) ? '0' + d.getMinutes() : d.getMinutes();
    const sec = (d.getSeconds() < 10) ? '0' + d.getSeconds() : d.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
  }




}
