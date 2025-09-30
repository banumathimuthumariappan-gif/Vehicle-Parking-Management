import { Component } from '@angular/core';
import { ParkingSlot } from '../../models/parking-slot.model';
import { ParkingServiceService } from '../../services/parking-service.service';
import { DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports: [NgForOf, NgIf, NgClass, ReactiveFormsModule, DecimalPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  slots: ParkingSlot[] = [];
  totalSlots: number = 0;
  availableCount: number = 0;
  occupiedCount: number = 0;
  occupancyRate: number = 0;

  selectedSlot: ParkingSlot | null = null;
  message: string = '';
  slotBookingForm!: FormGroup;

  constructor(
    private parkingService: ParkingServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // Parking Slot Data
    this.parkingService.getSlots().subscribe({
      next: (data) => {
        this.slots = data;
        this.totalSlots = this.slots.length;
        this.availableCount = this.parkingService.getAvailableCount();
        this.occupiedCount = this.parkingService.getOccupiedCount();
        this.occupancyRate = this.parkingService.getOccupancyRate();
        console.log(this.availableCount);
        console.log(this.occupiedCount);
        console.log(this.occupancyRate);
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

  // refreshSlots() {
  //   const updatedSlots = localStorage.getItem('parkingSlots');
  //   if (updatedSlots) {
  //     this.slots = JSON.parse(updatedSlots);
  //     // this.slotsSubject.next(this.slots);

  //     this.availableCount = this.parkingService.getAvailableCount();
  //     this.occupiedCount = this.parkingService.getOccupiedCount();
  //     this.occupancyRate = this.parkingService.getOccupancyRate();
  //   }
  // }
}
