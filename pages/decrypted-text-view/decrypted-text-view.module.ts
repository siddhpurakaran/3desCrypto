import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DecryptedTextViewPage } from './decrypted-text-view';

@NgModule({
  declarations: [
    DecryptedTextViewPage,
  ],
  imports: [
    IonicPageModule.forChild(DecryptedTextViewPage),
  ],
})
export class DecryptedTextViewPageModule {}
