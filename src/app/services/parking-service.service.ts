import { Injectable } from '@angular/core';
import { ParkingSlot } from '../models/parking-slot.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ParkingServiceService {
  private slots: ParkingSlot[] = [];
  private slotsSubject = new BehaviorSubject<ParkingSlot[]>([]);
  slots$ = this.slotsSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedSlots = localStorage.getItem('parkingSlots');
    if (savedSlots) {
      this.slots = JSON.parse(savedSlots);
      this.slotsSubject.next(this.slots);
    } else {
      this.loadSlots(); // fallback if nothing in storage
    }

    // Listen for updates from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === 'parkingSlotsRefresh') {
        const updatedSlots = localStorage.getItem('parkingSlots');
        if (updatedSlots) {
          this.slots = JSON.parse(updatedSlots);
          this.slotsSubject.next(this.slots);
        }
      }
    });
  }

  // Load slots from JSON file (assets/slots.json)
  private loadSlots(): void {
    this.http.get<ParkingSlot[]>('/assets/slots.json').subscribe((data) => {
      this.slots = data;
      this.slotsSubject.next(this.slots);
      console.log(this.slots);
    });
  }

  // Returns the observable of all slots
  getSlots(): Observable<ParkingSlot[]> {
    return this.slots$;
  }

  // Returns the count of Available slots
  getAvailableCount() {
    return this.slots.filter((slot) => slot.status == 'Available').length;
  }

  // Returns the count of Occupied slots
  getOccupiedCount() {
    return this.slots.filter((slot) => slot.status == 'Occupied').length;
  }

  // Returns the Occupancy Rate
  getOccupancyRate() {
    const totalSlots = this.slots.length;
    if (totalSlots === 0) return 0;
    return (this.getOccupiedCount() / totalSlots) * 100;
  }

  // Book (Park) a slot
  bookSlot(slotId: string, vehicleNumber: string, bookedName: string): boolean {
    const slot = this.slots.find((slot) => slot.id === slotId);
    if (slot && slot.status === 'Available') {
      slot.status = 'Occupied';
      slot.vehicleNumber = vehicleNumber;
      slot.bookedBy = bookedName;
      this.slotsSubject.next([...this.slots]);
      this.saveSlotsToStorage();
      return true;
    }
    return false;
  }

  // Release (UnPark) a slot
  releaseSlot(slotId: string): boolean {
    const slot = this.slots.find((slot) => slot.id === slotId);
    if (slot && slot.status === 'Occupied') {
      slot.status = 'Available';
      slot.vehicleNumber = '';
      slot.bookedBy = '';
      this.slotsSubject.next([...this.slots]);
      this.saveSlotsToStorage();
      return true;
    }
    return false;
  }

  private saveSlotsToStorage() {
    localStorage.setItem('parkingSlots', JSON.stringify(this.slots));
    localStorage.setItem('parkingSlotsRefresh', Date.now().toString()); // trigger event
  }
}
