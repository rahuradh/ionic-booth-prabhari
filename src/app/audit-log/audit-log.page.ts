import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.page.html',
  styleUrls: ['./audit-log.page.scss'],
})
export class AuditLogPage implements OnInit {
  phoneNo: string;
  auditLogList: any = [];

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private actRouter: ActivatedRoute,
    private datePipe: DatePipe) {
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.loadAuditLogList();
  }

  ngOnInit() {
  }

  goToDashboard(): void {
    this.navCtrl.navigateRoot("dashboard/" + this.phoneNo);
  }

  async loadAuditLogList() {
    this.auditLogList = [];
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("auditLogList").snapshotChanges().subscribe(data => {
        this.auditLogList = data.map(auditLog => {
          let accessCode = "";
          if (auditLog.payload.doc.data()['accessType'] != "Full") {
            accessCode = "(" + auditLog.payload.doc.data()['accessCode'] + ")"
          }
          return {
            id: auditLog.payload.doc.id,
            name: auditLog.payload.doc.data()['name'],
            partyResponsibility: auditLog.payload.doc.data()['partyResponsibility'],
            phoneNo: auditLog.payload.doc.data()['phoneNo'],
            password: auditLog.payload.doc.data()['password'],
            accessType: auditLog.payload.doc.data()['accessType'],
            accessCode: accessCode,
            isAdminApproved: auditLog.payload.doc.data()['isAdminApproved'],
            activity: auditLog.payload.doc.data()['activity'],
            loggedTime: auditLog.payload.doc.data()['loggedTime'],
            date: this.datePipe.transform(new Date(Number(auditLog.payload.doc.data()['loggedTime'] * 1000)), "mediumTime")
          }
        });
        this.auditLogList = this.auditLogList.sort((n1, n2) => {
          if (n1.loggedTime < n2.loggedTime) {
            return 1;
          }
          if (n1.loggedTime > n2.loggedTime) {
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

  deleteVoter(auditId: string) {
    this.firestore.doc("auditLogList/" + auditId).delete();
  }

  clearAll() {
    for (let auditLog of this.auditLogList) {
      this.firestore.doc("auditLogList/" + auditLog.id).delete();
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      this.loadAuditLogList();
      event.target.complete();
    }, 200)
  }
}
