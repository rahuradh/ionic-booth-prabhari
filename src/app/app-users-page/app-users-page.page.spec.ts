import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppUsersPagePage } from './app-users-page.page';

describe('AppUsersPagePage', () => {
  let component: AppUsersPagePage;
  let fixture: ComponentFixture<AppUsersPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUsersPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppUsersPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
