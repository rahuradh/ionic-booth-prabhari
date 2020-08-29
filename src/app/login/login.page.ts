import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {} as User;
  passwordEyeIcon: string = "eye";
  passwordType: string = "password";
  constructor(private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController) { }

  ngOnInit() {
  }
  async login(user: User) {
    if (this.formValidation()) {
      let loader = this.loadingCtrl.create({
        message: "Please wait...."
      });
      (await loader).present();
      try {
        await this.afAuth.signInWithEmailAndPassword(user.phoneNo + "@gmail.com", user.password).then(data => {
          console.log(data)
          this.navCtrl.navigateRoot("dashboard/" + user.phoneNo);
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
