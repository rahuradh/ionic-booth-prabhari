import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-candidate-popover',
  templateUrl: './candidate-popover.page.html',
  styleUrls: ['./candidate-popover.page.scss'],
})
export class CandidatePopoverPage implements OnInit {
  boothCode: string;
  electionCandidates: any = [
    {
      code: "1",
      name: "Panchayat Candidates"
    },
    {
      code: "2",
      name: "Block Panchayat Candidates"
    },
    {
      code: "3",
      name: "District Panchayat Candidates"
    }
  ]
  constructor(private navParams: NavParams,
    private navCtrl: NavController,
    private popoverController: PopoverController) {
    this.boothCode = this.navParams.get('boothCode');
  }

  ngOnInit() {
  }

  manageCandidates(code: string) {
    if (code == "1") {
      this.navCtrl.navigateRoot("candidate-page/" + this.boothCode + "/panchayat");
    } else if (code == "2") {
      this.navCtrl.navigateRoot("candidate-page/" + this.boothCode + "/blockPanchayat");
    } else if (code == "3") {
      this.navCtrl.navigateRoot("candidate-page/" + this.boothCode + "/districtPanchayat");
    }
    this.popoverController.dismiss();
  }
}
