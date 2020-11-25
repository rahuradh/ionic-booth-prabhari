import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LoadingController, ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-booth-agents-page',
  templateUrl: './booth-agents-page.page.html',
  styleUrls: ['./booth-agents-page.page.scss'],
})
export class BoothAgentsPagePage implements OnInit {

  boothCode: string;
  accessType: string;
  accessCode: string;
  phoneNo: string;
  callFrom: string;
  userList: any = [];

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private actRouter: ActivatedRoute,
    private callNumber: CallNumber) {
    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.callFrom = this.actRouter.snapshot.paramMap.get("callFrom");
    this.accessCode = this.boothCode.substring(0, 6);

    this.loadBoothAgentList();
  }

  ngOnInit() {
  }

  goToStatusPage() {
    this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/StatusPage" + "/status-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/StatusPage");
  }

  openBoothAgentDetailPage(user) {
    this.navCtrl.navigateRoot("booth-agent-detail-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/StatusPage" + "/edit" + "/" + user.id);
  }

  addBoothAgent() {
    this.navCtrl.navigateRoot("booth-agent-detail-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/StatusPage" + "/add" + "/" + "boothAgentId");
  }

  async loadBoothAgentList() {
    this.userList = [];
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("usersList", ref => ref.where('accessType', '==', 'Booth_Agent').where('accessCode', '==', this.accessCode)).snapshotChanges().subscribe(data => {
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
