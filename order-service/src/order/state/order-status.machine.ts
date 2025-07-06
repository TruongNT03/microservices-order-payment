import { OrderStatus } from 'src/commom/constants/order-status.enum';

export enum OrderEvents {
  CONFIRM = 'confirm',
  CANCEL = 'cancel',
  DELIVER = 'deliver',
}

const transitionMap: Record<
  OrderStatus,
  Partial<Record<OrderEvents, OrderStatus>>
> = {
  [OrderStatus.CREATED]: {
    cancel: OrderStatus.CANCELLED,
    confirm: OrderStatus.CONFIRMED,
  },
  [OrderStatus.CONFIRMED]: {
    deliver: OrderStatus.DELIVERED,
    cancel: OrderStatus.CANCELLED,
  },
  [OrderStatus.DELIVERED]: {},
  [OrderStatus.CANCELLED]: {},
};

export const getNextState = (current: OrderStatus, event: OrderEvents) => {
  const next = transitionMap[current][event];
  if (!next) {
    throw new Error(`Không thể chuyển từ trạng thái ${current} sang ${event}`);
  }
  return next;
};
