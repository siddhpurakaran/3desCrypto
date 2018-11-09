import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-decrypted-text-view',
  templateUrl: 'decrypted-text-view.html',
})
export class DecryptedTextViewPage {
  public myParam : any;
    constructor(public navCtrl: NavController,
      private viewCtrl : ViewController,
      public navParams: NavParams) {
        this.myParam = navParams.get('data');
    }
    closeModal() {
      this.viewCtrl.dismiss();
    }
}
