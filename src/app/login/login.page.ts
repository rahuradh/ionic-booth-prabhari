import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { ToastController, LoadingController, NavController, Platform, AlertController, IonRouterOutlet } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet;

  user = {} as User;
  passwordEyeIcon: string = "eye";
  passwordType: string = "password";

  constructor(private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private platform: Platform,
    private alertController: AlertController,
    private router: Router) {

    this.platform.backButton.subscribeWithPriority(0, async () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === "/login") {
        const alert = await this.alertController.create({
          header: "Close App",
          message: "Do you really want to close the app?",
          buttons: [
            {
              text: "Cancel",
              role: "cancel"
            }, {
              text: "Close App",
              handler: () => {
                navigator["app"].exitApp();
              }
            }
          ]
        });
        await alert.present();
      }
    });
  }

  successCallback(result) {
    this.showToaster(result);
  }

  errorCallback(error) {
    this.showToaster(error);
  }

  ngOnInit() {
  }

  async login(user: User) {
    if (this.formValidation()) {
      let loader = this.loadingCtrl.create({
        message: "Please wait...."
      });
      (await loader).present();
      try {
        this.firestore.collection("usersList", ref => ref.where('phoneNo', '==', user.phoneNo)).snapshotChanges().subscribe(data => {
          if (data.length != 0) {
            data.map(currentUser => {
              if (currentUser.payload.doc.data()['password'] == user.password) {
                this.navCtrl.navigateRoot("dashboard/" + user.phoneNo);
              } else {
                this.showToaster("The password you have entered is wrong.");
              }
            });
          } else {
            this.showToaster("This Phone Number is not registered yet.");
          }
        });
      } catch (err) {
        this.showToaster(err);
      }
      (await loader).dismiss();
    }
  }

  formValidation() {
    if (!this.user.phoneNo) {
      this.showToaster("Enter Phone Number");
      return false;
    }
    if (!this.user.password) {
      this.showToaster("Enter Password");
      return false;
    }
    return true;
  }
  showToaster(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }
  showHidePassword() {
    this.passwordEyeIcon = this.passwordEyeIcon == "eye" ? "eye-off" : "eye";
    this.passwordType = this.passwordType == "password" ? "text" : "password";
  }
}
