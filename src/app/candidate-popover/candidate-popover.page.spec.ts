import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidatePopoverPage } from './candidate-popover.page';

describe('CandidatePopoverPage', () => {
  let component: CandidatePopoverPage;
  let fixture: ComponentFixture<CandidatePopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatePopoverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatePopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
