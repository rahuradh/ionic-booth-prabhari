import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ToastController, NavController, IonInfiniteScroll } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.page.html',
  styleUrls: ['./search-page.page.scss'],
})
export class SearchPagePage implements OnInit {

  public votersList: any[];
  public loadedVotersList: any[];
  public lazyLoadingVotersList: any[] = [];
  public recordCounter: number = 0;
  public searchValue: string = "";

  boothCode: string;
  accessType: string;
  phoneNo: string;
  callFrom: string;
  hasAccess: boolean = false;

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private actRouter: ActivatedRoute,
    private navCtrl: NavController,
    private callNumber: CallNumber,
    private router: Router) {
    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.callFrom = this.actRouter.snapshot.paramMap.get("callFrom");

    if (this.accessType == "Full" || this.accessType == "Booth") {
      this.hasAccess = true;
    }
  }

  ngOnInit() {
    this.loadVotersList();
  }

  async loadVotersList() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("votersList", ref => ref.where('boothCode', '==', this.boothCode)).snapshotChanges().subscribe(data => {
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
            phoneNo: voter.payload.doc.data()['phoneNo'],
            isPhoneNoExist: voter.payload.doc.data()['phoneNo'] == "" ? true : false
          }
        });
        this.votersList = this.votersList.sort((n1, n2) => {
          if (n1.serialNo > n2.serialNo) {
            return 1;
          }
          if (n1.serialNo < n2.serialNo) {
            return -1;
          }
          return 0;
        });
        this.loadedVotersList = this.votersList;
        this.addVotersToList();
      });
    } catch (err) {
      this.showToaster(err);
    }
    loader.dismiss();
  }

  initializeItems(): void {
    this.votersList = this.loadedVotersList;
  }

  async filterList(event) {
    this.initializeItems();
    const searchTerm = event.srcElement.value;
    if (!searchTerm) {
      this.addFilterdVotersToList();
      return;
    }
    this.votersList = this.votersList.filter(currentVoter => {
      if (isNaN(searchTerm)) {
        if (currentVoter.voterName && searchTerm) {
          if (currentVoter.voterName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || currentVoter.address.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      } else {
        if (currentVoter.serialNo && searchTerm) {
          if (currentVoter.serialNo == searchTerm) {
            return true;
          }
          return false;
        }
      }
    });
    this.addFilterdVotersToList();
  }

  showToaster(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }

  async deleteVoter(id: string) {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    await this.firestore.doc("votersList/" + id).delete();
    loader.dismiss();
  }
  openDetailPage(voter) {
    this.navCtrl.navigateRoot("detail-page/" + this.boothCode + "/" + voter.serialNo + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage");
  }

  async setVoteById(_id: string, isVoted: boolean) {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    await this.firestore.doc(`votersList/${_id}`).update({ voted: isVoted });
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
    for (let i = 0; i < 10 && this.recordCounter < this.votersList.length; i++, this.recordCounter++) {
      this.lazyLoadingVotersList.push(this.votersList[this.recordCounter])
    }
  }
  callVoter(phoneNo: string) {
    this.callNumber.callNumber(phoneNo, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  goToDashboard() {
    this.navCtrl.navigateRoot("dashboard/" + this.phoneNo);
  }
  doRefresh(event) {
    setTimeout(() => {
      this.votersList = [];
      this.loadedVotersList = [];
      this.lazyLoadingVotersList = [];
      this.recordCounter = 0;
      this.searchValue = "";
      this.loadVotersList();
      event.target.complete();
    }, 200)
  }
}
