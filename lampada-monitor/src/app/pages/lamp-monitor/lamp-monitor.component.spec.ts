import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LampMonitorComponent } from './lamp-monitor.component';

describe('LampMonitorComponent', () => {
  let component: LampMonitorComponent;
  let fixture: ComponentFixture<LampMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LampMonitorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LampMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
