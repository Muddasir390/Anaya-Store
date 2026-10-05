import type { Metadata } from "next";
import TrackForm from "@/components/TrackForm";

export const metadata: Metadata = { title: "Track your order" };

export default function TrackPage() {
  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-xl">
        <p className="eyebrow">Where is my abaya?</p>
        <h1 className="mt-3 font-display text-5xl font-medium md:text-6xl">Track order</h1>
        <p className="mt-4 text-muted">Enter the order number from your confirmation and the phone number you ordered with.</p>
        <TrackForm />
      </div>
    </div>
  );
}
