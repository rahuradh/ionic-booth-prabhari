import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ToastController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from '../models/candidate.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.page.html',
  styleUrls: ['./candidate-detail.page.scss'],
})
export class CandidateDetailPage implements OnInit {

  boothCode: string;
  accessType: string;
  phoneNo: string;
  callFrom: string;
  electionBody: string;
  candidateId: string;
  candidatesCount: number = 0;

  candidate = {} as Candidate;
  readOnlyMode: boolean = true;
  toolbarTitle: string = "";

  customInterfaceOptions: any = {
    cssClass: 'my-custom-interface'
  };

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private actRouter: ActivatedRoute,
    private navCtrl: NavController) {

    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.callFrom = this.actRouter.snapshot.paramMap.get("callFrom");
    this.electionBody = this.actRouter.snapshot.paramMap.get("electionBody");
    this.candidateId = this.actRouter.snapshot.paramMap.get("candidateId");
    this.candidatesCount = Number(this.actRouter.snapshot.paramMap.get("candidatesCount"));

    if (this.electionBody == "panchayat") {
      this.toolbarTitle = "Panchayat Candidate Detail";
    } else if (this.electionBody == "blockPanchayat") {
      this.toolbarTitle = "Block Panchayat Candidate Detail";
    } else if (this.electionBody == "districtPanchayat") {
      this.toolbarTitle = "District Panchayat Candidate Detail";
    } else {
      this.toolbarTitle = "Candidates"
    }
    if (this.candidateId != "empty") {
      this.getCandidate();
    } else {
      this.readOnlyMode = false;
    }
  }

  ngOnInit() {
  }

  goToCandidatePage() {
    this.navCtrl.navigateRoot("candidate-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/" + this.callFrom + "/" + this.electionBody);
  }

  async getCandidate() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("candidateList").doc(this.candidateId).get().subscribe(candidate => {
        this.candidate = {
          boothCode: String(candidate.data()['boothCode']),
          candidateName: String(candidate.data()['candidateName']),
          candidateCode: String(candidate.data()['candidateCode']),
          candidateColor: String(candidate.data()['candidateColor']),
          electionBody: String(candidate.data()['electionBody']),
          partyCode: String(candidate.data()['partyCode'])
        }
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

  editCandidate() {
    this.readOnlyMode = false;
  }

  async upateCandidate() {
    if (this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Please wait...."
      });
      loader.present();
      try {
        if (this.candidateId != "empty") {
          await this.firestore.doc("candidateList/" + this.candidateId).update(this.candidate);
        } else {
          this.candidate.boothCode = this.boothCode;
          this.candidate.candidateCode = String(this.candidatesCount + 1);
          this.candidate.electionBody = this.electionBody;
          await this.firestore.collection("candidateList").add(this.candidate);
          this.navCtrl.navigateRoot("candidate-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/" + this.callFrom + "/" + this.electionBody);
        }
        this.readOnlyMode = true;
      } catch (err) {
        this.showToaster(err);
      }
      loader.dismiss();
    }
  }

  formValidation() {
    if (!this.candidate.candidateName) {
      this.showToaster("Enter Candidate Name.");
      return false;
    }
    if (!this.candidate.partyCode) {
      this.showToaster("Enter Candidate Party Code.");
      return false;
    }
    if (!this.candidate.candidateColor) {
      this.showToaster("Enter Candidate Color.");
      return false;
    }
    return true;
  }

}
