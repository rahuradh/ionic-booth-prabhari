import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BoothAgentsPagePage } from './booth-agents-page.page';

describe('BoothAgentsPagePage', () => {
  let component: BoothAgentsPagePage;
  let fixture: ComponentFixture<BoothAgentsPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoothAgentsPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BoothAgentsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
