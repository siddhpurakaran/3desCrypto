import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-encrypted-text-view',
  templateUrl: 'encrypted-text-view.html',
})
export class EncryptedTextViewPage {
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
