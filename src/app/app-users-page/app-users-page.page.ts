import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { User } from '../models/user.model';

@Component({
  selector: 'app-app-users-page',
  templateUrl: './app-users-page.page.html',
  styleUrls: ['./app-users-page.page.scss'],
})
export class AppUsersPagePage implements OnInit {
  phoneNo: string;
  accessType: string;
  accessCode: string;
  userList: any = [];

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private actRouter: ActivatedRoute,
    private callNumber: CallNumber) {
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.accessCode = this.actRouter.snapshot.paramMap.get("accessCode");
    this.loadUserList();
  }

  ngOnInit() {
  }

  goToAccessManager() {
    this.navCtrl.navigateRoot("access-manager/" + this.phoneNo);
  }

  openUserDetailPage(user) {
    this.navCtrl.navigateRoot("app-user-detail-page/" + this.phoneNo + "/" + this.accessType + "/" + this.accessCode + "/" + user.id);
  }

  async loadUserList() {
    this.userList = [];
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      var accessCodeValue = "";
      if (this.accessType != "Full") {
        accessCodeValue = this.accessCode;
      }
      this.firestore.collection("usersList", ref => ref.where('accessType', '==', this.accessType).where('accessCode', '==', accessCodeValue)).snapshotChanges().subscribe(data => {
        this.userList = data.map(user => {
          return {
            id: String(user.payload.doc.id),
            userName: String(user.payload.doc.data()['name']),
            partyResponsibility: String(user.payload.doc.data()['partyResponsibility']),
            phoneNumber: String(user.payload.doc.data()['phoneNo']),
            isAdminApproved: Boolean(user.payload.doc.data()['isAdminApproved'])
          }
        });
        this.userList = this.userList.sort((n1, n2) => {
          if (n1.isAdminApproved == false || n2.isAdminApproved == false) {
            return 1;
          }
          if (n1.isAdminApproved == true || n2.isAdminApproved == true) {
            return -1;
          }
          return 0;
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

  callUser(phoneNo: string) {
    this.callNumber.callNumber(phoneNo, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  async manageAccess(_id: string, isAdminApproved: boolean) {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    await this.firestore.doc(`usersList/${_id}`).update({ isAdminApproved: isAdminApproved });
    loader.dismiss();
  }

}
