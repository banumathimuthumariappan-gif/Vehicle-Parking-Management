import { Component } from '@angular/core';
import { ParkingSlot } from '../../models/parking-slot.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ParkingServiceService } from '../../services/parking-service.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AvailableSlotsPipe } from '../../pipes/available-slots.pipe';
import { AuthServiceService } from '../../services/auth-service.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-dashboard',
  imports: [NgIf, NgFor, NgClass, ReactiveFormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent {
  slots: ParkingSlot[] = [];
  availableCount: number = 0;
  selectedSlot: ParkingSlot | null = null;
  message: string = '';
  slotBookingForm!: FormGroup;
  filteredSlots: ParkingSlot[] = [];
  currentUser: User | null = null;
  currentUserName: string = '';

  constructor(
    private parkingService: ParkingServiceService,
    private fb: FormBuilder,
    private authService: AuthServiceService
  ) {}

  ngOnInit() {
    this.updatingCurentUser();
    this.parkingService.slots$.subscribe({
      next: (data) => {
        this.slots = data;
        this.availableCount = this.parkingService.getAvailableCount();
        
        this.updateFilteredSlots();
      },
      error: (error) => {
        console.log('Error in getting slots');
      },
    });

    // Initializing Slot Booking Form
    this.slotBookingForm = this.fb.group({
      vehicleNumber: ['', Validators.required],
      bookedName: [this.currentUserName],
    });
  }

  updatingCurentUser() {
    const user = this.authService.getCurrentUser();
    if(user) {
      this.currentUserName = user.userName;
    }
  }

  updateFilteredSlots() {
    this.filteredSlots = this.slots.filter(
      (slot) =>
        slot.status === 'Available' || slot.bookedBy === this.currentUserName
    );
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
      const bookingPerson = this.currentUserName;

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
}
