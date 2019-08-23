import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GatheringService {

  /**
   * ギャザリングリストを保管しておくクラス変数。
   * 形式：json[]
   */
  public static localList: any[];

  constructor(
    private firestore: AngularFirestore
  ) { }




  /**
  　* 自分と相手のマッチング情報を新規作成する
  　* @param myid string 自分のユーザID
  　* @param targetid string 相手のユーザID
  　* @param myprofile string 自分のプロフィール
  　* @param targetprofile string 相手のプロフィール
  　*/
  createGathering(myid: string, targetid: string, myprofile: any, targetprofile: any) {

    // 値を準備
    const ts = new Date();
    const mydata = {
      uid: myid,
      nickname: myprofile.nickname,
      profile: myprofile.profile,
      sex: myprofile.sex,
      timestamp: ts
    };

    const targetdata = {
      uid: targetid,
      nickname: targetprofile.nickname,
      profile: targetprofile.profile,
      sex: targetprofile.sex,
      timestamp: ts
    };

    // FBに保存
    this.firestore.collection('gathering').doc(targetid).collection('userid').doc(myid).set(mydata);
    this.firestore.collection('gathering').doc(myid).collection('userid').doc(targetid).set(targetdata);

    // ローカルに保存してあるギャザリングリストに追加
    GatheringService.localList.push(targetdata);
  }

  readGathering() {
    // return this.firestore.collection('profiles').snapshotChanges();
  }

  /**
   * FBから自分のギャザリングリストを取得して、ローカルに保存する
   * @param uid 自分のユーザID
   */
  loadGatherdList(uid: string) {

    this.firestore.collection('gathering').doc(uid).collection('userid')
      // .orderBy('timestamp')
      .get()
      .forEach(async qss => {
        GatheringService.localList = await qss.docs.map(doc => doc.data());
      });
  }

  getGathering(userid: string) {
    return this.firestore.collection('/gathering', ref => ref.where('uid', '==', userid)).get();
  }

  updateGathering(recordID, record) {
    this.firestore.doc('gathering/' + recordID).set(record);
  }

  deleteGathering(recordId: string) {
    this.firestore.doc('gathering/' + recordId).delete();
  }




}
