import { Platform, LoadingController, ToastController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  hasAccess: boolean = false;
  stateCode: string = "32";
  districtCode: string;
  localBodyCode: string;
  wardCode: string;
  pollingStationCode: string;

  districtList; any;
  localBodyList: any;
  wardList: any;
  pollingStationList: any;

  phoneNo: string;
  isAdminApproved: boolean = false;
  accessType: string;
  accessCode: string;
  documentId: string;

  boothList: any = [];
  paymentDoneboothList: any = [];

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private actRouter: ActivatedRoute) {
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.checkAccess(this.phoneNo);
  }
  successCallback(result) {
    this.showToaster(result); // true - enabled, false - disabled
  }

  errorCallback(error) {
    this.showToaster(error);
  }

  ngOnInit() {
    this.loadDistrictCombo();
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

  async loadPollingStationCombo() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("pollingStationList", ref => ref.where('districtCode', '==', this.districtCode)
        .where('localBodyCode', '==', this.localBodyCode).where('wardCode', '==', this.wardCode)).snapshotChanges().subscribe(data => {
          this.pollingStationList = data.map(voter => {
            return {
              code: voter.payload.doc.data()['pollingStationCode'],
              name: voter.payload.doc.data()['pollingStationName'],
            }
          });
          this.pollingStationList = this.pollingStationList.sort((n1, n2) => {
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

  showToaster(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }

  districtComboOnChange(event) {
    this.localBodyList = [];
    this.wardList = [];
    this.pollingStationList = [];
    this.localBodyCode = "";
    this.wardCode = "";
    this.pollingStationCode = "";
    this.loadLocalBodyCombo();
  }

  localBodyComboOnChange(event) {
    this.wardList = [];
    this.pollingStationList = [];
    this.wardCode = "";
    this.pollingStationCode = "";
    this.loadWardCombo();
  }

  wardComboOnChange(event) {
    this.pollingStationList = [];
    this.pollingStationCode = "";
    this.loadPollingStationCombo();
  }

  formValidation() {
    if (!this.districtCode) {
      this.showToaster("Please enter your District.");
      return false;
    }
    if (!this.localBodyCode) {
      this.showToaster("Please enter your Local Body.");
      return false;
    }
    if (!this.wardCode) {
      this.showToaster("Please enter your Ward.");
      return false;
    }
    if (!this.pollingStationCode) {
      this.showToaster("Please enter your Polling Station.");
      return false;
    }
    return true;
  }

  goToHome() {
    if (this.formValidation()) {
      this.boothList = [];
      this.pollingStationList = [];
      this.paymentDoneboothList = [];
      this.validateAccess();
    }
  }

  async checkAccess(phoneNo: string) {
    this.isAdminApproved = false;
    this.accessType = "";
    this.accessCode = "";
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("usersList", ref => ref.where('phoneNo', '==', phoneNo)).snapshotChanges().subscribe(data => {
        data.map(user => {
          this.documentId = user.payload.doc.id;
          this.isAdminApproved = Boolean(user.payload.doc.data()['isAdminApproved']);
          this.accessType = String(user.payload.doc.data()['accessType']);
          this.accessCode = String(user.payload.doc.data()['accessCode']);
        });
        if (this.accessType == "Full" && this.isAdminApproved) {
          this.hasAccess = true;
        }
      });
    } catch (err) {
      this.showToaster(err);
    }
    loader.dismiss();
  }

  validateAccess(): void {
    if (this.isAdminApproved) {
      if (this.accessType == "Full") {
        this.navCtrl.navigateRoot("home/" + this.pollingStationCode + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage");
      } else if (this.accessType == "Booth") {
        this.validateBoothAccessAndPayment();
      } else if (this.accessType == "Ward") {
        this.validateWardAccessAndPayment();
      } else if (this.accessType == "LocalBody") {
        this.validateLocalBodyAccessAndPayment();
      } else {
        this.navCtrl.navigateRoot("access-page/" + false + "/" + false + "/" + this.phoneNo);
      }
    } else {
      this.navCtrl.navigateRoot("access-page/" + false + "/" + false + "/" + this.phoneNo);
    }
  }

  validateBoothAccessAndPayment() {
    try {
      this.firestore.collection("pollingStationList", ref => ref.where('wardCode', '==', this.accessCode)).snapshotChanges().subscribe(data => {
        this.validatePayment(data);
      });
    } catch (err) {
      this.showToaster(err);
    }
  }
  validateWardAccessAndPayment() {
    try {
      this.firestore.collection("pollingStationList", ref => ref.where('localBodyCode', '==', this.accessCode)).snapshotChanges().subscribe(data => {
        this.validatePayment(data);
      });
    } catch (err) {
      this.showToaster(err);
    }
  }
  validateLocalBodyAccessAndPayment() {
    try {
      this.firestore.collection("pollingStationList", ref => ref.where('districtCode', '==', this.accessCode)).snapshotChanges().subscribe(data => {
        this.validatePayment(data);
      });
    } catch (err) {
      this.showToaster(err);
    }
  }

  validatePayment(data) {
    this.boothList = data.map(pollingStation => {
      return {
        boothCode: String(pollingStation.payload.doc.data()['pollingStationCode']),
        paymentStatus: Boolean(pollingStation.payload.doc.data()['status'])
      }
    });
    this.boothList.forEach(booth => {
      this.pollingStationList.push(booth.boothCode);
    });
    if (this.pollingStationList.includes(this.pollingStationCode)) {
      this.paymentDoneboothList = this.boothList.filter(pollingStation => {
        if (pollingStation.boothCode == this.pollingStationCode && pollingStation.paymentStatus == true) {
          return true;
        }
        return false;
      });
      if (this.paymentDoneboothList.length != 0) {
        this.navCtrl.navigateRoot("home/" + this.pollingStationCode + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage");
      } else {
        this.navCtrl.navigateRoot("access-page/" + true + "/" + false + "/" + this.phoneNo);
      }
    } else {
      this.navCtrl.navigateRoot("access-page/" + false + "/" + false + "/" + this.phoneNo);
    }
  }
  goToAccessManager(): void {
    this.navCtrl.navigateRoot("access-manager/" + this.phoneNo);
  }
  goToPasswordChangnePage(): void {
    this.navCtrl.navigateRoot("change-password-page/" + this.phoneNo);
  }
  goToAuditLog(): void {
    this.navCtrl.navigateRoot("audit-log/" + this.phoneNo);
  }
}
