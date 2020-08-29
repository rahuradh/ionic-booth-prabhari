import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterVoterPage } from './filter-voter.page';

describe('FilterVoterPage', () => {
  let component: FilterVoterPage;
  let fixture: ComponentFixture<FilterVoterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterVoterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterVoterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
