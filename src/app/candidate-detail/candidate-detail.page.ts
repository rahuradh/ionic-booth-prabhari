import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from '../models/candidate.model';

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.page.html',
  styleUrls: ['./candidate-detail.page.scss'],
})
export class CandidateDetailPage implements OnInit {

  candidateId: string;
  boothCode: string;
  electionBody: string;
  candidate = {} as Candidate;
  readOnlyMode: boolean = false;

  customInterfaceOptions: any = {
    // header: 'Colors',
    // subHeader: 'Select your favorite color',
    cssClass: 'my-custom-interface'
  };

  constructor(private navCtrl: NavController,
    private actRouter: ActivatedRoute) {
    this.candidateId = this.actRouter.snapshot.paramMap.get("candidateId");
    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.electionBody = this.actRouter.snapshot.paramMap.get("electionBody");
  }

  ngOnInit() {
  }

  goToCandidatePage() {
    this.navCtrl.navigateRoot("candidate-page/" + this.boothCode + "/" + this.electionBody);
  }
}
