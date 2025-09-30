import { Pipe, PipeTransform } from '@angular/core';
import { ParkingSlot } from '../models/parking-slot.model';

@Pipe({
  name: 'occupiedSlots'
})
export class OccupiedSlotsPipe implements PipeTransform {

  transform(slots: ParkingSlot[]): ParkingSlot[] {
    return slots.filter(slot => slot.status === 'Occupied');
  }

}
