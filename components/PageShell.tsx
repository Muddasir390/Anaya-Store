import Reveal from "./Reveal";

export default function PageShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="container-x py-14">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 font-display text-5xl font-medium md:text-7xl">{title}</h1>
        <Reveal className="mt-10 space-y-6 leading-relaxed text-muted [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-fg [&_strong]:text-fg">
          {children}
        </Reveal>
      </div>
    </div>
  );
}
