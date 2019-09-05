import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public static myLocalProfile: any;

  constructor(
    private firestore: AngularFirestore
  ) { }


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

  async getProfile(userid: string) {
    // const qss = await this.firestore.collection('/profiles', ref => ref.where('uid', '==', userid)).get();
    // ProfileService.myLocalProfile
    return this.firestore.collection('/profiles', ref => ref.where('uid', '==', userid)).get();
  }

  /**
   * 自分のプロフィールをロードして、ローカルに保存する
   * @param userid 自分のユーザID
   */
  async loadProfile(userid: string) {
    this.firestore.collection('/profiles', ref => ref.where('uid', '==', userid))
      .get().forEach(elm => {
        const data = elm.docs[0].data();
        const json = {
          uid: data.uid,
          name: data.name,
          nickname: data.nickname,
          profile: data.profile,
          sex: data.sex,
          birthday: data.birthday,
          animal: data.animal,
          iconurl: data.iconurl
        };
        ProfileService.myLocalProfile = json;
      });
  }


  updateProfile(recordID, record) {
    this.firestore.doc('profiles/' + recordID).set(record);
  }

  deleteProfile(recordId: string) {
    this.firestore.doc('profiles/' + recordId).delete();
  }

  /**
   * メッセージングのトークンを更新する
   * @param userId string ユーザID
   * @param token string FCMトークン
   */
  updateFcmToken(userId: string, token: string) {
    const record = {
      fcmtoken: token
    };
    this.firestore.doc('profiles/' + userId).set(record);
  }









}

