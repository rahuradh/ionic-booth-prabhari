import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatusPagePage } from './status-page.page';

describe('StatusPagePage', () => {
  let component: StatusPagePage;
  let fixture: ComponentFixture<StatusPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
