import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  boothCode: string;
  accessType: string;
  phoneNo: string;
  callFrom: string;
  searchTabClass = 'tab-selected';
  statusTabClass = 'tab-unselected';
  filterTabClass = 'tab-unselected';
  constructor(private actRouter: ActivatedRoute,
    private navCtrl: NavController,
    private platform: Platform) {

    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.callFrom = this.actRouter.snapshot.paramMap.get("callFrom");

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("dashboard/" + this.phoneNo);
    });
  }

  ngOnInit() {
    if (this.callFrom == "SearchPage") {
      this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage" + "/search-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage");
      this.searchTabClass = 'tab-selected';
      this.statusTabClass = 'tab-unselected';
      this.filterTabClass = 'tab-unselected';
    } else if (this.callFrom == "StatusPage") {
      this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/StatusPage" + "/status-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/StatusPage");
      this.searchTabClass = 'tab-unselected';
      this.statusTabClass = 'tab-selected';
      this.filterTabClass = 'tab-unselected';
    } else if (this.callFrom == "FilterPage") {
      this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/FilterPage" + "/filter-voter/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/FilterPage");
      this.searchTabClass = 'tab-unselected';
      this.statusTabClass = 'tab-unselected';
      this.filterTabClass = 'tab-selected';
    } else {
      this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage" + "/search-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage");
      this.searchTabClass = 'tab-selected';
      this.statusTabClass = 'tab-unselected';
      this.filterTabClass = 'tab-unselected';
    }
  }
  goToSearchPage() {
    this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage" + "/search-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/SearchPage");
    this.searchTabClass = 'tab-selected';
    this.statusTabClass = 'tab-unselected';
    this.filterTabClass = 'tab-unselected';
  }
  goToStatusPage() {
    this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/StatusPage" + "/status-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/StatusPage");
    this.searchTabClass = 'tab-unselected';
    this.statusTabClass = 'tab-selected';
    this.filterTabClass = 'tab-unselected';
  }
  goToFilterPage() {
    this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/FilterPage" + "/filter-voter/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/FilterPage");
    this.searchTabClass = 'tab-unselected';
    this.statusTabClass = 'tab-unselected';
    this.filterTabClass = 'tab-selected';
  }
}