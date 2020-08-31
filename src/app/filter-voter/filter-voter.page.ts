import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-filter-voter',
  templateUrl: './filter-voter.page.html',
  styleUrls: ['./filter-voter.page.scss'],
})
export class FilterVoterPage implements OnInit {
  selectedValues: string[] = [];
  religionList: any;
  casteList: any;
  recordCount: number = 0;


  showSearchButton: boolean = false;
  showReligionCombo: boolean = false;
  showCasteCombo: boolean = false;
  showGenderCombo: boolean = false;
  showElectionBodyCombo: boolean = false;
  showCandidateCombo: boolean = false;
  showIsDeadField: boolean = false;
  showIsVotedField: boolean = false;
  showIsOOSField: boolean = false;
  showRecordCount: boolean = false;
  showAgeRangeField: boolean = false;

  religionCode: string;
  casteCode: string;
  genderCode: string;
  electionBodyCode: string = "panchayat";
  candidateCode: string;
  isDead: boolean = true;
  isVoted: boolean = true;
  isOOS: boolean = true;
  ageRange: any = {
    upper: 100,
    lower: 18
  }

  boothCode: string;
  accessType: string;
  phoneNo: string;
  callFrom: string;
  votersList: any[];
  candidateList: any[];
  public lazyLoadingVotersList: any[] = [];
  public recordCounter: number = 0;

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private actRouter: ActivatedRoute,
    private navCtrl: NavController,
    private callNumber: CallNumber) {

    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.callFrom = this.actRouter.snapshot.paramMap.get("callFrom");
  }

  ngOnInit() {
    this.loadReligionCombo();
  }

  async loadReligionCombo() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("religionList", ref => ref.orderBy("religionCode")).snapshotChanges().subscribe(data => {
        this.religionList = data.map(religion => {
          return {
            code: religion.payload.doc.data()['religionCode'],
            name: religion.payload.doc.data()['religionName'],
          }
        });
      });
    } catch (err) {
      this.showToaster(err);
    }
    loader.dismiss();
  }


  async loadCasteCombo(religionCode: string) {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("casteList", ref => ref.where('religionCode', '==', religionCode)).snapshotChanges().subscribe(data => {
        this.casteList = data.map(caste => {
          return {
            code: caste.payload.doc.data()['casteCode'],
            name: caste.payload.doc.data()['casteName'],
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
    this.loadCasteCombo(this.religionCode);
  }

  showToaster(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }

  searchComboOnChange(event) {
    this.showSearchButton = false;
    this.showReligionCombo = false;
    this.showCasteCombo = false;
    this.showGenderCombo = false;
    this.showElectionBodyCombo = false;
    this.showCandidateCombo = false;
    this.showIsDeadField = false;
    this.showIsVotedField = false;
    this.showIsOOSField = false;
    this.showRecordCount = false;
    this.showAgeRangeField = false;

    this.votersList = null;
    this.lazyLoadingVotersList = null;
    this.recordCount = 0;
    this.selectedValues.forEach(searchCondition => {
      if (searchCondition == "religion") {
        this.showReligionCombo = true;
        this.showSearchButton = true;
      }
      if (searchCondition == "caste") {
        this.showReligionCombo = true;
        this.showCasteCombo = true;
        this.showSearchButton = true;
      }
      if (searchCondition == "gender") {
        this.showGenderCombo = true;
        this.showSearchButton = true;
      }
      if (searchCondition == "candidate") {
        this.showElectionBodyCombo = true;
        this.showCandidateCombo = true;
        this.loadCandidateCombo();
        this.showSearchButton = true;
      }
      if (searchCondition == "isDead") {
        this.showIsDeadField = true;
        this.showSearchButton = true;
      }
      if (searchCondition == "isVoted") {
        this.showIsVotedField = true;
        this.showSearchButton = true;
      }
      if (searchCondition == "isOut") {
        this.showIsOOSField = true;
        this.showSearchButton = true;
      }
      if (searchCondition == "ageRange") {
        this.showAgeRangeField = true;
        this.showSearchButton = true;
      }
    });
  }

  search() {
    if (this.formValidation()) {
      this.getVotersBasedOnSearchCondition();
    }
  }

  async getVotersBasedOnSearchCondition() {
    this.showRecordCount = true;
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("votersList", ref => ref.where('boothCode', '==', this.boothCode)).snapshotChanges().subscribe(data => {
        this.generateVotersList(data);
      });
    } catch (err) {
      this.showToaster(err);
    }
    loader.dismiss();
  }

  addFilter() {
    if (this.selectedValues.includes("religion")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.religion.toLowerCase() == this.religionCode.toLowerCase()) {
          return true;
        }
      });
    }
    if (this.selectedValues.includes("caste")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.religion.toLowerCase() == this.religionCode.toLowerCase() &&
          currentVoter.caste.toLowerCase() == this.casteCode.toLowerCase()) {
          return true;
        }
      });
    }
    if (this.selectedValues.includes("gender")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.genderDB.toLowerCase() == this.genderCode.toLowerCase()) {
          return true;
        }
      });
    }
    if (this.selectedValues.includes("candidate")) {
      if (this.electionBodyCode == "panchayat") {
        this.votersList = this.votersList.filter(currentVoter => {
          if (currentVoter.panchayatVote == this.candidateCode) {
            return true;
          }
        });
      }
      if (this.electionBodyCode == "blockPanchayat") {
        this.votersList = this.votersList.filter(currentVoter => {
          if (currentVoter.blockPanchayatVote == this.candidateCode) {
            return true;
          }
        });
      }
      if (this.electionBodyCode == "districtPanchayat") {
        this.votersList = this.votersList.filter(currentVoter => {
          if (currentVoter.districtPanchayatVote == this.candidateCode) {
            return true;
          }
        });
      }
    }
    if (this.selectedValues.includes("isDead")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.isDead == this.isDead) {
          return true;
        }
      });
    }
    if (this.selectedValues.includes("isVoted")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.isVoted == this.isVoted) {
          return true;
        }
      });
    }
    if (this.selectedValues.includes("isOut")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.isOutOfStation == this.isOOS) {
          return true;
        }
      });
    }
    if (this.selectedValues.includes("ageRange")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.age >= this.ageRange.lower && currentVoter.age <= this.ageRange.upper) {
          return true;
        }
      });
    }
    this.votersList = this.votersList.sort((n1, n2) => {
      if (n1.serialNo > n2.serialNo) {
        return 1;
      }
      if (n1.serialNo < n2.serialNo) {
        return -1;
      }
      return 0;
    });
    this.recordCount = this.votersList != null ? this.votersList.length : 0;
    this.addFilterdVotersToList();
  }


  openDetailPage(voter) {
    this.navCtrl.navigateRoot("detail-page/" + this.boothCode + "/" + voter.serialNo + "/" + this.accessType + "/" + this.phoneNo + "/FilterPage");
  }

  generateVotersList(data) {
    this.votersList = data.map(voter => {
      let gender = voter.payload.doc.data()['gender'] == "Male" ? "././assets/icon/male-gravatar.jpg" : "././assets/icon/female-gravatar.jpg";
      return {
        id: voter.payload.doc.id,
        serialNo: voter.payload.doc.data()['serialNo'],
        voterName: voter.payload.doc.data()['voterName'],
        address: voter.payload.doc.data()['address'],
        houseNo: voter.payload.doc.data()['houseNo'],
        gender: gender,
        age: voter.payload.doc.data()['age'],
        voterId: voter.payload.doc.data()['idCardNo'],
        isVoted: Boolean(voter.payload.doc.data()['voted']),
        isOutOfStation: Boolean(voter.payload.doc.data()['outOfStation']),
        isDead: Boolean(voter.payload.doc.data()['dead']),
        religion: voter.payload.doc.data()['religion'],
        caste: voter.payload.doc.data()['caste'],
        genderDB: voter.payload.doc.data()['gender'],
        panchayatVote: Number(voter.payload.doc.data()['panchayatVote']),
        blockPanchayatVote: Number(voter.payload.doc.data()['blockVote']),
        districtPanchayatVote: Number(voter.payload.doc.data()['districtVote']),
        phoneNo: voter.payload.doc.data()['phoneNo'],
        isPhoneNoExist: voter.payload.doc.data()['phoneNo'] == "" ? true : false
      }
    });
    this.addFilter();
  }
  electionBodyComboOnChange(event) {
    this.loadCandidateCombo();
  }
  async loadCandidateCombo() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("candidateList", ref => ref.where('boothCode', '==', this.boothCode).where('electionBody', '==', this.electionBodyCode)).snapshotChanges().subscribe(data => {
        this.candidateList = data.map(candidate => {
          let partyCode: string = String(candidate.payload.doc.data()['partyCode']) + '\xa0';
          return {
            code: candidate.payload.doc.data()['candidateCode'],
            name: partyCode + String(candidate.payload.doc.data()['candidateName']),
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
      });
    } catch (err) {
      this.showToaster(err);
    }
    loader.dismiss();
  }

  loadData(event) {
    setTimeout(() => {
      this.addVotersToList();
      event.target.complete();
    }, 500);
  }

  addFilterdVotersToList() {
    this.lazyLoadingVotersList = [];
    this.recordCounter = 0;
    this.addVotersToList();
  }

  addVotersToList() {
    if (this.votersList != null) {
      for (let i = 0; i < 10 && this.recordCounter < this.votersList.length; i++, this.recordCounter++) {
        this.lazyLoadingVotersList.push(this.votersList[this.recordCounter])
      }
    }
  }

  formValidation() {
    if (this.selectedValues.includes('religion') && !this.religionCode) {
      this.showToaster("Please enter Religion.");
      return false;
    }
    if (this.selectedValues.includes("caste") && !this.casteCode) {
      if (!this.religionCode) {
        this.showToaster("Please enter Religion.");
        return false;
      }
      this.showToaster("Please enter Caste.");
      return false;
    }
    if (this.selectedValues.includes("gender") && !this.genderCode) {
      this.showToaster("Please enter Gender.");
      return false;
    }
    if (this.selectedValues.includes("candidate") && !this.candidateCode) {
      if (!this.electionBodyCode) {
        this.showToaster("Please enter Election Body.");
        return false;
      }
      this.showToaster("Please enter Candidate.");
      return false;
    }
    return true;
  }

  callVoter(phoneNo: string) {
    this.callNumber.callNumber(phoneNo, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  goToDashboard() {
    this.navCtrl.navigateRoot("dashboard/" + this.phoneNo);
  }
}