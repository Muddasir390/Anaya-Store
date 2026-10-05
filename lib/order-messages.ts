import { money } from "./format";
import type { TFn } from "./i18n";
import type { Key } from "./i18n";
import type { Order, OrderItem } from "./types";

type Line = Pick<OrderItem, "name" | "quantity" | "size" | "color" | "price">;

const lines = (items: Line[], t: TFn) =>
  items
    .map((i) => {
      const meta = [i.size && t("cart.size", { s: i.size }), i.color].filter(Boolean).join(", ");
      return `• ${i.name} ×${i.quantity}${meta ? ` (${meta})` : ""} — ${money(i.price * i.quantity)}`;
    })
    .join("\n");

/** Message the CUSTOMER sends to the store right after ordering (in the customer's language). */
export function customerToStoreMessage(o: Pick<Order, "order_number" | "customer_name" | "total" | "address" | "city">, items: Line[], t: TFn) {
  return [
    t("oc.waHello", { n: o.order_number }),
    "",
    lines(items, t),
    "",
    t("oc.waTotal", { total: money(o.total) }),
    t("oc.waName", { name: o.customer_name }),
    t("oc.waDeliver", { address: o.address, city: o.city }),
    "",
    t("oc.waClose"),
  ].join("\n");
}

/** Message the STORE (admin) sends to the customer — written in the language the customer ordered in. */
export function storeToCustomerMessage(o: Order, items: Line[], t: TFn) {
  return [
    t("wa.storeHello", { name: o.customer_name }),
    "",
    t("wa.storeRegarding", { n: o.order_number }),
    t(`status.msg.${o.status}` as Key),
    "",
    lines(items, t),
    "",
    t("wa.storeTotal", { total: money(o.total), method: o.payment_method === "cod" ? t("wa.cod") : o.payment_method }),
    "",
    t("wa.storeThanks"),
  ].join("\n");
}
