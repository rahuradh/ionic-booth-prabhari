import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController, NavController, Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { CallNumber } from '@ionic-native/call-number/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatePipe, TitleCasePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-filter-voter',
  templateUrl: './filter-voter.page.html',
  styleUrls: ['./filter-voter.page.scss'],
})
export class FilterVoterPage implements OnInit {
  selectedValues: string[] = [];
  religionList: any[];
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
  showIsOOWField: boolean = false;
  showRecordCount: boolean = false;
  showAgeRangeField: boolean = false;
  showPhoneNoField: boolean = false;

  religionObject;
  casteObject;
  genderCode: string;
  electionBodyCode: string = "panchayat";
  candidateObject;
  isDead: boolean = true;
  isVoted: boolean = true;
  isOOS: boolean = true;
  isOOW: boolean = true;
  ageRange: any = {
    upper: 100,
    lower: 18
  }
  phoneNumber: number;

  boothCode: string;
  accessType: string;
  phoneNo: string;
  callFrom: string;
  votersList: any[];
  candidateList: any[];
  public lazyLoadingVotersList: any[] = [];
  public recordCounter: number = 0;


  pdfObj = null;
  filterDetailsObject: any[] = [];
  boothDetails: any = {};
  hasAccess: boolean = false;
  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private actRouter: ActivatedRoute,
    private navCtrl: NavController,
    private callNumber: CallNumber,
    private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private datePipe: DatePipe,
    private titleCasePipe: TitleCasePipe) {

    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.callFrom = this.actRouter.snapshot.paramMap.get("callFrom");
    if (this.accessType == "Full" || this.accessType == "Booth") {
      this.hasAccess = true;
    }
    this.getBoothDetails();
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
        this.religionList.push({
          code: '8080',
          name: '[Empty Check]',
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
        this.casteList.push({
          code: '8080',
          name: '[Empty Check]',
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
    this.clearVotersList();
    this.casteList = [];
    this.casteObject = null;
    this.loadCasteCombo(this.religionObject.code);
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
    this.showIsOOWField = false;
    this.showRecordCount = false;
    this.showAgeRangeField = false;
    this.showPhoneNoField = false;

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
      if (searchCondition == "isOutOfWard") {
        this.showIsOOWField = true;
        this.showSearchButton = true;
      }
      if (searchCondition == "ageRange") {
        this.showAgeRangeField = true;
        this.showSearchButton = true;
      }
      if (searchCondition == "phoneNo") {
        this.showPhoneNoField = true;
        this.showSearchButton = true;
      }
    });
  }

  search() {
    if (this.formValidation()) {
      this.filterDetailsObject = [];
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
      const religionCodeValue = this.religionObject.code == '8080' ? '' : this.religionObject.code;
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.religion.toLowerCase() == religionCodeValue.toLowerCase()) {
          return true;
        }
      });
      this.filterDetailsObject.push({
        text: [
          { text: 'Religion : ', style: 'subHeader', alignment: 'left' },
          { text: this.religionObject.name, style: 'textValue', alignment: 'left' }
        ]
      });
      this.filterDetailsObject.push("\t\t");
    }
    if (this.selectedValues.includes("caste")) {
      const religionCodeValue = this.religionObject.code == '8080' ? '' : this.religionObject.code;
      const casteCodeValue = this.casteObject.code == '8080' ? '' : this.casteObject.code;
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.religion.toLowerCase() == religionCodeValue.toLowerCase() &&
          currentVoter.caste.toLowerCase() == casteCodeValue.toLowerCase()) {
          return true;
        }
      });
      if (!this.selectedValues.includes("religion")) {
        this.filterDetailsObject.push({
          text: [
            { text: 'Religion : ', style: 'subHeader', alignment: 'left' },
            { text: this.religionObject.name, style: 'textValue', alignment: 'left' }
          ]
        });
        this.filterDetailsObject.push("\t\t");
      }
      this.filterDetailsObject.push({
        text: [
          { text: 'Caste : ', style: 'subHeader', alignment: 'left' },
          { text: this.casteObject.name, style: 'textValue', alignment: 'left' }
        ]
      });
      this.filterDetailsObject.push("\t\t");
    }
    if (this.selectedValues.includes("gender")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.genderDB.toLowerCase() == this.genderCode.toLowerCase()) {
          return true;
        }
      });
      this.filterDetailsObject.push({
        text: [
          { text: 'Gender : ', style: 'subHeader', alignment: 'left' },
          { text: this.genderCode, style: 'textValue', alignment: 'left' }
        ]
      });
      this.filterDetailsObject.push("\t\t");
    }
    if (this.selectedValues.includes("candidate")) {
      const candidateCodeValue = this.candidateObject.code == '8080' ? '' : this.candidateObject.code;
      if (this.electionBodyCode == "panchayat") {
        this.votersList = this.votersList.filter(currentVoter => {
          if (currentVoter.panchayatVote == candidateCodeValue) {
            return true;
          }
        });
        this.filterDetailsObject.push("\n");
        this.filterDetailsObject.push({
          text: [
            { text: 'Panchayat Candidate : ', style: 'subHeader', alignment: 'left' },
            { text: this.candidateObject.name, style: 'textValue', alignment: 'left' }
          ]
        });
        this.filterDetailsObject.push("\n");
      }
      if (this.electionBodyCode == "blockPanchayat") {
        this.votersList = this.votersList.filter(currentVoter => {
          if (currentVoter.blockPanchayatVote == candidateCodeValue) {
            return true;
          }
        });
        this.filterDetailsObject.push("\n");
        this.filterDetailsObject.push({
          text: [
            { text: 'Block Panchayat Candidate : ', style: 'subHeader', alignment: 'left' },
            { text: this.candidateObject.name, style: 'textValue', alignment: 'left' }
          ]
        });
        this.filterDetailsObject.push("\n");
      }
      if (this.electionBodyCode == "districtPanchayat") {
        this.votersList = this.votersList.filter(currentVoter => {
          if (currentVoter.districtPanchayatVote == candidateCodeValue) {
            return true;
          }
        });
        this.filterDetailsObject.push("\n");
        this.filterDetailsObject.push({
          text: [
            { text: 'District Panchayat Candidate : ', style: 'subHeader', alignment: 'left' },
            { text: this.candidateObject.name, style: 'textValue', alignment: 'left' }
          ]
        });
        this.filterDetailsObject.push("\n");
      }
    }
    if (this.selectedValues.includes("isDead")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.isDead == this.isDead) {
          return true;
        }
      });
      this.filterDetailsObject.push({
        text: [
          { text: 'Dead : ', style: 'subHeader', alignment: 'left' },
          { text: this.isDead ? "YES" : "NO", style: 'textValue', alignment: 'left' }
        ]
      });
      this.filterDetailsObject.push("\t\t");
    }
    if (this.selectedValues.includes("isVoted")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.isVoted == this.isVoted) {
          return true;
        }
      });
      this.filterDetailsObject.push({
        text: [
          { text: 'Voted : ', style: 'subHeader', alignment: 'left' },
          { text: this.isVoted ? "YES" : "NO", style: 'textValue', alignment: 'left' }
        ]
      });
      this.filterDetailsObject.push("\t\t");
    }
    if (this.selectedValues.includes("isOut")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.isOutOfStation == this.isOOS) {
          return true;
        }
      });
      this.filterDetailsObject.push({
        text: [
          { text: 'Out of Station : ', style: 'subHeader', alignment: 'left' },
          { text: this.isOOS ? "YES" : "NO", style: 'textValue', alignment: 'left' }
        ]
      });
      this.filterDetailsObject.push("\t\t");
    }
    if (this.selectedValues.includes("isOutOfWard")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.isOutOfWard == this.isOOW) {
          return true;
        }
      });
      this.filterDetailsObject.push({
        text: [
          { text: 'Out of Ward : ', style: 'subHeader', alignment: 'left' },
          { text: this.isOOW ? "YES" : "NO", style: 'textValue', alignment: 'left' }
        ]
      });
      this.filterDetailsObject.push("\t\t");
    }
    if (this.selectedValues.includes("ageRange")) {
      this.votersList = this.votersList.filter(currentVoter => {
        if (currentVoter.age >= this.ageRange.lower && currentVoter.age <= this.ageRange.upper) {
          return true;
        }
      });
      this.filterDetailsObject.push({
        text: [
          { text: 'Age Range : ', style: 'subHeader', alignment: 'left' },
          { text: this.ageRange.lower + " - " + this.ageRange.upper, style: 'textValue', alignment: 'left' }
        ]
      });
      this.filterDetailsObject.push("\t\t");
    }
    if (this.selectedValues.includes("phoneNo")) {
      const phoneNumberValue: string = this.phoneNumber == undefined ? '' : String(this.phoneNumber);
      this.votersList = this.votersList.filter(currentVoter => {
        if (phoneNumberValue == '') {
          if (currentVoter.phoneNo == phoneNumberValue) {
            return true;
          }
        } else {
          if (currentVoter.phoneNo.indexOf(phoneNumberValue) > -1) {
            return true;
          }
        }
      });
      this.filterDetailsObject.push({
        text: [
          { text: 'Phone No Contains : ', style: 'subHeader', alignment: 'left' },
          { text: phoneNumberValue == '' ? "Empty" : phoneNumberValue, style: 'textValue', alignment: 'left' }
        ]
      });
      this.filterDetailsObject.push("\t\t");
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
        guardianName: voter.payload.doc.data()['guardianName'],
        address: voter.payload.doc.data()['address'],
        houseNo: voter.payload.doc.data()['houseNo'],
        gender: gender,
        age: voter.payload.doc.data()['age'],
        voterId: voter.payload.doc.data()['idCardNo'],
        isVoted: Boolean(voter.payload.doc.data()['voted']),
        isOutOfStation: Boolean(voter.payload.doc.data()['outOfStation']),
        isOutOfWard: Boolean(voter.payload.doc.data()['outOfWard']),
        isDead: Boolean(voter.payload.doc.data()['dead']),
        religion: voter.payload.doc.data()['religion'],
        caste: voter.payload.doc.data()['caste'],
        genderDB: voter.payload.doc.data()['gender'],
        panchayatVote: Number(voter.payload.doc.data()['panchayatVote']),
        blockPanchayatVote: Number(voter.payload.doc.data()['blockVote']),
        districtPanchayatVote: Number(voter.payload.doc.data()['districtVote']),
        phoneNo: String(voter.payload.doc.data()['phoneNo']),
        isPhoneNoExist: voter.payload.doc.data()['phoneNo'] == "" ? true : false
      }
    });
    this.addFilter();
  }
  electionBodyComboOnChange(event) {
    this.clearVotersList();
    this.candidateList = [];
    this.candidateObject.name = "";
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
          let partyCode: string = '[' + String(candidate.payload.doc.data()['partyCode']) + ']' + '\xa0';
          return {
            code: candidate.payload.doc.data()['candidateCode'],
            name: partyCode + String(candidate.payload.doc.data()['candidateName']),
          }
        });
        this.candidateList.push({
          code: '8080',
          name: '[Empty Check]',
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
    if (this.selectedValues.includes('religion') && !this.religionObject) {
      this.showToaster("Please enter Religion.");
      return false;
    }
    if (this.selectedValues.includes("caste") && !this.casteObject) {
      if (!this.religionObject.code) {
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
    if (this.selectedValues.includes("candidate") && !this.candidateObject) {
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


  createPdf() {
    var docDefinition = {
      header: 'App Generated Report',
      footer: {
        columns: [
          {
            text: [
              { text: 'User Phone No : ', style: 'subTitle', alignment: 'left' },
              { text: this.phoneNo, alignment: 'left' }
            ]
          },
          {
            text: [
              { text: 'Created Date : ', style: 'subTitle', alignment: 'right' },
              { text: this.datePipe.transform(new Date(), "medium"), alignment: 'right' }
            ]
          }
        ]
      },

      content: [
        { text: 'Booth Prabhari Report', style: 'title' },
        "\n",
        { text: 'Basic Details', style: 'header', alignment: 'left' },
        "\n",
        {
          text: [
            { text: 'District : ', style: 'subHeader', alignment: 'left' },
            { text: this.boothDetails.districtName, style: 'textValue', alignment: 'left' },
            "\t\t",
            { text: 'Local Body : ', style: 'subHeader', alignment: 'center' },
            { text: this.boothDetails.localBodyName, style: 'textValue', alignment: 'center' },
            "\t\t",
            { text: 'Ward : ', style: 'subHeader', alignment: 'right' },
            { text: this.boothDetails.wardName, style: 'textValue', alignment: 'right' }
          ]
        },
        "\n",
        {
          text: [
            { text: 'Polling Station : ', style: 'subHeader', alignment: 'left' },
            { text: this.boothDetails.pollingStationName, style: 'textValue', alignment: 'left' }
          ]
        },
        "\n",
        { text: 'Filter Details', style: 'header', alignment: 'left' },
        "\n",
        {
          text: this.filterDetailsObject
        },
        "\n",
        { text: 'Voters Details', style: 'header', alignment: 'left' },
        "\n",
        {
          text: [
            { text: 'Count : ', style: 'subHeader', alignment: 'left' },
            { text: this.votersList.length, style: 'textValue', alignment: 'left' }
          ]
        },
        "\n",
        {
          table: {
            headerRows: 1,
            widths: ['5%', '22%', '20%', '5%', '20%', '5%', '9%', '16%'],
            body: [
              [{ text: 'Sl. No.', style: 'tableHeader' }, { text: 'Voter Name', style: 'tableHeader' }, { text: 'Address', style: 'tableHeader' }, { text: 'Ho. No.', style: 'tableHeader' }, { text: 'Guardian\'s Name', style: 'tableHeader' }, { text: 'Age', style: 'tableHeader' }, { text: 'Gender', style: 'tableHeader' }, { text: 'Phone No.', style: 'tableHeader' }],
              ...this.votersList.map(voter => ([{ text: voter.serialNo, bold: true }, this.titleCasePipe.transform(voter.voterName), this.titleCasePipe.transform(voter.address), voter.houseNo, this.titleCasePipe.transform(voter.guardianName), voter.age, voter.genderDB, voter.phoneNo])),
              [{ text: 'Total Voters', colSpan: 7, style: 'tableHeader' }, {}, {}, {}, {}, {}, {}, { text: this.votersList.length, bold: true, alignment: 'center' }]
            ]
          }
        }


      ],
      styles: {
        title: {
          fontSize: 20,
          bold: true,
          color: '#3B89BF',
          decoration: 'underline',
          alignment: 'center'
        },
        subTitle: {
          fontSize: 12,
          color: '#A52721'
        },
        header: {
          fontSize: 16,
          bold: true,
          decoration: 'underline'
        },
        subHeader: {
          fontSize: 12,
          color: '#3498db',
          bold: true,
        },
        textValue: {
          fontSize: 12,
        },
        tableHeader: {
          bold: true,
          alignment: 'center',
          color: '#3498db'
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }

  downloadPdf() {
    this.createPdf();
    if (this.platform.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'BoothPrabhariReport.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'BoothPrabhariReport.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }
  async getBoothDetails() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("pollingStationList", ref => ref.where('pollingStationCode', '==', this.boothCode)).snapshotChanges().subscribe(data => {
        data.map(booth => {
          this.boothDetails = {
            districtName: String(booth.payload.doc.data()['districtName']),
            localBodyName: String(booth.payload.doc.data()['localBodyName']),
            wardName: String(booth.payload.doc.data()['wardName']),
            pollingStationName: String(booth.payload.doc.data()['pollingStationName']),
          }
        });
      });
    } catch (err) {
      this.showToaster(err);
    }
    loader.dismiss();
  }

  clearVotersList() {
    this.showRecordCount = false;
    this.recordCounter = 0;
    this.lazyLoadingVotersList = [];
    this.votersList = [];
  }

}