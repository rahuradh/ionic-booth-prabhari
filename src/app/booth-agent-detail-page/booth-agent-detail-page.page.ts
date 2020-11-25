import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { User } from '../models/user.model';

@Component({
  selector: 'app-booth-agent-detail-page',
  templateUrl: './booth-agent-detail-page.page.html',
  styleUrls: ['./booth-agent-detail-page.page.scss'],
})
export class BoothAgentDetailPagePage implements OnInit {

  boothCode: string;
  phoneNo: string;
  accessType: string;
  accessCode: string;
  callFrom: string;
  mode: string;
  boothAgentId: string;

  user = {} as User;

  passwordEyeIcon: string = "eye";
  passwordType: string = "password";

  readOnlyMode: boolean = true;
  blockUpdateBackCall: boolean = true;

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private actRouter: ActivatedRoute) {
    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.callFrom = this.actRouter.snapshot.paramMap.get("callFrom");
    this.mode = this.actRouter.snapshot.paramMap.get("mode");
    this.boothAgentId = this.actRouter.snapshot.paramMap.get("boothAgentId");
    this.accessCode = this.boothCode.substring(0, 6);
    if (this.mode == "add") {
      this.readOnlyMode = false;
    } else if (this.mode == "edit") {
      this.readOnlyMode = true;
      this.getUser();
    }
  }
  ngOnInit() {
  }

  goToBoothAgentsPage() {
    this.navCtrl.navigateRoot("booth-agents-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/" + this.callFrom);
  }

  formValidation() {
    if (!this.user.name) {
      this.showToaster("Enter Booth Agent's Name.");
      return false;
    }
    if (!this.user.phoneNo) {
      this.showToaster("Enter Booth Agent's Mobile Phone Number.");
      return false;
    } else {
      if (this.user.phoneNo.length < 10) {
        this.showToaster("Enter a valid Mobile Phone Number.");
        return false;
      }
    }
    if (!this.user.password) {
      this.showToaster("Enter a valid Password.");
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
      this.firestore.collection("usersList").doc(this.boothAgentId).get().subscribe(user => {
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
      if (this.mode == "add") {
        this.user.partyResponsibility = "Booth Agent";
        this.user.accessType = "Booth_Agent";
        this.user.accessCode = this.accessCode;
        this.user.isAdminApproved = true;
        await this.addBoothAgent(this.user);
      } else if (this.mode == "edit") {
        try {
          await this.firestore.doc("usersList/" + this.boothAgentId).update(this.user);
          this.readOnlyMode = true;
        } catch (err) {
          this.showToaster(err);
        }
      }
      loader.dismiss();
    }
  }

  deleteUser() {
    this.firestore.doc("usersList/" + this.boothAgentId).delete();
    this.navCtrl.navigateRoot("booth-agents-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/" + this.callFrom);
  }

  async addBoothAgent(user: User) {
    this.blockUpdateBackCall = true;
    if (this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Please wait...."
      });
      loader.present();
      try {
        this.firestore.collection("usersList", ref => ref.where('phoneNo', '==', user.phoneNo)).snapshotChanges().subscribe(data => {
          if (data.length == 0 && this.blockUpdateBackCall) {
            this.blockUpdateBackCall = false;
            this.firestore.collection("usersList").add(this.user);
            this.goToBoothAgentsPage();
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
}
