import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomComponent } from './symptom.component';

describe('SymptomComponent', () => {
  let component: SymptomComponent;
  let fixture: ComponentFixture<SymptomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SymptomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SymptomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
