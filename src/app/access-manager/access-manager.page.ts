import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-access-manager',
  templateUrl: './access-manager.page.html',
  styleUrls: ['./access-manager.page.scss'],
})
export class AccessManagerPage implements OnInit {
  phoneNo: string;
  stateCode: string = "32";
  districtCode: string;
  localBodyCode: string;
  wardCode: string;
  accessType: string;
  accessCode: string = "";

  districtList; any;
  localBodyList: any;
  wardList: any;

  hasBoothAccess: boolean = false;
  hasWardAccess: boolean = false;
  hasLocalBodyAccess: boolean = false;

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private actRouter: ActivatedRoute) {
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.loadDistrictCombo();
  }
  successCallback(result) {
    this.showToaster(result); // true - enabled, false - disabled
  }

  errorCallback(error) {
    this.showToaster(error);
  }
  ngOnInit() {
  }

  goToDashboard(): void {
    this.navCtrl.navigateRoot("dashboard/" + this.phoneNo);
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
    if (this.accessType == "Booth") {
      this.hasBoothAccess = true;
      this.hasWardAccess = false;
      this.hasLocalBodyAccess = false;
    } else if (this.accessType == "Ward") {
      this.hasBoothAccess = false;
      this.hasWardAccess = true;
      this.hasLocalBodyAccess = false;
    } else if (this.accessType == "LocalBody") {
      this.hasBoothAccess = false;
      this.hasWardAccess = false;
      this.hasLocalBodyAccess = true;
    } else {
      this.hasBoothAccess = false;
      this.hasWardAccess = false;
      this.hasLocalBodyAccess = false;
    }
  }

  goToAppUser(): void {
    if (this.formValidation()) {
      if (this.accessType == "Booth") {
        this.accessCode = this.wardCode;
      } else if (this.accessType == "Ward") {
        this.accessCode = this.localBodyCode;
      } else if (this.accessType == "LocalBody") {
        this.accessCode = this.districtCode;
      } else {
        this.accessCode = "Full";
      }
      this.navCtrl.navigateRoot("app-users-page/" + this.phoneNo + "/" + this.accessType + "/" + this.accessCode);
    }
  }

  formValidation() {
    if (!this.accessType) {
      this.showToaster("Enter access type.");
      return false;
    } else {
      if (this.accessType == "LocalBody") {
        if (!this.districtCode) {
          this.showToaster("Enter your District.");
          return false;
        }
      } else if (this.accessType == "Ward") {
        if (!this.districtCode) {
          this.showToaster("Enter your District.");
          return false;
        }
        if (!this.localBodyCode) {
          this.showToaster("Enter your Local Body.");
          return false;
        }
      } else if (this.accessType == "Booth") {
        if (!this.districtCode) {
          this.showToaster("Enter your District.");
          return false;
        }
        if (!this.localBodyCode) {
          this.showToaster("Enter your Local Body.");
          return false;
        }
        if (!this.wardCode) {
          this.showToaster("Enter your Ward.");
          return false;
        }
      }
    }
    return true;
  }

}
