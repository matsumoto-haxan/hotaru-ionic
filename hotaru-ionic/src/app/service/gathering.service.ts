import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GatheringService {

  constructor(private firestore: AngularFirestore) { }


  /**
   * 新規作成する
   * @param record json{uid,name,nickname,profile,sex}
   */
  createGathering(record) {
    return this.firestore.collection('gathering').add(record);
  }

  readGathering() {
    // return this.firestore.collection('profiles').snapshotChanges();
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
