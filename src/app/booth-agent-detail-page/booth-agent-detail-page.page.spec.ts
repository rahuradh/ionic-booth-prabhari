import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BoothAgentDetailPagePage } from './booth-agent-detail-page.page';

describe('BoothAgentDetailPagePage', () => {
  let component: BoothAgentDetailPagePage;
  let fixture: ComponentFixture<BoothAgentDetailPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoothAgentDetailPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BoothAgentDetailPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
