import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MessageSenderPage } from './message-sender.page';

describe('MessageSenderPage', () => {
  let component: MessageSenderPage;
  let fixture: ComponentFixture<MessageSenderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSenderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageSenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
