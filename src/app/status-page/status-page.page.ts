import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Status } from '../models/status.model';
import { LoadingController, ToastController, NavController, PopoverController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { CandidatePopoverPage } from '../candidate-popover/candidate-popover.page';

declare var google;

@Component({
  selector: 'app-status-page',
  templateUrl: './status-page.page.html',
  styleUrls: ['./status-page.page.scss'],
})
export class StatusPagePage implements OnInit, AfterViewInit {

  public votersList: any[];
  public candidateList: any[];
  public candidateUpdateList: any[];
  public deadVotersList: any[];
  public outOfStationVoterList: any[];
  public panchayatCandidateList: any[];
  public blockPanchayatCandidateList: any[];
  public districtPanchayatCandidateList: any[];

  public panchayantPrePollResultMsg: string;
  public panchayantExitPollResultMsg: string;
  public blockPanchayantPrePollResultMsg: string;
  public blockPanchayantExitPollResultMsg: string;
  public districtPanchayantPrePollResultMsg: string;
  public districtPanchayantExitPollResultMsg: string;

  private status = {} as Status;
  private boothCode: string;
  private accessType: string;
  private phoneNo: string;
  private callFrom: string;
  private whiteSpace: string = '\xa0';
  private panchayathPrePollCandidateVoteList: any[] = [];
  private panchayathExitPollCandidateVoteList: any[] = [];
  private panchayathCandidateColorList: string[] = [];

  private blockPanchayathPrePollCandidateVoteList: any[] = [];
  private blockPanchayathExitPollCandidateVoteList: any[] = [];
  private blockPanchayathCandidateColorList: string[] = [];

  private districtPanchayathPrePollCandidateVoteList: any[] = [];
  private districtPanchayathExitPollCandidateVoteList: any[] = [];
  private districtPanchayathCandidateColorList: string[] = [];

  private prePollVotersForCandidateList: any[] = [];
  private exitPollVotersForCandidateList: any[] = [];

  constructor(private actRouter: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private popoverController: PopoverController) {
    this.boothCode = this.actRouter.snapshot.paramMap.get("boothCode");
    this.accessType = this.actRouter.snapshot.paramMap.get("accessType");
    this.phoneNo = this.actRouter.snapshot.paramMap.get("phoneNo");
    this.callFrom = this.actRouter.snapshot.paramMap.get("callFrom");
    this.getBoothDetailStatus();
  }

  ngOnInit() { }

  ngAfterViewInit() {
  }

  clearAllList() {
    let innerArray: any[] = ["Candidate", "Vote"]

    this.panchayathPrePollCandidateVoteList = [];
    this.panchayathExitPollCandidateVoteList = [];
    this.panchayathPrePollCandidateVoteList.push(innerArray);
    this.panchayathExitPollCandidateVoteList.push(innerArray);
    this.panchayathCandidateColorList = [];

    this.blockPanchayathPrePollCandidateVoteList = [];
    this.blockPanchayathExitPollCandidateVoteList = [];
    this.blockPanchayathPrePollCandidateVoteList.push(innerArray);
    this.blockPanchayathExitPollCandidateVoteList.push(innerArray);
    this.blockPanchayathCandidateColorList = [];

    this.districtPanchayathPrePollCandidateVoteList = [];
    this.districtPanchayathExitPollCandidateVoteList = [];
    this.districtPanchayathPrePollCandidateVoteList.push(innerArray);
    this.districtPanchayathExitPollCandidateVoteList.push(innerArray);
    this.districtPanchayathCandidateColorList = [];

    this.prePollVotersForCandidateList = [];
    this.exitPollVotersForCandidateList = [];
    this.candidateList = [];
    this.candidateUpdateList = [];
    this.votersList = [];
    this.deadVotersList = [];
    this.outOfStationVoterList = [];
    this.panchayatCandidateList = [];
    this.blockPanchayatCandidateList = [];
    this.districtPanchayatCandidateList = [];

    this.panchayantPrePollResultMsg = "";
    this.panchayantExitPollResultMsg = "";
    this.blockPanchayantPrePollResultMsg = "";
    this.blockPanchayantExitPollResultMsg = "";
    this.districtPanchayantPrePollResultMsg = "";
    this.districtPanchayantExitPollResultMsg = "";
  }

  loadStatusChart() {
    this.drawPanchayatPrePollChart();
    this.drawPanchayatExitPollChart();
    this.drawBlockPanchayatPrePollChart();
    this.drawBlockPanchayatExitPollChart();
    this.drawDistrictPanchayatPrePollChart();
    this.drawDistrictPanchayatExitPollChart();
    this.getBoothBasicStatus();
  }

  displayResultMsg() {
    this.generatePanchayatPrePollResult();
    this.generatePanchayatExitPollResult();
    this.generateBlockPanchayatPrePollResult();
    this.generateBlockPanchayatExitPollResult();
    this.generateDistrictPanchayatPrePollResult();
    this.generateDistrictPanchayatExitPollResult();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getBoothDetailStatus();
      event.target.complete();
    }, 500)
  }

  async getBoothBasicStatus() {
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    try {
      this.firestore.collection("pollingStationList", ref => ref.where('pollingStationCode', '==', this.boothCode)).snapshotChanges().subscribe(data => {
        let panchayatCandidates = Number(this.panchayatCandidateList.length);
        let blockPanchayatCandidates = Number(this.blockPanchayatCandidateList.length);
        let districtPanchayatCandidates = Number(this.districtPanchayatCandidateList.length);
        if (panchayatCandidates == 0 || panchayatCandidates == 1) {
          panchayatCandidates = 0;
        } else {
          panchayatCandidates = panchayatCandidates - 1;
        }
        if (blockPanchayatCandidates == 0 || blockPanchayatCandidates == 1) {
          blockPanchayatCandidates = 0;
        } else {
          blockPanchayatCandidates = blockPanchayatCandidates - 1;
        }
        if (districtPanchayatCandidates == 0 || districtPanchayatCandidates == 1) {
          districtPanchayatCandidates = 0;
        } else {
          districtPanchayatCandidates = districtPanchayatCandidates - 1;
        }
        data.map(booth => {
          this.status = {
            districtName: String(booth.payload.doc.data()['districtName']),
            localBodyName: String(booth.payload.doc.data()['localBodyName']),
            wardName: String(booth.payload.doc.data()['wardName']),
            pollingStationName: String(booth.payload.doc.data()['pollingStationName']),
            totalVotes: Number(this.votersList.length),
            deathVotes: Number(this.deadVotersList.length),
            outOfStationVotes: Number(this.outOfStationVoterList.length),
            expectedPoll: Number(this.prePollVotersForCandidateList.length),
            totalPolled: Number(this.exitPollVotersForCandidateList.length),
            panchayatCandidates: panchayatCandidates,
            blockPanchayatCandidates: blockPanchayatCandidates,
            districtPanchayatCandidates: districtPanchayatCandidates
          }
        });
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

  async getBoothDetailStatus() {
    this.clearAllList();
    let loader = await this.loadingCtrl.create({
      message: "Please wait...."
    });
    loader.present();
    this.getVotersList();
    try {
      await this.firestore.collection("candidateList", ref => ref.where('boothCode', '==', this.boothCode)).snapshotChanges().subscribe(data => {
        this.candidateUpdateList = data.map(candidate => {
          let electionBody = String(candidate.payload.doc.data()['electionBody']);
          let candidateCode = String(candidate.payload.doc.data()['candidateCode']);
          return {
            id: candidate.payload.doc.id,
            boothCode: String(candidate.payload.doc.data()['boothCode']),
            electionBody: electionBody,
            partyCode: "[" + String(candidate.payload.doc.data()['partyCode']) + "]",
            candidateName: String(candidate.payload.doc.data()['candidateName']),
            candidateCode: candidateCode,
            candidateColor: String(candidate.payload.doc.data()['candidateColor']),
            prePollVoteCount: this.getPrePollVote(electionBody, candidateCode),
            exitPollVoteCount: this.getExitPollVote(electionBody, candidateCode)
          }
        });
        this.panchayatCandidateList = this.candidateUpdateList.filter(candidate => {
          if (candidate.electionBody == "panchayat") {
            return true;
          }
        });
        this.blockPanchayatCandidateList = this.candidateUpdateList.filter(candidate => {
          if (candidate.electionBody == "blockPanchayat") {
            return true;
          }
        });
        this.districtPanchayatCandidateList = this.candidateUpdateList.filter(candidate => {
          if (candidate.electionBody == "districtPanchayat") {
            return true;
          }
        });

        this.manipulateCandidateList();
      });
    } catch (err) {
      this.showToaster(err);
    }
    loader.dismiss();
  }

  manipulateCandidateList() {
    this.candidateUpdateList = this.candidateUpdateList.sort((n1, n2) => {
      if (Number(n1.candidateCode) > Number(n2.candidateCode)) {
        return 1;
      }
      if (Number(n1.candidateCode) < Number(n2.candidateCode)) {
        return -1;
      }
      return 0;
    });
    this.candidateUpdateList.forEach(candidate => {
      let innerPrePollArray: any[] = [];
      let innerExitPollArray: any[] = [];
      if (candidate.electionBody == "panchayat") {
        innerPrePollArray.push(candidate.partyCode + this.whiteSpace + candidate.candidateName);
        innerPrePollArray.push(candidate.prePollVoteCount);
        this.panchayathPrePollCandidateVoteList.push(innerPrePollArray);

        innerExitPollArray.push(candidate.partyCode + this.whiteSpace + candidate.candidateName);
        innerExitPollArray.push(candidate.exitPollVoteCount);
        this.panchayathExitPollCandidateVoteList.push(innerExitPollArray);

        this.panchayathCandidateColorList.push(candidate.candidateColor);

      } else if (candidate.electionBody == "blockPanchayat") {
        innerPrePollArray.push(candidate.partyCode + this.whiteSpace + candidate.candidateName);
        innerPrePollArray.push(candidate.prePollVoteCount);
        this.blockPanchayathPrePollCandidateVoteList.push(innerPrePollArray);

        innerExitPollArray.push(candidate.partyCode + this.whiteSpace + candidate.candidateName);
        innerExitPollArray.push(candidate.exitPollVoteCount);
        this.blockPanchayathExitPollCandidateVoteList.push(innerExitPollArray);

        this.blockPanchayathCandidateColorList.push(candidate.candidateColor);

      } else if (candidate.electionBody == "districtPanchayat") {
        innerPrePollArray.push(candidate.partyCode + this.whiteSpace + candidate.candidateName);
        innerPrePollArray.push(candidate.prePollVoteCount);
        this.districtPanchayathPrePollCandidateVoteList.push(innerPrePollArray);

        innerExitPollArray.push(candidate.partyCode + this.whiteSpace + candidate.candidateName);
        innerExitPollArray.push(candidate.exitPollVoteCount);
        this.districtPanchayathExitPollCandidateVoteList.push(innerExitPollArray);

        this.districtPanchayathCandidateColorList.push(candidate.candidateColor);

      }
    });
    this.loadStatusChart();
    this.displayResultMsg();
  }
  getVotersList() {
    this.votersList = [];
    try {
      this.firestore.collection("votersList", ref => ref.where('boothCode', '==', this.boothCode)).snapshotChanges().subscribe(data => {
        this.votersList = data.map(voter => {
          return {
            isDead: Boolean(voter.payload.doc.data()['dead']),
            isOOS: Boolean(voter.payload.doc.data()['outOfStation']),
            isVoted: Boolean(voter.payload.doc.data()['voted']),
            panchanyatVote: String(voter.payload.doc.data()['panchayatVote']),
            blockPanchanyatVote: String(voter.payload.doc.data()['blockVote']),
            districtPanchanyatVote: String(voter.payload.doc.data()['districtVote'])
          }
        });
        this.prePollVotersForCandidateList = this.votersList.filter(currentVoter => {
          if (currentVoter.isDead == false && currentVoter.isOOS == false) {
            return true;
          }
        });
        this.exitPollVotersForCandidateList = this.votersList.filter(currentVoter => {
          if (currentVoter.isVoted == true) {
            return true;
          }
        });
        this.deadVotersList = this.votersList.filter(currentVoter => {
          if (currentVoter.isDead == true) {
            return true;
          }
        });
        this.outOfStationVoterList = this.votersList.filter(currentVoter => {
          if (currentVoter.isOOS == true) {
            return true;
          }
        });
      });
    } catch (err) {
      this.showToaster(err);
    }
  }

  getPrePollVote(electionBody: string, candidateCode: string) {
    let candidatesVotersList: any[];
    if (electionBody == "panchayat") {
      candidatesVotersList = this.prePollVotersForCandidateList.filter(currentVoter => {
        if (currentVoter.panchanyatVote == candidateCode) {
          return true;
        }
      });
    } else if (electionBody == "blockPanchayat") {
      candidatesVotersList = this.prePollVotersForCandidateList.filter(currentVoter => {
        if (currentVoter.blockPanchanyatVote == candidateCode) {
          return true;
        }
      });
    } else if (electionBody == "districtPanchayat") {
      candidatesVotersList = this.prePollVotersForCandidateList.filter(currentVoter => {
        if (currentVoter.districtPanchanyatVote == candidateCode) {
          return true;
        }
      });
    }
    return candidatesVotersList.length;
  }

  getExitPollVote(electionBody: string, candidateCode: string) {
    let candidatesVotersList: any[];
    if (electionBody == "panchayat") {
      candidatesVotersList = this.exitPollVotersForCandidateList.filter(currentVoter => {
        if (currentVoter.panchanyatVote == candidateCode) {
          return true;
        }
      });
    } else if (electionBody == "blockPanchayat") {
      candidatesVotersList = this.exitPollVotersForCandidateList.filter(currentVoter => {
        if (currentVoter.blockPanchanyatVote == candidateCode) {
          return true;
        }
      });
    } else if (electionBody == "districtPanchayat") {
      candidatesVotersList = this.exitPollVotersForCandidateList.filter(currentVoter => {
        if (currentVoter.districtPanchanyatVote == candidateCode) {
          return true;
        }
      });
    }
    return candidatesVotersList.length;
  }

  drawPanchayatPrePollChart() {
    var data = google.visualization.arrayToDataTable(this.panchayathPrePollCandidateVoteList);
    var options = {
      legend: 'none',
      pieHole: 0.4,
      colors: this.panchayathCandidateColorList,
      width: 380,
      height: 350
    };
    var chart = new google.visualization.PieChart(document.getElementById('panchayatPrePollChart'));
    chart.draw(data, options);
  }
  drawPanchayatExitPollChart() {
    var data = google.visualization.arrayToDataTable(this.panchayathExitPollCandidateVoteList);
    var options = {
      legend: 'none',
      pieHole: 0.4,
      colors: this.panchayathCandidateColorList,
      width: 380,
      height: 350
    };
    var chart = new google.visualization.PieChart(document.getElementById('panchayatExitPollChart'));
    chart.draw(data, options);
  }
  drawBlockPanchayatPrePollChart() {
    var data = google.visualization.arrayToDataTable(this.blockPanchayathPrePollCandidateVoteList);
    var options = {
      legend: 'none',
      pieHole: 0.4,
      colors: this.blockPanchayathCandidateColorList,
      width: 380,
      height: 350
    };
    var chart = new google.visualization.PieChart(document.getElementById('blockPanchayatPrePollChart'));
    chart.draw(data, options);
  }
  drawBlockPanchayatExitPollChart() {
    var data = google.visualization.arrayToDataTable(this.blockPanchayathExitPollCandidateVoteList);
    var options = {
      legend: 'none',
      pieHole: 0.4,
      colors: this.blockPanchayathCandidateColorList,
      width: 380,
      height: 350
    };
    var chart = new google.visualization.PieChart(document.getElementById('blockPanchayatExitPollChart'));
    chart.draw(data, options);
  }
  drawDistrictPanchayatPrePollChart() {
    var data = google.visualization.arrayToDataTable(this.districtPanchayathPrePollCandidateVoteList);
    var options = {
      legend: 'none',
      pieHole: 0.4,
      colors: this.districtPanchayathCandidateColorList,
      width: 380,
      height: 350
    };
    var chart = new google.visualization.PieChart(document.getElementById('districtPanchayatPrePollChart'));
    chart.draw(data, options);
  }
  drawDistrictPanchayatExitPollChart() {
    var data = google.visualization.arrayToDataTable(this.districtPanchayathExitPollCandidateVoteList);
    var options = {
      legend: 'none',
      pieHole: 0.4,
      colors: this.districtPanchayathCandidateColorList,
      width: 380,
      height: 350
    };
    var chart = new google.visualization.PieChart(document.getElementById('districtPanchayatExitiPollChart'));
    chart.draw(data, options);
  }
  generatePanchayatPrePollResult() {
    let panchayatCandidateList = this.candidateUpdateList.filter(currentVoter => {
      if (currentVoter.electionBody == "panchayat") {
        return true;
      }
    });
    if (panchayatCandidateList.length == 0 || panchayatCandidateList.length == 1) {
      this.panchayantPrePollResultMsg = 'No result found.';
      return;
    }
    let panchayatCandidateListWithPrePollResult = panchayatCandidateList.sort((n1, n2) => {
      if (n1.prePollVoteCount < n2.prePollVoteCount) {
        return 1;
      }
      if (n1.prePollVoteCount > n2.prePollVoteCount) {
        return -1;
      }
      return 0;
    });
    let prePollResult: number = panchayatCandidateListWithPrePollResult[0].prePollVoteCount - panchayatCandidateListWithPrePollResult[1].prePollVoteCount;
    this.panchayantPrePollResultMsg = this.generateResultMessage(prePollResult, panchayatCandidateListWithPrePollResult, 'prePollVoteCount');
  }

  generatePanchayatExitPollResult() {
    let panchayatCandidateList = this.candidateUpdateList.filter(currentVoter => {
      if (currentVoter.electionBody == "panchayat") {
        return true;
      }
    });
    if (panchayatCandidateList.length == 0 || panchayatCandidateList.length == 1) {
      this.panchayantExitPollResultMsg = 'No result found.';
      return;
    }
    let panchayatCandidateListWithExitPollResult = panchayatCandidateList.sort((n1, n2) => {
      if (n1.exitPollVoteCount < n2.exitPollVoteCount) {
        return 1;
      }
      if (n1.exitPollVoteCount > n2.exitPollVoteCount) {
        return -1;
      }
      return 0;
    });
    let exitPollResult: number = panchayatCandidateListWithExitPollResult[0].exitPollVoteCount - panchayatCandidateListWithExitPollResult[1].exitPollVoteCount;
    this.panchayantExitPollResultMsg = this.generateResultMessage(exitPollResult, panchayatCandidateListWithExitPollResult, 'exitPollVoteCount');
  }


  generateBlockPanchayatPrePollResult() {
    let blockPanchayatCandidateList = this.candidateUpdateList.filter(currentVoter => {
      if (currentVoter.electionBody == "blockPanchayat") {
        return true;
      }
    });
    if (blockPanchayatCandidateList.length == 0 || blockPanchayatCandidateList.length == 1) {
      this.blockPanchayantPrePollResultMsg = 'No result found.';
      return;
    }
    let blockPanchayatCandidateListWithPrePollResult = blockPanchayatCandidateList.sort((n1, n2) => {
      if (n1.prePollVoteCount < n2.prePollVoteCount) {
        return 1;
      }
      if (n1.prePollVoteCount > n2.prePollVoteCount) {
        return -1;
      }
      return 0;
    });
    let prePollResult: number = blockPanchayatCandidateListWithPrePollResult[0].prePollVoteCount - blockPanchayatCandidateListWithPrePollResult[1].prePollVoteCount;
    this.blockPanchayantPrePollResultMsg = this.generateResultMessage(prePollResult, blockPanchayatCandidateListWithPrePollResult, 'prePollVoteCount');
  }

  generateBlockPanchayatExitPollResult() {
    let blockPanchayatCandidateList = this.candidateUpdateList.filter(currentVoter => {
      if (currentVoter.electionBody == "blockPanchayat") {
        return true;
      }
    });
    if (blockPanchayatCandidateList.length == 0 || blockPanchayatCandidateList.length == 1) {
      this.blockPanchayantExitPollResultMsg = 'No result found.';
      return;
    }
    let blockPanchayatCandidateListWithExitPollResult = blockPanchayatCandidateList.sort((n1, n2) => {
      if (n1.exitPollVoteCount < n2.exitPollVoteCount) {
        return 1;
      }
      if (n1.exitPollVoteCount > n2.exitPollVoteCount) {
        return -1;
      }
      return 0;
    });
    let exitPollResult: number = blockPanchayatCandidateListWithExitPollResult[0].exitPollVoteCount - blockPanchayatCandidateListWithExitPollResult[1].exitPollVoteCount;
    this.blockPanchayantExitPollResultMsg = this.generateResultMessage(exitPollResult, blockPanchayatCandidateListWithExitPollResult, 'exitPollVoteCount');
  }

  generateDistrictPanchayatPrePollResult() {
    let districtPanchayatCandidateList = this.candidateUpdateList.filter(currentVoter => {
      if (currentVoter.electionBody == "districtPanchayat") {
        return true;
      }
    });
    if (districtPanchayatCandidateList.length == 0 || districtPanchayatCandidateList.length == 1) {
      this.districtPanchayantPrePollResultMsg = 'No result found.';
      return;
    }
    let districtPanchayatCandidateListWithPrePollResult = districtPanchayatCandidateList.sort((n1, n2) => {
      if (n1.prePollVoteCount < n2.prePollVoteCount) {
        return 1;
      }
      if (n1.prePollVoteCount > n2.prePollVoteCount) {
        return -1;
      }
      return 0;
    });
    let prePollResult: number = districtPanchayatCandidateListWithPrePollResult[0].prePollVoteCount - districtPanchayatCandidateListWithPrePollResult[1].prePollVoteCount;
    this.districtPanchayantPrePollResultMsg = this.generateResultMessage(prePollResult, districtPanchayatCandidateListWithPrePollResult, 'prePollVoteCount');
  }

  generateDistrictPanchayatExitPollResult() {
    let districtPanchayatCandidateList = this.candidateUpdateList.filter(currentVoter => {
      if (currentVoter.electionBody == "districtPanchayat") {
        return true;
      }
    });
    if (districtPanchayatCandidateList.length == 0 || districtPanchayatCandidateList.length == 1) {
      this.districtPanchayantExitPollResultMsg = 'No result found.';
      return;
    }
    let districtPanchayatCandidateListWithExitPollResult = districtPanchayatCandidateList.sort((n1, n2) => {
      if (n1.exitPollVoteCount < n2.exitPollVoteCount) {
        return 1;
      }
      if (n1.exitPollVoteCount > n2.exitPollVoteCount) {
        return -1;
      }
      return 0;
    });

    let exitPollResult: number = districtPanchayatCandidateListWithExitPollResult[0].exitPollVoteCount - districtPanchayatCandidateListWithExitPollResult[1].exitPollVoteCount;
    this.districtPanchayantExitPollResultMsg = this.generateResultMessage(exitPollResult, districtPanchayatCandidateListWithExitPollResult, 'exitPollVoteCount');
  }

  generateResultMessage(leadCount: number, candidateList: any, pollValue: string) {
    if (pollValue == 'prePollVoteCount') {
      if (leadCount == 0 && this.checkPrePollEmptyOrNot(candidateList, pollValue)) {
        let message = '';
        let highestVote = candidateList[0].prePollVoteCount;
        candidateList.forEach(candidate => {
          if (candidate.prePollVoteCount == highestVote) {
            message = message + this.whiteSpace + candidate.partyCode + this.whiteSpace + candidate.candidateName + ',';
          }
        });
        return message + this.whiteSpace + "are in same position";
      } else if (leadCount == 0) {
        return 'No result found.';
      } else if (leadCount == 1) {
        return candidateList[0].partyCode + this.whiteSpace + candidateList[0].candidateName + this.whiteSpace + "leads by" + this.whiteSpace + String(leadCount) + this.whiteSpace + "vote.";
      } else {
        return candidateList[0].partyCode + this.whiteSpace + candidateList[0].candidateName + this.whiteSpace + "leads by" + this.whiteSpace + String(leadCount) + this.whiteSpace + "votes.";
      }
    } else {
      if (leadCount == 0 && this.checkPrePollEmptyOrNot(candidateList, pollValue)) {
        let message = '';
        let highestVote = candidateList[0].exitPollVoteCount;
        candidateList.forEach(candidate => {
          if (candidate.exitPollVoteCount == highestVote) {
            message = message + this.whiteSpace + candidate.partyCode + this.whiteSpace + candidate.candidateName + ',';
          }
        });
        return message + this.whiteSpace + "are in same position";
      } else if (leadCount == 0) {
        return 'No result found.';
      } else if (leadCount == 1) {
        return candidateList[0].partyCode + this.whiteSpace + candidateList[0].candidateName + this.whiteSpace + "leads by" + this.whiteSpace + String(leadCount) + this.whiteSpace + "vote.";
      } else {
        return candidateList[0].partyCode + this.whiteSpace + candidateList[0].candidateName + this.whiteSpace + "leads by" + this.whiteSpace + String(leadCount) + this.whiteSpace + "votes.";
      }
    }
  }

  checkPrePollEmptyOrNot(candiateList: any, pollValue: string) {
    let status: boolean = false;
    if (pollValue == 'prePollVoteCount') {
      candiateList.forEach(candidate => {
        if (candidate.prePollVoteCount != 0) {
          status = true;
        }
      });
      return status;
    } else {
      candiateList.forEach(candidate => {
        if (candidate.exitPollVoteCount != 0) {
          status = true;
        }
      });
      return status;
    }
  }

  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: CandidatePopoverPage,
      componentProps: {
        boothCode: this.boothCode,
        accessType: this.accessType,
        phoneNo: this.phoneNo,
        callFrom: this.callFrom
      },
      cssClass: 'candidate-popover-class',
      event: event,
      translucent: true
    });
    return await popover.present();
  }
}