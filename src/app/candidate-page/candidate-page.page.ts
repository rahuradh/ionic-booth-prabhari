import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, NavController, Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-candidate-page',
  templateUrl: './candidate-page.page.html',
  styleUrls: ['./candidate-page.page.scss'],
})
export class CandidatePagePage implements OnInit {
  boothCode: string;
  accessType: string;
  phoneNo: string;
  callFrom: string;
  electionBody: string;
  toolbarTitle: string = "";
  candidateList: any;
  hasAccess: boolean = false;

  constructor(private actRouter: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController) {

    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.callFrom = this.actRouter.snapshot.paramMap.get("callFrom");
    this.electionBody = this.actRouter.snapshot.paramMap.get("electionBody");

    if (this.electionBody == "panchayat") {
      this.toolbarTitle = "Panchayat Candidates";
    } else if (this.electionBody == "blockPanchayat") {
      this.toolbarTitle = "Block Panchayat Candidates";
    } else if (this.electionBody == "districtPanchayat") {
      this.toolbarTitle = "District Panchayat Candidates";
    } else {
      this.toolbarTitle = "Candidates"
    }
    if (this.accessType == "Full" || this.accessType == "Booth") {
      this.hasAccess = true;
    }
    this.getCandidateList();
  }
  successCallback(result) {
    this.showToaster(result); // true - enabled, false - disabled
  }

  errorCallback(error) {
    this.showToaster(error);
  }

  ngOnInit() {
  }

  async getCandidateList() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      await this.firestore.collection("candidateList", ref => ref.where('boothCode', '==', this.boothCode).where('electionBody', '==', this.electionBody)).snapshotChanges().subscribe(data => {
        this.candidateList = data.map(candidate => {
          return {
            id: candidate.payload.doc.id,
            boothCode: String(candidate.payload.doc.data()['boothCode']),
            electionBody: String(candidate.payload.doc.data()['electionBody']),
            partyCode: String(candidate.payload.doc.data()['partyCode']),
            candidateName: String(candidate.payload.doc.data()['candidateName']),
            candidateCode: String(candidate.payload.doc.data()['candidateCode']),
            candidateColor: String(candidate.payload.doc.data()['candidateColor']),
          }
        });
        this.candidateList = this.candidateList.sort((n1, n2) => {
          if (Number(n1.candidateCode) > Number(n2.candidateCode)) {
            return 1;
          }
          if (Number(n1.candidateCode) < Number(n2.candidateCode)) {
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
  goToStatusPage() {
    this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/StatusPage" + "/status-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/StatusPage");
  }

  openCandidateDetailPage(candidate) {
    if (candidate.candidateName != "Unpredictable") {
      if (this.hasAccess) {
        this.navCtrl.navigateRoot("candidate-detail/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/" + this.callFrom + "/" + candidate.electionBody + "/" + candidate.id + "/" + 0);
      }
    }
  }

  deleteCandidateById(candidateId: string, candidateName: string) {
    if (candidateName == "Unpredictable") {
      this.showToaster("Unpredictable candidate is mandatory, can't delete.");
    } else {
      this.firestore.doc("candidateList/" + candidateId).delete();
    }
  }
  createNewCandidate() {
    this.navCtrl.navigateRoot("candidate-detail/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/" + this.callFrom + "/" + this.electionBody + "/" + "empty" + "/" + this.candidateList.length);
  }
}
