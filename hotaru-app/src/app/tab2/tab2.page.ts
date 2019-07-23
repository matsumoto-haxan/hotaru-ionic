import { Component } from '@angular/core';
//import { MapService } from '../services/map.service';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

/**
 * Mapページクラス
 */
export class Tab2Page {

  // メンバ
  map: Map;

  ionViewDidEnter() { this.leafletMap(); }

  leafletMap() {
    // In setView add latLng and zoom
    this.map = new Map('mapId').setView([28.644800, 77.216721], 10);
    tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'edupala.com © ionic LeafLet',
    }).addTo(this.map);


    /*marker([28.6, 77]).addTo(this.map)
      .bindPopup('Ionic 4 <br> Leaflet.')
      .openPopup();*/
  }


  /** Remove map when we have multiple map object
  ionViewWillLeave() {
    this.map.remove();
  }
  */

  addMarker() {
    const markPoint = marker([28.6, 77]);
    markPoint.bindPopup('<p>Tashi Delek - Bangalore.</p>');
    this.map.addLayer(markPoint);
  }

  constructor() {
  }

}

