import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { User } from '../models/user.model';

@Component({
  selector: 'app-change-password-page',
  templateUrl: './change-password-page.page.html',
  styleUrls: ['./change-password-page.page.scss'],
})
export class ChangePasswordPagePage implements OnInit {
  user = {} as User;
  phoneNo: string;
  newPassword: string;
  passwordEyeIcon: string = "eye";
  passwordType: string = "password";
  userId: string;

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private actRouter: ActivatedRoute) {
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.getUser();
  }

  ngOnInit() {
  }

  goToDashboard() {
    this.navCtrl.navigateRoot("dashboard/" + this.phoneNo);
  }
  showHidePassword() {
    this.passwordEyeIcon = this.passwordEyeIcon == "eye" ? "eye-off" : "eye";
    this.passwordType = this.passwordType == "password" ? "text" : "password";
  }
  async getUser() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("usersList", ref => ref.where('phoneNo', '==', this.phoneNo)).snapshotChanges().subscribe(data => {
        data.map(user => {
          this.userId = String(user.payload.doc.id);
          this.user = {
            name: String(user.payload.doc.data()['name']),
            partyResponsibility: String(user.payload.doc.data()['partyResponsibility']),
            phoneNo: String(user.payload.doc.data()['phoneNo']),
            password: String(user.payload.doc.data()['password']),
            accessType: String(user.payload.doc.data()['accessType']),
            accessCode: String(user.payload.doc.data()['accessCode']),
            isAdminApproved: Boolean(user.payload.doc.data()['isAdminApproved'])
          }
        });
      });
    } catch (err) {
      this.showToaster(err);
    }
    loader.dismiss();
  }

  showToaster(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }

  async upatePassword() {
    if (this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Please wait...."
      });
      loader.present();
      await this.firestore.doc(`usersList/${this.userId}`).update({ password: this.newPassword });
      loader.dismiss();
      this.showToaster("Password has been changed.");
      this.navCtrl.navigateRoot("login");
    }
  }

  formValidation() {
    if (!this.newPassword) {
      this.showToaster("Enter your new Password.");
      return false;
    } else {
      if (this.newPassword.length < 6) {
        this.showToaster("Password must have mininum 6 characters.");
        return false;
      }
    }
    return true;
  }
}
