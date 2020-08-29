import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  boothCode: any;
  accessType: any;
  searchTabClass = 'tab-selected';
  statusTabClass = 'tab-unselected';
  filterTabClass = 'tab-unselected';
  constructor(private actRouter: ActivatedRoute,
    private navCtrl: NavController,
    private platform: Platform) {

    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("dashboard");
    });
  }

  ngOnInit() {
    this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/search-page/" + this.boothCode + "/" + this.accessType);
  }
  goToSearchPage() {
    this.searchTabClass = 'tab-selected';
    this.statusTabClass = 'tab-unselected';
    this.filterTabClass = 'tab-unselected';
    this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/search-page/" + this.boothCode + "/" + this.accessType);
  }
  goToStatusPage() {
    this.searchTabClass = 'tab-unselected';
    this.statusTabClass = 'tab-selected';
    this.filterTabClass = 'tab-unselected';
    this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/status-page/" + this.boothCode + "/" + this.accessType);
  }
  goToFilterPage() {
    this.searchTabClass = 'tab-unselected';
    this.statusTabClass = 'tab-unselected';
    this.filterTabClass = 'tab-selected';
    this.navCtrl.navigateRoot("home/" + this.boothCode + "/" + this.accessType + "/filter-voter/" + this.boothCode + "/" + this.accessType);
  }
}
