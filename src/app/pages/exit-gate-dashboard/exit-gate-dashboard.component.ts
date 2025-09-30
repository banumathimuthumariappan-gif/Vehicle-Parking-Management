import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ParkingSlot } from '../../models/parking-slot.model';
import { ParkingServiceService } from '../../services/parking-service.service';
import { OccupiedSlotsPipe } from '../../pipes/occupied-slots.pipe';

@Component({
  selector: 'app-exit-gate-dashboard',
  imports: [NgIf, NgFor, NgClass, OccupiedSlotsPipe],
  templateUrl: './exit-gate-dashboard.component.html',
  styleUrl: './exit-gate-dashboard.component.css',
})
export class ExitGateDashboardComponent {
  slots: ParkingSlot[] = [];
  totalSlots: number = 0;
  selectedSlot: ParkingSlot | null = null;
  message: string = '';
  occupiedCount: number = 0;

  constructor(private parkingService: ParkingServiceService) {}

  ngOnInit() {
    // Parking Slot Data
    this.parkingService.getSlots().subscribe({
      next: (data) => {
        this.slots = data;
        this.totalSlots = this.slots.length;
        this.occupiedCount = this.parkingService.getOccupiedCount();
      },
      error: (error) => {
        console.log('Error in getting slots');
      },
    });
  }

  // On Clicking Slot booking card
  onSlotClicked(slot: ParkingSlot) {
    if (slot.status == 'Occupied') {
      this.selectedSlot = slot;
      const slotReleaseModal = document.getElementById('slotReleaseModal');
      if (slotReleaseModal) {
        const bootstrapModal = new (window as any).bootstrap.Modal(
          slotReleaseModal
        );
        bootstrapModal.show();
      }
    }
  }

  // On Release slot
  onReleaseSlot() {
    if (this.selectedSlot) {
      this.parkingService.releaseSlot(this.selectedSlot.id);

      // Close modal after booking
      const modalEl = document.getElementById('slotReleaseModal');
      if (modalEl) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(
          modalEl
        );
        modalInstance.hide();
      }

      this.selectedSlot = null;
    }
  }
}
