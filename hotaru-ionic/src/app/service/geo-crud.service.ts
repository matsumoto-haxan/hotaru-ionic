import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GeoCrudService {

  constructor(private firestore: AngularFirestore) { }

  create_NewGeo(record) {
    return this.firestore.collection('Locations').add(record);
  }

  read_Geo() {
    return this.firestore.collection('Locations').snapshotChanges();
  }

  update_Geo(recordID, record) {
    this.firestore.doc('Locations/' + recordID).set(record);
  }

  delete_Geo(recordId: string) {
    this.firestore.doc('Locations/' + recordId).delete();
  }

}
