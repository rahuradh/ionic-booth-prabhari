import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidateDetailPage } from './candidate-detail.page';

describe('CandidateDetailPage', () => {
  let component: CandidateDetailPage;
  let fixture: ComponentFixture<CandidateDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
