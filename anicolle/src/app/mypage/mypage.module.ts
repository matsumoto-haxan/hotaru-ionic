import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MypagePage } from './mypage.page';

import { DatePicker } from '@ionic-native/date-picker/ngx';

const routes: Routes = [
  {
    path: '',
    component: MypagePage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MypagePage],
  providers:[DatePicker]
})
export class MypagePageModule {}
