import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Voter } from '../models/voter.model';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.page.html',
  styleUrls: ['./detail-page.page.scss'],
})
export class DetailPagePage implements OnInit, AfterViewInit {
  voter = {} as Voter;
  boothCode: string;
  serialNo: string;
  accessType: string;
  phoneNo: string;
  callFrom: string;
  hasAccess: boolean = false;

  id: string;
  readOnlyMode: boolean = true;
  religionList: any;
  casteList: any;
  candidateList: any;
  panchayatCandidateList: any;
  blockPanchayatCandidateList: any;
  districtPanchayatCandidateList: any;
  voterNameColor: string = "dark";
  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private actRouter: ActivatedRoute,
    private navCtrl: NavController) {
    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.serialNo = this.actRouter.snapshot.paramMap.get("serialNo");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.callFrom = this.actRouter.snapshot.paramMap.get("callFrom");
    if (this.accessType == "Full" || this.accessType == "Booth") {
      this.hasAccess = true;
    }
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.loadReligionCombo();
    this.loadCandidateCombo();
    this.getVoter(this.serialNo);
  }

  async getVoter(serialNo) {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("votersList", ref => ref.where('boothCode', '==', this.boothCode).where('serialNo', '==', Number(serialNo))).snapshotChanges().subscribe(data => {
        data.map(voter => {
          this.id = voter.payload.doc.id;
          this.serialNo = String(voter.payload.doc.data()['serialNo'])
          this.voter = {
            boothCode: String(voter.payload.doc.data()['boothCode']),
            serialNo: Number(voter.payload.doc.data()['serialNo']),
            voterName: String(voter.payload.doc.data()['voterName']),
            guardianName: String(voter.payload.doc.data()['guardianName']),
            houseNo: String(voter.payload.doc.data()['houseNo']),
            address: String(voter.payload.doc.data()['address']),
            gender: String(voter.payload.doc.data()['gender']),
            age: Number(voter.payload.doc.data()['age']),
            idCardNo: String(voter.payload.doc.data()['idCardNo']),
            phoneNo: String(voter.payload.doc.data()['phoneNo']),
            religion: String(voter.payload.doc.data()['religion']),
            caste: String(voter.payload.doc.data()['caste']),
            outOfStation: Boolean(voter.payload.doc.data()['outOfStation']),
            dead: Boolean(voter.payload.doc.data()['dead']),
            panchayatVote: String(voter.payload.doc.data()['panchayatVote']),
            blockVote: String(voter.payload.doc.data()['blockVote']),
            districtVote: String(voter.payload.doc.data()['districtVote']),
            voted: Boolean(voter.payload.doc.data()['voted'])
          }
        });
        if (this.voter.voted) {
          this.voterNameColor = "primary";
        } else {
          this.voterNameColor = "dark";
        }
        this.loadCasteCombo(this.voter.religion);
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

  goToNext() {
    this.getVoter(String(Number(this.serialNo) + 1));
  }
  goToPrevious() {
    this.getVoter(String(Number(this.serialNo) - 1));
  }
  goToCallerPage() {
    if (this.callFrom == "SearchPage") {
      this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage" + "/search-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage");
    } else if (this.callFrom == "StatusPage") {
      this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/StatusPage" + "/status-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/StatusPage");
    } else if (this.callFrom == "FilterPage") {
      this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/FilterPage" + "/filter-voter/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/FilterPage");
    } else {
      this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage" + "/search-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage");
    }
  }
  editVoter() {
    this.readOnlyMode = false;
  }

  async upateVoter() {
    if (this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Please wait...."
      });
      loader.present();
      try {
        await this.firestore.doc("votersList/" + this.id).update(this.voter);
        this.readOnlyMode = true;
      } catch (err) {
        this.showToaster(err);
      }
      loader.dismiss();
    }
  }

  formValidation() {
    if (!this.voter.voterName) {
      this.showToaster("Enter Voter Name.");
      return false;
    }
    if (!this.voter.guardianName) {
      this.showToaster("Enter Voter Guardian Name.");
      return false;
    }
    if (!this.voter.houseNo) {
      this.showToaster("Enter Voter House Number.");
      return false;
    }
    if (!this.voter.address) {
      this.showToaster("Enter Voter Address.");
      return false;
    }
    if (!this.voter.gender) {
      this.showToaster("Enter Voter Gender.");
      return false;
    }
    if (!this.voter.age) {
      this.showToaster("Enter Voter Age.");
      return false;
    }
    if (!this.voter.idCardNo) {
      this.showToaster("Enter Voter Id Card Number.");
      return false;
    }
    return true;
  }
  async loadCandidateCombo() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("candidateList", ref => ref.where('boothCode', '==', this.boothCode)).snapshotChanges().subscribe(data => {
        this.candidateList = data.map(candidate => {
          let partyCode: string = String(candidate.payload.doc.data()['partyCode']) + '\xa0';
          return {
            code: candidate.payload.doc.data()['candidateCode'],
            name: partyCode + String(candidate.payload.doc.data()['candidateName']),
            electionBody: String(candidate.payload.doc.data()['electionBody'])
          }
        });
        this.candidateList = this.candidateList.sort((n1, n2) => {
          if (Number(n1.code) > Number(n2.code)) {
            return 1;
          }
          if (Number(n1.code) < Number(n2.code)) {
            return -1;
          }
          return 0;
        });
        this.panchayatCandidateList = this.candidateList.filter(candidate => {
          if (candidate.electionBody == "panchayat") {
            return true;
          }
        });
        this.blockPanchayatCandidateList = this.candidateList.filter(candidate => {
          if (candidate.electionBody == "blockPanchayat") {
            return true;
          }
        });
        this.districtPanchayatCandidateList = this.candidateList.filter(candidate => {
          if (candidate.electionBody == "districtPanchayat") {
            return true;
          }
        });
      });
    } catch (err) {
      this.showToaster(err);
    }
    loader.dismiss();
  }

  async loadReligionCombo() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("religionList", ref => ref.orderBy("religionCode")).snapshotChanges().subscribe(data => {
        this.religionList = data.map(voter => {
          return {
            code: voter.payload.doc.data()['religionCode'],
            name: voter.payload.doc.data()['religionName'],
          }
        });
      });
    } catch (err) {
      this.showToaster(err);
    }
    loader.dismiss();
  }

  async loadCasteCombo(religionCode: string) {
    if (!religionCode) {
      return;
    }
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("casteList", ref => ref.where('religionCode', '==', religionCode)).snapshotChanges().subscribe(data => {
        this.casteList = data.map(voter => {
          return {
            code: voter.payload.doc.data()['casteCode'],
            name: voter.payload.doc.data()['casteName'],
          }
        });
        this.casteList = this.casteList.sort((n1, n2) => {
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

  religionComboOnChange(event) {
    this.loadCasteCombo(this.voter.religion);
  }

  onDeadToggleChange(isDead: boolean) {
    if (isDead) {
      this.voter.outOfStation = false;
    }

  }
}
