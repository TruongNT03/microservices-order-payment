import { OrderEvents } from '../state/order-status.machine';

export class UpdateOrderDto {
  event: OrderEvents;
}
