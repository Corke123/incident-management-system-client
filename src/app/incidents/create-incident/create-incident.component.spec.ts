import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIncidentComponent } from './create-incident.component';

describe('CreateIncidentComponent', () => {
  let component: CreateIncidentComponent;
  let fixture: ComponentFixture<CreateIncidentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateIncidentComponent]
    });
    fixture = TestBed.createComponent(CreateIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
