import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FieldmapPage } from './fieldmap.page';

// モーダル読み込み
import { TweetmodalComponent } from './tweetmodal/tweetmodal.component';
import { ProfilemodalComponent } from './profilemodal/profilemodal.component';
import { GlowmodalComponent } from './glowmodal/glowmodal.component';
import { ScanmodalComponent } from './scanmodal/scanmodal.component';
import { QrmodalComponent } from './qrmodal/qrmodal.component';

const routes: Routes = [
  {
    path: '',
    component: FieldmapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    FieldmapPage,
    TweetmodalComponent,
    ProfilemodalComponent,
    GlowmodalComponent,
    ScanmodalComponent,
    QrmodalComponent
  ],
  entryComponents: [
    TweetmodalComponent,
    ProfilemodalComponent,
    GlowmodalComponent,
    ScanmodalComponent,
    QrmodalComponent
  ]
})
export class FieldmapPageModule {}
