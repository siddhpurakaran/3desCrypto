import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EncryptedTextViewPage } from './encrypted-text-view';

@NgModule({
  declarations: [
    EncryptedTextViewPage,
  ],
  imports: [
    IonicPageModule.forChild(EncryptedTextViewPage),
  ],
})
export class EncryptedTextViewPageModule {}
