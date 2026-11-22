import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Package, Truck, ShieldCheck, Headphones, ArrowRight } from 'lucide-react';

interface TelemetryRow {
  icon: typeof Package;
  title: string;
  subtitle: string;
  to: string;
  isCountUp?: boolean;
}

const TELEMETRY_ITEMS: TelemetryRow[] = [
  {
    icon: Package,
    title: '30,000+',
    subtitle: 'Parts in Stock',
    to: '/shop',
    isCountUp: true,
  },
  {
    icon: Truck,
    title: 'Fast UAE Delivery',
    subtitle: 'Across All Emirates',
    to: '/shop',
  },
  {
    icon: ShieldCheck,
    title: 'Warranty Support',
    subtitle: 'Genuine & tested parts',
    to: '/warranty',
  },
  {
    icon: Headphones,
    title: 'Expert Assistance',
    subtitle: 'Help to find the right part',
    to: '/support',
  },
];

export default function HeroTelemetryCard() {
  const [displayCount, setDisplayCount] = useState('0');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const countTarget = { val: 0 };
    const ctx = gsap.context(() => {
      // Smooth numeric roll-up for 30,000+
      gsap.to(countTarget, {
        val: 30000,
        duration: 1.4,
        ease: 'power3.out',
        onUpdate: () => {
          setDisplayCount(Math.floor(countTarget.val).toLocaleString() + '+');
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardRef} className="h-full w-full">
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[4px] border border-[#1A2B49] bg-[#071936] p-5 shadow-2xl transition-all duration-300 hover:border-[#2B85FF]/50">
        {/* Header Strip */}
        <div className="mb-4 flex items-center justify-between border-b border-[#1A2B49] pb-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#2B85FF]">
            <ShieldCheck className="h-4 w-4" />
            <span>Telemetry</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[10px] font-bold text-emerald-400 tracking-wider">
              LIVE INVENTORY
            </span>
          </div>
        </div>

        {/* 4 Interactive Telemetry Rows with Guaranteed 100% Visibility & High Contrast */}
        <div className="flex flex-1 flex-col justify-between space-y-2.5">
          {TELEMETRY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.subtitle}
                to={item.to}
                className="telemetry-row group relative flex items-center justify-between overflow-hidden rounded-[3px] border border-[#1A2B49]/80 bg-[#051329]/80 p-3 transition-all duration-200 hover:border-[#0B63F6] hover:bg-[#051329]"
              >
                {/* Left 2px Cobalt Accent Indicator */}
                <span className="absolute left-0 top-0 bottom-0 w-0 bg-[#0B63F6] transition-all duration-200 group-hover:w-[3px]" />

                <div className="flex items-center gap-3.5 pl-1">
                  {/* Illuminating Icon Box */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] border border-[#1A2B49] bg-[#071936] text-[#2B85FF] transition-all duration-200 group-hover:border-[#0B63F6] group-hover:bg-[#0B63F6] group-hover:text-white group-hover:shadow-[0_0_12px_rgba(11,99,246,0.5)]">
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <div>
                    <div className="font-display text-sm font-extrabold tracking-tight text-white transition-colors group-hover:text-[#2B85FF]">
                      {item.isCountUp ? displayCount : item.title}
                    </div>
                    <div className="font-mono text-[11px] font-medium text-[#CAD5E3]">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {/* Micro-Interaction Arrow */}
                <div className="mr-1 text-[#2B85FF] opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
