export interface ParkingSlot {
    id: string;
    status: 'Available' | 'Occupied' | 'Maintanance' | 'Reserved';
    vehicleNumber?: string; // OPTIONAL
    bookedBy?: string; // OPTIONAL
}