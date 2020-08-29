import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccessPagePage } from './access-page.page';

describe('AccessPagePage', () => {
  let component: AccessPagePage;
  let fixture: ComponentFixture<AccessPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
