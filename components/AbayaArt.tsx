import { useId } from "react";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Procedural abaya illustration — used wherever a product has no photo yet,
 * so the store always looks finished. Colour + detailing derive from the product.
 */
export default function AbayaArt({
  color = "#141414",
  seed = "anaya",
  className = "",
}: {
  color?: string;
  seed?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const h = hash(seed);
  const openFront = h % 3 === 0;
  const embroidered = h % 2 === 0;
  const archTint = `color-mix(in srgb, ${color} 14%, transparent)`;

  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      role="img"
      aria-label="Abaya illustration"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`g${uid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={`f${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* mihrab arch */}
      <path d="M36 400V150a114 114 0 0 1 228 0v250Z" fill={archTint} />
      <path
        d="M52 400V152a98 98 0 0 1 196 0v248"
        fill="none"
        stroke="var(--gold)"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      {/* hijab */}
      <path
        d="M150 52c-24 0-38 18-38 42 0 14 4 24 8 32l30 8 30-8c4-8 8-18 8-32 0-24-14-42-38-42Z"
        fill={color}
      />
      <path d="M150 52c-24 0-38 18-38 42 0 14 4 24 8 32l30 8 30-8c4-8 8-18 8-32 0-24-14-42-38-42Z" fill={`url(#g${uid})`} />
      {/* body + sleeves */}
      <path
        d="M150 118c-22 0-34 8-40 22L56 292q12 12 38 6l30-108-30 198q56 12 112 0l-30-198 30 108q26 6 38-6l-54-152c-6-14-18-22-40-22Z"
        fill={color}
      />
      <path
        d="M150 118c-22 0-34 8-40 22L56 292q12 12 38 6l30-108-30 198q56 12 112 0l-30-198 30 108q26 6 38-6l-54-152c-6-14-18-22-40-22Z"
        fill={`url(#g${uid})`}
      />
      <path d="M96 392q54 12 108 0V300H96Z" fill={`url(#f${uid})`} />
      {/* placket / open front */}
      {openFront ? (
        <path d="M150 124 L136 396 M150 124 L164 396" stroke="#000" strokeOpacity="0.35" strokeWidth="1.6" fill="none" />
      ) : (
        <path d="M150 128V394" stroke="#fff" strokeOpacity="0.14" strokeWidth="1.2" />
      )}
      {/* cuffs */}
      <path d="M58 286q18 8 36 4M242 286q-18 8-36 4" stroke="var(--gold)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {embroidered && (
        <g stroke="var(--gold)" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.9">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(0 ${i * 16})`}>
              <path d={`M${72 + i * 3} ${236} q8 -9 16 0 q-8 9 -16 0`} />
              <path d={`M${228 - i * 3} ${236} q-8 -9 -16 0 q8 9 16 0`} />
            </g>
          ))}
          <path d="M150 300q-10 10 0 20q10-10 0-20M150 330q-10 10 0 20q10-10 0-20M150 360q-10 10 0 20q10-10 0-20" />
        </g>
      )}
      {/* belt line */}
      <path d="M120 196q30 8 60 0" stroke="#fff" strokeOpacity="0.12" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
