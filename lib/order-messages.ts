import { money } from "./format";
import type { Order, OrderItem, OrderStatus } from "./types";

type Line = Pick<OrderItem, "name" | "quantity" | "size" | "color" | "price">;

const lines = (items: Line[]) =>
  items
    .map(
      (i) =>
        `• ${i.name} ×${i.quantity}${i.size ? ` (Size ${i.size}` : ""}${i.color ? `${i.size ? ", " : " ("}${i.color}` : ""}${i.size || i.color ? ")" : ""} — ${money(i.price * i.quantity)}`,
    )
    .join("\n");

/** Message the CUSTOMER sends to the store right after ordering. */
export function customerToStoreMessage(o: Pick<Order, "order_number" | "customer_name" | "total" | "address" | "city">, items: Line[]) {
  return `Hello Anaya! 👋 I just placed order ${o.order_number}.\n\n${lines(items)}\n\nTotal: ${money(o.total)}\nName: ${o.customer_name}\nDeliver to: ${o.address}, ${o.city}\n\nPlease confirm my order. Thank you!`;
}

const statusLine: Record<OrderStatus, string> = {
  pending: "We've received your order and will confirm it shortly.",
  confirmed: "Your order is confirmed ✅ — we're getting it ready.",
  processing: "Your abaya is being prepared and quality-checked.",
  shipped: "Your order has been shipped 🚚 and is on its way to you.",
  delivered: "Your order has been delivered 🎉 — we hope you love it!",
  cancelled: "Your order has been cancelled. Message us if you'd like to reorder.",
};

/** Message the STORE (admin) sends to the customer — opened from the admin panel. */
export function storeToCustomerMessage(o: Order, items: Line[]) {
  return `Assalamu alaikum ${o.customer_name},\n\nThis is Anaya Abayas regarding order ${o.order_number}.\n${statusLine[o.status]}\n\n${lines(items)}\n\nTotal: ${money(o.total)} (${o.payment_method === "cod" ? "Cash on delivery" : o.payment_method})\n\nThank you for shopping with us 🤍`;
}
