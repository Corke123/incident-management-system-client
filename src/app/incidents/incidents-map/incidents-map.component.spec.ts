import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsMapComponent } from './incidents-map.component';

describe('IncidentsMapComponent', () => {
  let component: IncidentsMapComponent;
  let fixture: ComponentFixture<IncidentsMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncidentsMapComponent]
    });
    fixture = TestBed.createComponent(IncidentsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
