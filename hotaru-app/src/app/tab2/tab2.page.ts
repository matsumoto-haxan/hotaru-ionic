import { Component } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

/**
 * Mapページの画面クラス
 */
export class Tab2Page {

  map: Map;
  currentPosition: number[];
  watch: any;
  subscription: any;

  constructor(public geolocation: Geolocation, public alertController: AlertController) {  }

  // 画面遷移してきた時に動作する
  ionViewDidEnter() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentPosition = [resp.coords.latitude, resp.coords.longitude];
      this.createMap(this.currentPosition);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    // 位置情報を追跡して、変化があったら動作する
    this.watch = this.geolocation.watchPosition();
    this.subscription = this.watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      this.currentPosition = [data.coords.latitude, data.coords.longitude];
      this.createMap(this.currentPosition);
    });
  }

  // 初回DOM構築後に動作
  OnInit() {  }

  async testAlert(mes: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: mes,
      buttons: ['OK']
    });
    await alert.present();
  }


  createMap(geo: number[]) {
    // In setView add latLng and zoom
    this.map = new Map('mapId').setView(geo, 17);
    tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'OSM © CartoDB',
    }).addTo(this.map);

    // this.addMarker(geo);
    marker(geo).addTo(this.map)
      .bindPopup('ここにいる');
      // .openPopup();
  }

  addMarker(geo: number[]) {
    const markPoint = marker([geo]);
    markPoint.bindPopup('<p>Tashi Delek - Bangalore.</p>');
    this.map.addLayer(markPoint);
  }

  updateDisplay() {
    while (true) {
      setTimeout(() => {
        this.map.remove();
        this.createMap([28.6, 77]);
      }, 5000);
    }
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.map.remove();
  }

  /*
  map: Map;
  ionViewDidEnter() { this.leafletMap(); }
  leafletMap() {
    this.map = new Map('mapId').setView([35.6660316, 139.7599967], 17);
    tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'edupala.com © ionic LeafLet',
    }).addTo(this.map);
    marker([28.6, 77]).addTo(this.map)
      .bindPopup('Ionic 4 <br> Leaflet.')
      .openPopup();
  }
  ionViewWillLeave() {
    this.map.remove();
  }
  addMarker() {
    const markPoint = marker([28.6, 77]);
    markPoint.bindPopup('<p>Tashi Delek - Bangalore.</p>');
    this.map.addLayer(markPoint);
  }
*/

}

