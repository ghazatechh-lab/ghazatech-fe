import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

export interface SchematicPart {
  id: string;
  title: string;
  subtitle: string;
  specs: string;
  telemetryReadout: string;
  categoryQuery: string;
  hotspot: { x: number; y: number };
  calloutText: string;
}

const SCHEMATIC_PARTS: SchematicPart[] = [
  {
    id: 'motherboard',
    title: 'MOTHERBOARD',
    subtitle: '8-LAYER PCB',
    specs: '8-LAYER HIGH FREQUENCY',
    telemetryReadout: '[FRU: 5B20W27654 // IN STOCK DUBAI]',
    categoryQuery: 'Motherboard',
    hotspot: { x: 46, y: 75 },
    calloutText: 'MOTHERBOARD // CHIPSET VERIFIED',
  },
  {
    id: 'battery',
    title: 'BATTERY PACK',
    subtitle: '68Wh // 11.4V',
    specs: 'LI-ION 4-CELL 68Wh',
    telemetryReadout: '[PART: 4GVGH // 100% HEALTH GRADE-A]',
    categoryQuery: 'Battery',
    hotspot: { x: 65, y: 70 },
    calloutText: 'LI-ION 4-CELL // 11.4V DUAL-FUSE',
  },
  {
    id: 'cooling',
    title: 'COOLING FAN',
    subtitle: 'COPPER PIPE',
    specs: 'CENTRIFUGAL COPPER',
    telemetryReadout: '[THERMAL: 35dB ULTRA-QUIET // PWM]',
    categoryQuery: 'Fan',
    hotspot: { x: 72, y: 42 },
    calloutText: 'CENTRIFUGAL BRUSHLESS // COPPER PIPE',
  },
  {
    id: 'memory',
    title: 'KEYBOARD & RAM',
    subtitle: 'GEN4 7000MB/s',
    specs: 'PCIE 4.0 NVMe + DDR4/DDR5',
    telemetryReadout: '[SPEED: DDR4/DDR5 & M.2 NVMe]',
    categoryQuery: 'Keyboard',
    hotspot: { x: 26, y: 60 },
    calloutText: 'BACKLIT KEYBOARD & RAM // OEM',
  },
];

export default function HeroHardwareSchematic() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const laserRef = useRef<HTMLDivElement>(null);

  const activePart = SCHEMATIC_PARTS[activeIdx];

  // Auto-cycle through components every 3.5s unless paused by user interaction
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SCHEMATIC_PARTS.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Entrance Choreography & Desktop Gyroscope Tilt
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Blue L-shaped registration brackets snap inward
      gsap.from('.schematic-bracket', {
        scale: 1.25,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      });

      // 2. Cobalt Blue horizontal diagnostic laser scan line
      if (laserRef.current && imageRef.current) {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.set(laserRef.current, { top: '0%', opacity: 1 })
          .set(imageRef.current, { scale: 1.04, opacity: 0.85 })
          .to(laserRef.current, {
            top: '100%',
            duration: 0.9,
            ease: 'power2.inOut',
          })
          .to(
            imageRef.current,
            {
              scale: 1.0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
            },
            '-=0.4'
          )
          .to(laserRef.current, {
            opacity: 0,
            duration: 0.2,
          });
      }

      // 3. Desktop 3D Gyroscope Perspective Tilt (>= 1024px)
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        if (!stageRef.current || !imageRef.current) return;

        const stage = stageRef.current;
        const img = imageRef.current;

        const rotX = gsap.quickTo(stage, 'rotationX', { duration: 0.45, ease: 'power2.out' });
        const rotY = gsap.quickTo(stage, 'rotationY', { duration: 0.45, ease: 'power2.out' });
        const moveX = gsap.quickTo(img, 'x', { duration: 0.45, ease: 'power2.out' });
        const moveY = gsap.quickTo(img, 'y', { duration: 0.45, ease: 'power2.out' });

        const handleMouseMove = (e: MouseEvent) => {
          const rect = stage.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;

          rotX(-normY * 6); // Max ±3 deg tilt
          rotY(normX * 6);
          moveX(normX * 10); // Subtle micro parallax
          moveY(normY * 10);
        };

        const handleMouseLeave = () => {
          rotX(0);
          rotY(0);
          moveX(0);
          moveY(0);
        };

        stage.addEventListener('mousemove', handleMouseMove);
        stage.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          stage.removeEventListener('mousemove', handleMouseMove);
          stage.removeEventListener('mouseleave', handleMouseLeave);
        };
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full items-center justify-center"
      style={{ perspective: '1100px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={stageRef}
        className="relative flex h-full w-full flex-col justify-between rounded-[4px] border border-[#1A2B49] bg-[#071936] p-4 sm:p-5 shadow-2xl transition-shadow duration-300 hover:border-[#2B85FF]/70"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* L-Shaped Corner Registration Brackets */}
        <div className="schematic-bracket pointer-events-none absolute -left-1.5 -top-1.5 h-3.5 w-3.5 border-l-2 border-t-2 border-[#2B85FF]" />
        <div className="schematic-bracket pointer-events-none absolute -right-1.5 -top-1.5 h-3.5 w-3.5 border-r-2 border-t-2 border-[#2B85FF]" />
        <div className="schematic-bracket pointer-events-none absolute -bottom-1.5 -left-1.5 h-3.5 w-3.5 border-b-2 border-l-2 border-[#2B85FF]" />
        <div className="schematic-bracket pointer-events-none absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 border-b-2 border-r-2 border-[#2B85FF]" />

        {/* Top Header: Live Telemetry Monospace Readout + Direct Category Quick Jump */}
        <div className="mb-3 flex items-center justify-between border-b border-[#1A2B49] pb-2.5 font-mono text-[10px]">
          <div className="flex items-center gap-2 text-[#2B85FF]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2B85FF] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0B63F6]" />
            </span>
            <span className="font-bold tracking-tight text-white sm:text-[11px]">
              {activePart.telemetryReadout}
            </span>
          </div>

          <Link
            to={`/shop?category=${encodeURIComponent(activePart.categoryQuery)}`}
            className="flex items-center gap-1 rounded-[2px] bg-[#0B63F6]/25 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-[#7DD3FC] border border-[#0B63F6]/50 transition-colors hover:bg-[#0B63F6] hover:text-white"
            title={`View ${activePart.title} in shop`}
          >
            <span>VIEW PARTS</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Center Hardware Viewport with Interactive Hotspots (Major Height) */}
        <div className="relative flex min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] flex-1 w-full items-center justify-center overflow-hidden rounded-[2px] border border-[#162744] bg-[#051329] p-2">
          {/* Diagnostic 1px Laser Scan Line */}
          <div
            ref={laserRef}
            className="pointer-events-none absolute left-0 right-0 z-30 h-[1.5px] bg-[#2B85FF] shadow-[0_0_12px_#2B85FF]"
            style={{ opacity: 0 }}
          />

          {/* Background CAD Coordinate Overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-10 cad-grid" />
          <div className="pointer-events-none absolute right-3 top-2.5 font-mono text-[9px] font-semibold text-[#8A9EB5]">
            SCALE 1:1 // ±0.05mm
          </div>

          {/* Hardware Visual Matching Attached Reference Screenshot */}
          <img
            ref={imageRef}
            src="/images/hero-reference-hardware.webp"
            alt="Laptop spare parts 3D floating visual"
            className="h-full w-full object-contain pointer-events-none select-none transition-transform duration-300"
          />

          {/* Interactive Component Target Rings & Callouts */}
          {SCHEMATIC_PARTS.map((part, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div
                key={part.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                style={{ left: `${part.hotspot.x}%`, top: `${part.hotspot.y}%` }}
              >
                {/* Clickable Target Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveIdx(idx);
                    setIsPaused(true);
                  }}
                  onMouseEnter={() => {
                    setActiveIdx(idx);
                    setIsPaused(true);
                  }}
                  aria-label={`Inspect ${part.title}`}
                  className="group relative flex h-8 w-8 items-center justify-center focus:outline-none"
                >
                  {/* Outer Pulsing Wave Ring */}
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full transition-opacity ${
                      isActive
                        ? 'animate-ping bg-[#2B85FF] opacity-40'
                        : 'bg-white opacity-20 group-hover:opacity-40'
                    }`}
                  />

                  {/* Target Circle Frame */}
                  <span
                    className={`relative flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                      isActive
                        ? 'border-[#2B85FF] bg-[#0B63F6] text-white shadow-[0_0_12px_#0B63F6]'
                        : 'border-white/50 bg-[#071936]/80 text-[#8A9EB5] group-hover:border-[#2B85FF] group-hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold leading-none">+</span>
                  </span>
                </button>

                {/* Active HUD Floating Callout Badge */}
                {isActive && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[2px] border border-[#2B85FF] bg-[#071936]/95 px-2.5 py-1 text-center font-mono text-[10px] font-bold text-white shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{part.calloutText}</span>
                    </div>
                    {/* Downward Pointer Notch */}
                    <div className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border-b border-r border-[#2B85FF] bg-[#071936]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom 4-Column Spec Switcher Tabs */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 font-mono text-[10px]">
          {SCHEMATIC_PARTS.map((part, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={part.id}
                type="button"
                onClick={() => {
                  setActiveIdx(idx);
                  setIsPaused(true);
                }}
                onMouseEnter={() => {
                  setActiveIdx(idx);
                  setIsPaused(true);
                }}
                className={`flex flex-col items-center justify-center rounded-[2px] border px-2 py-2 text-center transition-all ${
                  isActive
                    ? 'border-[#2B85FF] bg-[#0B63F6]/25 text-white shadow-[0_0_12px_rgba(43,133,255,0.3)]'
                    : 'border-[#1A2B49] bg-[#051329] text-[#CAD5E3] hover:border-[#2B85FF]/50 hover:text-white'
                }`}
              >
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    isActive ? 'text-[#2B85FF]' : 'text-white'
                  }`}
                >
                  {part.title}
                </span>
                <span className="mt-0.5 whitespace-nowrap font-mono text-[9px] font-medium text-[#8A9EB5]">
                  {part.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
