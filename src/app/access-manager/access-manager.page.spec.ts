import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccessManagerPage } from './access-manager.page';

describe('AccessManagerPage', () => {
  let component: AccessManagerPage;
  let fixture: ComponentFixture<AccessManagerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessManagerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessManagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
