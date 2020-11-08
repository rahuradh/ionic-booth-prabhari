import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { SMS, SmsOptions } from '@ionic-native/sms/ngx';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { Voter } from '../models/voter.model';

@Component({
  selector: 'app-message-sender',
  templateUrl: './message-sender.page.html',
  styleUrls: ['./message-sender.page.scss'],
})
export class MessageSenderPage implements OnInit {

  salutation1: string = "";
  salutation2: string = "";
  messageContent: string;

  voter: any = {};
  boothCode: string;
  serialNo: string;
  accessType: string;
  phoneNo: string;
  callFrom: string;
  isPhoneNumberExist: boolean = false;
  isSalutation1Required: boolean = false;
  isSalutation2Required: boolean = true;

  id: string;
  readOnlyMode: boolean = true;
  candidateList: any;
  panchayatCandidateList: any;
  blockPanchayatCandidateList: any;
  districtPanchayatCandidateList: any;
  voterNameColor: string = "";
  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private actRouter: ActivatedRoute,
    private navCtrl: NavController,
    private sms: SMS) {
    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.serialNo = this.actRouter.snapshot.paramMap.get("serialNo");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.callFrom = this.actRouter.snapshot.paramMap.get("callFrom");
  }
  successCallback(result) {
    this.showToaster(result);
  }

  errorCallback(error) {
    this.showToaster(error);
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
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
          this.serialNo = String(voter.payload.doc.data()['serialNo']);
          let voterName = String(voter.payload.doc.data()['voterName']);
          let gender = String(voter.payload.doc.data()['gender']);
          let salutation: string = gender == "Male" ? "നമസ്കാരം ശ്രീ " : "നമസ്കാരം ശ്രീമതി ";
          this.salutation1 = salutation + voterName + ",";
          this.salutation2 = "നമസ്കാരം " + voterName + " ജി,";
          this.checkPhoneNumber(String(voter.payload.doc.data()['phoneNo']));
          let displayAge = "(" + Number(voter.payload.doc.data()['age']) + ")";

          this.voter = {
            boothCode: String(voter.payload.doc.data()['boothCode']),
            serialNo: Number(voter.payload.doc.data()['serialNo']),
            voterName: String(voter.payload.doc.data()['voterName']),
            guardianName: String(voter.payload.doc.data()['guardianName']),
            houseNo: String(voter.payload.doc.data()['houseNo']),
            address: String(voter.payload.doc.data()['address']),
            gender: String(voter.payload.doc.data()['gender']),
            age: Number(voter.payload.doc.data()['age']),
            displayAge: displayAge,
            idCardNo: String(voter.payload.doc.data()['idCardNo']),
            phoneNo: String(voter.payload.doc.data()['phoneNo']),
            religion: String(voter.payload.doc.data()['religion']),
            caste: String(voter.payload.doc.data()['caste']),
            isOutOfStation: Boolean(voter.payload.doc.data()['outOfStation']),
            isOutOfWard: Boolean(voter.payload.doc.data()['outOfWard']),
            isDead: Boolean(voter.payload.doc.data()['dead']),
            panchayatVote: String(voter.payload.doc.data()['panchayatVote']),
            blockVote: String(voter.payload.doc.data()['blockVote']),
            districtVote: String(voter.payload.doc.data()['districtVote']),
            voted: Boolean(voter.payload.doc.data()['voted'])
          }
        });
        if (this.voter.voted) {
          this.voterNameColor = "success";
        } else {
          this.voterNameColor = "";
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

  async loadCandidateCombo() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("candidateList", ref => ref.where('boothCode', '==', this.boothCode)).snapshotChanges().subscribe(data => {
        this.candidateList = data.map(candidate => {
          let partyCode: string = "[" + String(candidate.payload.doc.data()['partyCode']) + "]" + '\xa0';
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

  goToDetailPage(voter) {
    this.navCtrl.navigateRoot("detail-page/" + this.boothCode + "/" + voter.serialNo + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage");
  }

  sendSms() {
    if (this.formValidation()) {
      var options: SmsOptions = {
        replaceLineBreaks: true,
        android: {
          intent: 'INTENT'
        }
      }
      var smsContent: string = "";
      if (this.isSalutation1Required) {
        smsContent = this.salutation1 + "\n\n" + this.messageContent;
      } else if (this.isSalutation2Required) {
        smsContent = this.salutation2 + "\n\n" + this.messageContent;
      } else {
        smsContent = this.messageContent;
      }
      this.sms.send('91' + this.voter.phoneNo, smsContent, options).then((data) => {
        this.showToaster("Opening Messaging App");
      }, (err) => {
        this.showToaster("SMS Sending Failed : " + err);
      });
    }
  }
  sendWhatsAppMessage() {
    if (this.formValidation()) {
      var whatsAppMsgContent: string = "";
      if (this.isSalutation1Required) {
        whatsAppMsgContent = this.salutation1 + "\n\n" + this.messageContent;
      } else if (this.isSalutation2Required) {
        whatsAppMsgContent = this.salutation2 + "\n\n" + this.messageContent;
      } else {
        whatsAppMsgContent = this.messageContent;
      }
      const urlContent = window.encodeURIComponent(whatsAppMsgContent);
      console.log(urlContent);
      const url: string = "http://wa.me/" + '91' + this.voter.phoneNo + "?text=" + urlContent;
      window.location.href = url;
    }
  }
  formValidation() {
    if (!this.voter.phoneNo || this.voter.phoneNo.length < 10) {
      this.showToaster("Enter valid Phone Number with out 91.>");
      return false;
    }
    if (!this.messageContent) {
      this.showToaster("Enter Message Content.");
      return false;
    }
    return true;
  }

  checkPhoneNumber(phoneNo: string) {
    if (!phoneNo) {
      this.isPhoneNumberExist = false;
    } else {
      this.isPhoneNumberExist = true;
    }
  }
  onsalutation1ToggleChange() {
    if (this.isSalutation1Required) {
      this.isSalutation2Required = false;
    }
  }
  onsalutation2ToggleChange() {
    if (this.isSalutation2Required) {
      this.isSalutation1Required = false;
    }
  }

}
