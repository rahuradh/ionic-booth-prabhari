import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-access-page',
  templateUrl: './access-page.page.html',
  styleUrls: ['./access-page.page.scss'],
})
export class AccessPagePage implements OnInit {

  isAdminApproved: boolean = false;
  isPaymentSuccess: boolean = false;
  phoneNo: string;
  constructor(private actRouter: ActivatedRoute,
    private navCtrl: NavController, private toastCtrl: ToastController) {
    if (this.actRouter.snapshot.paramMap.get("isAdminApproved") == "true") {
      this.isAdminApproved = true;
    }
    if (this.actRouter.snapshot.paramMap.get("isPaymentSuccess") == "true") {
      this.isPaymentSuccess = true;
    }
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
  }
  successCallback(result) {
    this.showToaster(result); // true - enabled, false - disabled
  }

  errorCallback(error) {
    this.showToaster(error);
  }

  ngOnInit() {

  }

  goToDashboard() {
    this.navCtrl.navigateRoot("dashboard/" + this.phoneNo);
  }
  showToaster(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }
}
