import { Component, OnInit } from '@angular/core';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { database } from 'firebase';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.page.html',
  styleUrls: ['./mypage.page.scss'],
})
export class MypagePage implements OnInit {

  constructor(
    private datePicker: DatePicker
  ) { }

  ngOnInit() {
  }

  showCalendar() {
    this.datePicker.show({
      date: new Date('2000/1/1 0:0'),
      minDate: new Date('1960/1/1 0:0'),
      maxDate: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => alert('Got date: ' + date),
      err => alert('Error occurred while getting date: ' + err)
    );
  }

}
