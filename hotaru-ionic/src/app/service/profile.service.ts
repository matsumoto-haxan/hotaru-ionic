import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private firestore: AngularFirestore) { }


  /**
   * 新規作成する
   * @param record json{uid,name,nickname,profile,sex}
   */
  createProfile(record) {
    return this.firestore.collection('profiles').add(record);
  }

  readProfile() {
    // return this.firestore.collection('profiles').snapshotChanges();
  }

  getProfile(userid: string) {
    return this.firestore.collection('/profiles', ref => ref.where('uid', '==', userid)).get();
  }

  updateProfile(recordID, record) {
    this.firestore.doc('profiles/' + recordID).set(record);
  }

  deleteProfile(recordId: string) {
    this.firestore.doc('profiles/' + recordId).delete();
  }






}

