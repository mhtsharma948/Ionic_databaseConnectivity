import { Component } from '@angular/core';
import {Camera, SQLite, PhotoViewer} from "ionic-native";
import { NavController, Platform, ActionSheetController} from 'ionic-angular';

@Component({
  selector: 'page-page1',
  templateUrl: 'home.html'
})
export class Page1 {

  public database: SQLite;
  public image: Array<Object>;
  public base64Image: string;

  constructor(private navController: NavController, private platform: Platform, public actionSheetCtrl: ActionSheetController) {
    this.platform.ready().then(() => {
      this.base64Image = "https://placehold.it/150x150";
      this.database = new SQLite();
      this.database.openDatabase({name: "data.db", location: "default"}).then(() => {
        this.refresh();
      }, (error) => {
        console.log("ERROR: ", error);
      });
    });
  }
  public refresh() {
    this.database.executeSql("SELECT * FROM image", []).then((data) => {
      this.image = [];
      // console.log(data);
      if(data.rows.length > 0) {
        for(var i = 0; i < data.rows.length; i++) {
          this.image.push({image: data.rows.item(i).image});
        }
      }
    }, (error) => {
      console.log("ERROR: " + JSON.stringify(error));
    });
  }
  public addPicture(base64Img){
    // console.log(userName, userPassword);
    this.database.executeSql("INSERT INTO image (image) VALUES ('"+base64Img+"')", []).then((data) => {
      // console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
      console.log(error);
    });
  }
  public takePicture() {
    Camera.getPicture({
      quality : 50,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      // targetWidth: 300,
      // targetHeight: 300,
       saveToPhotoAlbum: false
    }).then(imageData => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      console.log(imageData);
      this.addPicture(this.base64Image);
      this.refresh();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
  public openImg(img){
    // console.log("image clicked");
    // console.log("you clicked"+img);
    PhotoViewer.show(img);
  }
  public presentActionSheet() {
    console.log("you are inside PAS");
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        }, {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
