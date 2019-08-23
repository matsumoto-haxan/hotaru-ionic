import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class QrtokenService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  /**
   * 自分と相手の情報を元に照合レコードを新規作成する
   * @param myid string 自分のユーザID
   * @param uid string 相手のユーザID
   * @return token string トークンとして使うFBのDocumentID
   */
  async createToken(myid: string, uid: string) {
    // let token = '';
    const ts = new Date();
    const data = {
      generaterId: myid,
      scannerId: uid,
      timestamp: ts
    };
    /*
    this.firestore.collection('qrtoken').add(data).then(res => {
      token = res.id;
      return token;
    });
    */
    const res = await this.firestore.collection('qrtoken').add(data);
    return res.id;
  }

  readToken(tokenId: string) {
    alert('tokenid: ' + tokenId);
    return this.firestore.collection('qrtoken').doc(tokenId).get();
  }
}
