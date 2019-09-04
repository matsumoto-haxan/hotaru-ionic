import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GlowService {

  // キレイな色の方がいいかと思ったので、とりあえずベタ定数で指定しました
  // CSSクラス自体は、/src/theme/variables.scssで定義しています
  /*
  colors = [
    'glow_pastel_fire',
    'glow_pastel_opera',
    'glow_pastel_violet',
    'glow_pastel_royal',
    'glow_pastel_celestial',
    'glow_pastel_aqua',
    'glow_pastel_lime',
    'glow_pastel_grass',
    'glow_pastel_yellow',
    'glow_pastel_orange'
  ];
  */
  colors = [
    '#ff7f7f',
    '#ff7fff',
    '#bf7fff',
    '#7f7fff',
    '#7fbfff',
    '#7fffff',
    '#7fff7f',
    '#bfff7f',
    '#ffff7f',
    '#ffbf7f'
  ];

  constructor(
    private firestore: AngularFirestore
  ) { }

  /**
   * 自分と相手の光情報を新規作成する
   * @param myid string 自分のユーザID
   * @param uid string 相手のユーザID
   * @return cc string CSSクラス名
   */
  createGlow(myid: string, uid: string) {

    const cc = this.getColor();
    const data = {
      colorcode: cc
    };
    this.firestore.collection('glow').doc(myid).collection('userid').doc(uid).set(data);
    this.firestore.collection('glow').doc(uid).collection('userid').doc(myid).set(data);
    return cc;
  }

  /**
   * 自分と相手の光情報を取得する
   * @param myid string 自分のユーザID
   * @param uid string 相手のユーザID
   */
  getGlow(myid: string, uid: string) {
    const dss = this.firestore.collection('glow')
      .doc(myid)
      .collection('userid')
      .doc(uid).get();
    return dss;
  }

  getColor() {
    const colorStr = this.colors[Math.floor(Math.random() * 1000 % this.colors.length)];
    return colorStr;
    /*
    // ランダムで出すならこんな感じで
    let r = Math.floor(Math.random() * 255);
    let color = `rgb(${r},${g},${b})`;
    */
  }

}
