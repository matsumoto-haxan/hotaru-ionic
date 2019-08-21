import { IonicModule } from '@ionic/angular';
import { RouterModule, } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { TweetmodalComponent } from './tweetmodal/tweetmodal.component';
import { ProfilemodalComponent } from './profilemodal/profilemodal.component';
import { GlowmodalComponent } from './glowmodal/glowmodal.component';
import { ScanmodalComponent } from './scanmodal/scanmodal.component';
import { QrmodalComponent } from './qrmodal/qrmodal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],
  declarations: [
    Tab2Page,
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
export class Tab2PageModule {}
