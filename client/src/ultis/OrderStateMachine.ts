import type { OrderEvent } from "@/services/Order";

export const getNextState = (
  currentState: "created" | "confirmed" | "delivered" | "cancelled"
): Array<OrderEvent> => {
  switch (currentState) {
    case "created":
      return [{ event: "cancel" }, { event: "confirm" }];

    case "confirmed":
      return [{ event: "cancel" }, { event: "payment" }];

    case "delivered":
      return [];

    case "cancelled":
      return [];

    default:
      return [];
  }
};
