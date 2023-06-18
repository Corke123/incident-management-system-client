import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessIncidentComponent } from './process-incident.component';

describe('ProcessIncidentComponent', () => {
  let component: ProcessIncidentComponent;
  let fixture: ComponentFixture<ProcessIncidentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessIncidentComponent]
    });
    fixture = TestBed.createComponent(ProcessIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
