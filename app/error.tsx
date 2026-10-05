"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center p-8 text-center">
      <div>
        <h1 className="font-display text-5xl">Something went wrong</h1>
        <p className="mt-3 text-muted">Please try again — if it keeps happening, message us on WhatsApp.</p>
        <button onClick={reset} className="btn btn-ink mt-8">Try again</button>
      </div>
    </div>
  );
}
