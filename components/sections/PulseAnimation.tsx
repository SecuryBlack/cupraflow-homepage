"use client";

export function PulseAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 400 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full opacity-80"
        aria-hidden="true"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        <path d="M 200,40 L 120,90" stroke="var(--color-primary)" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
        <path d="M 200,40 L 200,95" stroke="var(--color-primary)" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
        <path d="M 200,40 L 280,90" stroke="var(--color-primary)" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />

        {/* Animated packets */}
        <circle r="3" fill="var(--color-primary)" filter="url(#glow)">
          <animateMotion dur="2s" repeatCount="indefinite" path="M 200,40 L 120,90" />
        </circle>
        <circle r="3" fill="var(--color-primary)" filter="url(#glow)">
          <animateMotion dur="1.5s" repeatCount="indefinite" path="M 200,40 L 200,95" />
        </circle>
        <circle r="3" fill="var(--color-primary)" filter="url(#glow)">
          <animateMotion dur="2.2s" repeatCount="indefinite" path="M 200,40 L 280,90" />
        </circle>

        {/* Central node - Load Balancer */}
        <circle cx="200" cy="40" r="14" fill="var(--color-bg)" stroke="var(--color-primary)" strokeWidth="2" filter="url(#glow)" />
        <text x="200" y="44" textAnchor="middle" fill="var(--color-primary)" fontSize="10" fontWeight="bold" fontFamily="var(--font-geist-sans), system-ui, sans-serif">LB</text>

        {/* Backend nodes */}
        <circle cx="120" cy="90" r="10" fill="var(--color-bg)" stroke="var(--color-primary)" strokeWidth="1.5" strokeOpacity="0.6" />
        <text x="120" y="113" textAnchor="middle" fill="var(--color-muted)" fontSize="8" fontFamily="var(--font-geist-sans), system-ui, sans-serif">NLB1</text>

        <circle cx="200" cy="95" r="10" fill="var(--color-bg)" stroke="var(--color-primary)" strokeWidth="1.5" strokeOpacity="0.6" />
        <text x="200" y="118" textAnchor="middle" fill="var(--color-muted)" fontSize="8" fontFamily="var(--font-geist-sans), system-ui, sans-serif">NLB2</text>

        <circle cx="280" cy="90" r="10" fill="var(--color-bg)" stroke="var(--color-primary)" strokeWidth="1.5" strokeOpacity="0.6" />
        <text x="280" y="113" textAnchor="middle" fill="var(--color-muted)" fontSize="8" fontFamily="var(--font-geist-sans), system-ui, sans-serif">NLB3</text>
      </svg>
    </div>
  );
}
