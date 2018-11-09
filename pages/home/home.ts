import { DecryptedTextViewPage } from './../decrypted-text-view/decrypted-text-view';
import { EncryptedTextViewPage } from './../encrypted-text-view/encrypted-text-view';
import { FileOpener } from '@ionic-native/file-opener';
import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController, ModalController } from 'ionic-angular';
import * as CryptoJS from 'crypto-js';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File, IWriteOptions } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data: string = "";
  private loading: Loading;
  keyHex: string = "";
  encrypt: string = "";
  decrypt: string = "";
  imgFile: string = "";
  blob: any = '';
  constructor(public navCtrl: NavController,
    private fileChooser: FileChooser,
    private file: File,
    private modalCtrl: ModalController,
    private fileopener: FileOpener,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private filePath: FilePath) {
  }

  chooseFile() {
    this.fileChooser.open()
      .then((uri) => {
        this.loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        this.loading.present().then(() => {
          this.filePath.resolveNativePath(uri)
            .then((fileurl: string) => {
              let FileName = fileurl.substr(fileurl.lastIndexOf('/') + 1);
              let FilePath = fileurl.substr(0, fileurl.lastIndexOf('/') + 1);
              this.file.resolveLocalFilesystemUrl(fileurl).then((fileInfo) => {
                fileInfo.getMetadata((meta) => {
                  if (((meta.size) / (1024 * 1024)) > 5) {
                    alert("Select file within 5 mb size");
                    this.loading.dismiss();
                    this.loading = null;
                  }
                  else {
                    this.file.readAsDataURL(FilePath, FileName)
                      .then((fileData) => {
                        this.data = fileData;
                        this.loading.dismiss();
                        this.loading = null;
                      }).catch((e) => {
                        this.showUserAlert("Error in file reading", e);
                        this.loading.dismiss();
                        this.loading = null;
                      });
                  }
                }, (e) => {
                  this.showUserAlert("Error in getting file info", e);
                  this.loading.dismiss();
                  this.loading = null;
                });
              })
                .catch((e) => {
                  this.showUserAlert("Error in finding file", e);
                  this.loading.dismiss();
                  this.loading = null;
                });
            }).catch((e) => {
              this.showUserAlert("Error in resolving file path", e);
              this.loading.dismiss();
              this.loading = null;
            });
        }).catch((e) => {
          this.showUserAlert("Error in execution", e);
          this.loading.dismiss();
          this.loading = null;
        });
      });
  }

  desEncryption() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present().then(() => {
      setTimeout(() => {
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
      }, 50000);
      this.encryptFile(this.data, this.keyHex, 1)
        .then((result1) => {
          this.decryptFile(result1, this.keyHex, 2)
            .then((result2) => {
              this.encryptFile(result2, this.keyHex, 3)
                .then((result3) => {
                  this.encrypt = result3;
                  this.loading.dismiss();
                  this.loading = null;
                });
            });
        });
    });
  }

  desDecryption() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present().then(() => {
      setTimeout(() => {
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
      }, 50000);
      this.decryptFile(this.encrypt, this.keyHex, 1)
        .then((result1) => {
          this.encryptFile(result1, this.keyHex, 2)
            .then((result2) => {
              this.decryptFile(result2, this.keyHex, 3)
                .then((result3) => {
                  this.decrypt = result3;
                  this.loading.dismiss().then(() => {
                    var data = this.decrypt.split(',')[1];
                    this.blob = this.b64toBlob(data, 'image/png');
                  });
                  this.loading = null;
                });
            });
        });
    });
  }

  encryptFile(text: string, key: string, stage: number): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(CryptoJS.DES.encrypt(text, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString());
    });
  }

  decryptFile(text: string, key: string, stage: number): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(CryptoJS.DES.decrypt(text, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8));
    });
  }

  viewEncryptedText() {
    let encryptedTextView = this.modalCtrl.create(EncryptedTextViewPage, { data: this.encrypt }, { cssClass: 'inset-modal' });
    encryptedTextView.onDidDismiss(data => {
      console.log("Encrypted Text");
    });
    encryptedTextView.present();
  }

  viewDecryptedText() {
    let decryptedTextView = this.modalCtrl.create(DecryptedTextViewPage, { data:this.decrypt }, { cssClass: 'inset-modal' });
    decryptedTextView.onDidDismiss(data => {
      console.log("Decrypted Text");
    });
    decryptedTextView.present();
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  writeFile() {
    let options: IWriteOptions = { replace: true };
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present().then(() => {
      this.file.writeFile(this.file.externalDataDirectory, "FinalFile.png", this.blob, options)
        .then((fileData) => {
          this.imgFile =this.file.externalDataDirectory+"FinalFile.png";
          this.loading.dismiss();
          this.loading = null;
        })
        .catch((err) => {
          this.showUserAlert("File Writing Error", err);
          this.loading.dismiss();
          this.loading = null;
        });
    });
  }

  openFile() { }

  deleteFile(){
    this.data = "";
    this.keyHex = "";
    this.encrypt = "";
    this.decrypt = "";
    this.imgFile = "";
    this.blob = '';
  }

  showUserAlert(title: string, err: any) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: err.message ? err.message : err,
      buttons: ['OK']
    });
    alert.present();
  }

}
