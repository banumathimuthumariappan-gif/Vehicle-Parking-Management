import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ParkingSlot } from '../../models/parking-slot.model';
import { ParkingServiceService } from '../../services/parking-service.service';
import { AvailableSlotsPipe } from '../../pipes/available-slots.pipe';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-entry-gate-dashboard',
  imports: [NgIf, NgFor, NgClass, AvailableSlotsPipe, ReactiveFormsModule],
  templateUrl: './entry-gate-dashboard.component.html',
  styleUrl: './entry-gate-dashboard.component.css',
})
export class EntryGateDashboardComponent {
  slots: ParkingSlot[] = [];
  availableCount: number = 0;
  selectedSlot: ParkingSlot | null = null;
  message: string = '';
  slotBookingForm!: FormGroup;

  constructor(
    private parkingService: ParkingServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.parkingService.slots$.subscribe({
      next: (data) => {
        this.slots = data;
        this.availableCount = this.parkingService.getAvailableCount();
      },
      error: (error) => {
        console.log('Error in getting slots');
      },
    });

    // Initializing Slot Booking Form
    this.slotBookingForm = this.fb.group({
      vehicleNumber: ['', Validators.required],
      bookedName: [''],
    });
  }

  // On Clicking Slot booking card
  onSlotClicked(slot: ParkingSlot) {
    if (slot.status === 'Available') {
      this.selectedSlot = slot;
      const slotBookingModal = document.getElementById('slotBookingModal');
      if (slotBookingModal) {
        const bootstrapModal = new (window as any).bootstrap.Modal(
          slotBookingModal
        );
        bootstrapModal.show();
      }
    } else if (slot.status == 'Occupied') {
      this.selectedSlot = slot;
      const slotReleaseModal = document.getElementById('slotReleaseModal');
      if (slotReleaseModal) {
        const bootstrapModal = new (window as any).bootstrap.Modal(
          slotReleaseModal
        );
        bootstrapModal.show();
      }
    } else {
      alert(`Slot ${slot.id} is ${slot.status}, not available for booking`);
    }
  }

  //  On clicking Book Slot button in Modal
  onBookSlot() {
    console.log('Slot booking');

    if (this.slotBookingForm.valid && this.selectedSlot) {
      const vehicle = this.slotBookingForm.value.vehicleNumber;
      const bookingPerson = this.slotBookingForm.value.bookedName;

      this.parkingService.bookSlot(
        this.selectedSlot.id,
        vehicle,
        bookingPerson
      );

      // Close modal after booking
      const modalEl = document.getElementById('slotBookingModal');
      if (modalEl) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(
          modalEl
        );
        modalInstance.hide();
      }

      // Reset form
      this.slotBookingForm.reset();
      this.selectedSlot = null;
    }
  }
}
