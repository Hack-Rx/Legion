import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtecttionTipsComponent } from './protecttion-tips.component';

describe('ProtecttionTipsComponent', () => {
  let component: ProtecttionTipsComponent;
  let fixture: ComponentFixture<ProtecttionTipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtecttionTipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtecttionTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
