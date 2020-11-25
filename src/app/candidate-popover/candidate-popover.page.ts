import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, PopoverController, ToastController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-candidate-popover',
  templateUrl: './candidate-popover.page.html',
  styleUrls: ['./candidate-popover.page.scss'],
})
export class CandidatePopoverPage implements OnInit {
  boothCode: string;
  accessType: string;
  phoneNo: string;
  callFrom: string;
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
    private popoverController: PopoverController,
    private toastCtrl: ToastController) {
    this.boothCode = this.navParams.get('boothCode');
    this.accessType = this.navParams.get('accessType');
    this.phoneNo = this.navParams.get('phoneNo');
    this.callFrom = this.navParams.get('callFrom');
  }

  ngOnInit() {
  }

  manageCandidates(code: string) {
    if (code == "1") {
      this.navCtrl.navigateRoot("candidate-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/" + this.callFrom + "/panchayat");
    } else if (code == "2") {
      this.navCtrl.navigateRoot("candidate-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/" + this.callFrom + "/blockPanchayat");
    } else if (code == "3") {
      this.navCtrl.navigateRoot("candidate-page/" + this.boothCode + "/" + this.accessType + "/" + this.phoneNo + "/" + this.callFrom + "/districtPanchayat");
    }
    this.popoverController.dismiss();
  }
  showToaster(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }
}
