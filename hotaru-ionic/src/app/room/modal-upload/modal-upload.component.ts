import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from '@ionic/angular'; // 追加

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styleUrls: ['./modal-upload.component.scss'],
})
export class ModalUploadComponent implements OnInit {

  @Input() value: number;

  constructor(navParams: NavParams) { }

  ngOnInit() {}

}
