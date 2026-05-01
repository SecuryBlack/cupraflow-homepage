"use client";

export function PulseAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 400 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full opacity-80"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pulse-fade-left" x1="0%" y1="0%" x2="30%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="pulse-fade-right" x1="70%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* flat line left */}
        <path
          d="M 0,40 L 100,40"
          stroke="url(#pulse-fade-left)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* ECG spike */}
        <path
          d="M 100,40 L 130,40 L 145,10 L 160,70 L 175,40 L 200,40 L 215,22 L 230,58 L 245,40 L 270,40 L 280,20 L 290,60 L 300,40 L 300,40"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          className="pulse-line"
        />
        {/* flat line right */}
        <path
          d="M 300,40 L 400,40"
          stroke="url(#pulse-fade-right)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* live dot */}
        <circle cx="300" cy="40" r="4" fill="#3B82F6" filter="url(#glow)" className="pulse-dot" />
        <circle cx="300" cy="40" r="8" fill="#3B82F6" fillOpacity="0.2" className="pulse-ring" />
      </svg>

      <style>{`
        .pulse-line {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: drawLine 2s ease forwards, pulseLoop 4s ease-in-out 2s infinite;
        }
        .pulse-dot {
          animation: dotAppear 2s ease forwards;
          opacity: 0;
        }
        .pulse-ring {
          animation: ringPulse 2s ease 2s infinite;
          opacity: 0;
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulseLoop {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes dotAppear {
          0%, 80% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes ringPulse {
          0% { r: 6; opacity: 0.4; }
          100% { r: 18; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
