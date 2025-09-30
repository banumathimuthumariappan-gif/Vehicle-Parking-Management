import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryGateDashboardComponent } from './entry-gate-dashboard.component';

describe('EntryGateDashboardComponent', () => {
  let component: EntryGateDashboardComponent;
  let fixture: ComponentFixture<EntryGateDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryGateDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryGateDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
