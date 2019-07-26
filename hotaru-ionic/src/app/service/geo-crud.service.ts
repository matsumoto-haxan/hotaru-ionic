import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GeoCrudService {

  constructor(private firestore: AngularFirestore) { }

  create_NewGeo(record) {
    return this.firestore.collection('Userlocations').add(record);
  }

  read_Geo() {
    return this.firestore.collection('Userlocations').snapshotChanges();
  }

  update_Geo(recordID, record) {
    this.firestore.doc('Userlocations/' + recordID).set(record);
  }

  delete_Geo(recordId: string) {
    this.firestore.doc('Userlocations/' + recordId).delete();
  }

}
