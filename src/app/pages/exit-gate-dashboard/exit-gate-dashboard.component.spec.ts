import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitGateDashboardComponent } from './exit-gate-dashboard.component';

describe('ExitGateDashboardComponent', () => {
  let component: ExitGateDashboardComponent;
  let fixture: ComponentFixture<ExitGateDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitGateDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitGateDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
