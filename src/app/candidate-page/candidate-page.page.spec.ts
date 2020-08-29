import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CandidatePagePage } from './candidate-page.page';

describe('CandidatePagePage', () => {
  let component: CandidatePagePage;
  let fixture: ComponentFixture<CandidatePagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatePagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
