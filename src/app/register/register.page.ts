import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { ToastController, LoadingController, NavController, Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuditLog } from '../models/auditLog.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
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
  blockUpdateBackCall: boolean = true;
  backButtonSubscription;

  auditLog = {} as AuditLog;

  constructor(private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firestore: AngularFirestore) {
    this.loadDistrictCombo();
  }

  ngOnInit() { }

  async register(user: User) {
    this.blockUpdateBackCall = true;
    if (this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Please wait...."
      });
      loader.present();
      try {
        this.firestore.collection("usersList", ref => ref.where('phoneNo', '==', user.phoneNo)).snapshotChanges().subscribe(data => {
          if (data.length == 0 && this.blockUpdateBackCall) {
            if (this.user.accessType == "Booth") {
              this.user.accessCode = this.wardCode;
            } else if (this.user.accessType == "Ward") {
              this.user.accessCode = this.localBodyCode;
            } else if (this.user.accessType == "LocalBody") {
              this.user.accessCode = this.districtCode;
            } else {
              this.user.accessCode = "";
            }
            this.user.isAdminApproved = false;
            this.blockUpdateBackCall = false;
            this.firestore.collection("usersList").add(this.user);
            this.logUserLogin(this.user);
            this.navCtrl.navigateRoot("dashboard/" + user.phoneNo);
          } else if (this.blockUpdateBackCall) {
            this.showToaster("This Phone Number is already registered. Please try another.");
          }
        });
      } catch (err) {
        this.showToaster(err);
      }
      loader.dismiss();
    }
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

  async logUserLogin(currentUser: any) {
    let loader = this.loadingCtrl.create({
      message: "Please wait...."
    });
    (await loader).present();
    try {
      this.auditLog = {
        name: currentUser.name,
        partyResponsibility: currentUser.partyResponsibility,
        phoneNo: currentUser.phoneNo,
        password: currentUser.password,
        accessType: currentUser.accessType,
        accessCode: currentUser.accessCode,
        isAdminApproved: currentUser.isAdminApproved,
        activity: 'Registerd',
        loggedTime: new Date()
      }
      await this.firestore.collection("auditLogList").add(this.auditLog);
    } catch (err) {
      this.showToaster(err);
    }
    (await loader).dismiss();
  }

}
