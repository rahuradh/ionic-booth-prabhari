import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { User } from '../models/user.model';

@Component({
  selector: 'app-app-user-detail-page',
  templateUrl: './app-user-detail-page.page.html',
  styleUrls: ['./app-user-detail-page.page.scss'],
})
export class AppUserDetailPagePage implements OnInit {
  phoneNo: string;
  accessType: string;
  accessCode: string;
  userId: string;

  user = {} as User;

  stateCode: string = "32";
  districtCode: string;
  localBodyCode: string;
  wardCode: string;

  districtList; any;
  localBodyList: any;
  wardList: any;

  hasBoothAccess: boolean = false;
  hasWardAccess: boolean = false;
  hasLocalBodyAccess: boolean = false;

  passwordEyeIcon: string = "eye";
  passwordType: string = "password";

  readOnlyMode: boolean = true;

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private actRouter: ActivatedRoute) {
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.accessCode = this.actRouter.snapshot.paramMap.get("accessCode");
    this.userId = this.actRouter.snapshot.paramMap.get("userId");
    this.loadDistrictCombo();
    this.getUser();
  }
  successCallback(result) {
    this.showToaster(result); // true - enabled, false - disabled
  }

  errorCallback(error) {
    this.showToaster(error);
  }


  ngOnInit() {
  }

  goToAppUsersPage() {
    this.navCtrl.navigateRoot("app-users-page/" + this.phoneNo + "/" + this.accessType + "/" + this.accessCode);
  }

  formValidation() {
    if (!this.user.name) {
      this.showToaster("Enter your Name.");
      return false;
    }
    if (!this.user.partyResponsibility) {
      this.showToaster("Enter your Party Responsibility.");
      return false;
    }
    if (!this.user.accessType) {
      this.showToaster("Enter type of your access.");
      return false;
    } else {
      if (this.user.accessType == "LocalBody") {
        if (!this.districtCode) {
          this.showToaster("Enter your District that you want access.");
          return false;
        }
      } else if (this.user.accessType == "Ward") {
        if (!this.districtCode) {
          this.showToaster("Enter your District that you want access.");
          return false;
        }
        if (!this.localBodyCode) {
          this.showToaster("Enter your Local Body that you want access.");
          return false;
        }
      } else if (this.user.accessType == "Booth") {
        if (!this.districtCode) {
          this.showToaster("Enter your District that you want access.");
          return false;
        }
        if (!this.localBodyCode) {
          this.showToaster("Enter your Local Body that you want access.");
          return false;
        }
        if (!this.wardCode) {
          this.showToaster("Enter your Ward that you want access.");
          return false;
        }
      }
    }
    if (!this.user.phoneNo) {
      this.showToaster("Enter your Mobile Phone Number.");
      return false;
    } else {
      if (this.user.phoneNo.length < 10) {
        this.showToaster("Enter a valid Mobile Phone Number.");
        return false;
      }
    }
    if (!this.user.password) {
      this.showToaster("Enter your Password.");
      return false;
    } else {
      if (this.user.password.length < 6) {
        this.showToaster("Password must have mininum 6 characters.");
        return false;
      }
    }
    return true;
  }
  showToaster(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }

  async loadDistrictCombo() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("districtList", ref => ref.where('stateCode', '==', this.stateCode)
      ).snapshotChanges().subscribe(data => {
        this.districtList = data.map(voter => {
          return {
            code: voter.payload.doc.data()['districtCode'],
            name: voter.payload.doc.data()['districtName'],
          }
        });
        this.districtList = this.districtList.sort((n1, n2) => {
          if (Number(n1.code) > Number(n2.code)) {
            return 1;
          }
          if (Number(n1.code) < Number(n2.code)) {
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

  async loadLocalBodyCombo() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("localBodyList", ref => ref.where('districtCode', '==', this.districtCode)
      ).snapshotChanges().subscribe(data => {
        this.localBodyList = data.map(voter => {
          return {
            code: voter.payload.doc.data()['localBodyCode'],
            name: voter.payload.doc.data()['localBodyName'],
          }
        });
        this.localBodyList = this.localBodyList.sort((n1, n2) => {
          if (Number(n1.code) > Number(n2.code)) {
            return 1;
          }
          if (Number(n1.code) < Number(n2.code)) {
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

  async loadWardCombo() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("wardList", ref => ref.where('districtCode', '==', this.districtCode)
        .where('localBodyCode', '==', this.localBodyCode)
      ).snapshotChanges().subscribe(data => {
        this.wardList = data.map(voter => {
          return {
            code: voter.payload.doc.data()['wardCode'],
            name: voter.payload.doc.data()['wardName'],
          }
        });
        this.wardList = this.wardList.sort((n1, n2) => {
          if (Number(n1.code) > Number(n2.code)) {
            return 1;
          }
          if (Number(n1.code) < Number(n2.code)) {
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

  districtComboOnChange(event) {
    this.localBodyList = [];
    this.wardList = [];
    this.localBodyCode = "";
    this.wardCode = "";
    this.loadLocalBodyCombo();
  }

  localBodyComboOnChange(event) {
    this.wardList = [];
    this.wardCode = "";
    this.loadWardCombo();
  }
  accessTypeComboOnChange(event) {
    if (this.user.accessType == "Booth") {
      this.hasBoothAccess = true;
      this.hasWardAccess = false;
      this.hasLocalBodyAccess = false;
    } else if (this.user.accessType == "Ward") {
      this.hasBoothAccess = false;
      this.hasWardAccess = true;
      this.hasLocalBodyAccess = false;
    } else if (this.user.accessType == "LocalBody") {
      this.hasBoothAccess = false;
      this.hasWardAccess = false;
      this.hasLocalBodyAccess = true;
    } else {
      this.hasBoothAccess = false;
      this.hasWardAccess = false;
      this.hasLocalBodyAccess = false;
    }
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
      this.firestore.collection("usersList").doc(this.userId).get().subscribe(user => {
        this.user = {
          name: String(user.data()['name']),
          partyResponsibility: String(user.data()['partyResponsibility']),
          phoneNo: String(user.data()['phoneNo']),
          password: String(user.data()['password']),
          accessType: String(user.data()['accessType']),
          accessCode: String(user.data()['accessCode']),
          isAdminApproved: Boolean(user.data()['isAdminApproved'])
        }
      });
    } catch (err) {
      this.showToaster(err);
    }
    loader.dismiss();
  }

  editUser(): void {
    this.readOnlyMode = false;
  }
  async upateUser() {
    if (this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Please wait...."
      });
      loader.present();
      if (this.user.accessType == "Booth") {
        this.user.accessCode = this.wardCode;
      } else if (this.user.accessType == "Ward") {
        this.user.accessCode = this.localBodyCode;
      } else if (this.user.accessType == "LocalBody") {
        this.user.accessCode = this.districtCode;
      } else {
        this.user.accessCode = "";
      }
      try {
        await this.firestore.doc("usersList/" + this.userId).update(this.user);
        this.readOnlyMode = true;
      } catch (err) {
        this.showToaster(err);
      }
      loader.dismiss();
    }
  }

  deleteUser() {
    this.firestore.doc("usersList/" + this.userId).delete();
    this.navCtrl.navigateRoot("app-users-page/" + this.phoneNo + "/" + this.accessType + "/" + this.accessCode);
  }

}
