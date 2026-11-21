import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Users, Wrench, ArrowRight, MapPin, Star } from 'lucide-react';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Quality first',
    text: 'Every part is inspected and tested before it leaves our warehouse.',
  },
  {
    icon: Users,
    title: 'For everyone',
    text: 'Repair centres, businesses, resellers and individual customers — same honest service.',
  },
  {
    icon: Wrench,
    title: 'Real expertise',
    text: 'Our team helps identify the exact compatible part before you order.',
  },
];

const STATS = [
  { value: <CountUp end={30000} suffix="+" />, label: 'Parts in stock' },
  { value: <CountUp end={6} suffix="+" />, label: 'Major brands supported' },
  { value: 'UAE-wide', label: 'Delivery coverage' },
  { value: <CountUp end={13} />, label: 'Part categories' },
];

export default function About() {
  return (
    <div className="animate-fade-in">
      <section className="bg-ink-950 py-16">
        <div className="container-x max-w-3xl">
          <span className="badge border border-brand-400/30 bg-brand-500/10 text-brand-300">
            <Building2 className="h-3.5 w-3.5" />
            About us
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            The laptop parts specialists in Sharjah
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-300">
            Ghaza Computer Trading LLC supplies high-quality laptop replacement parts and
            reliable repair solutions for leading brands. From our base on Second Industrial
            Street in Sharjah's Industrial Area, we support repair centres, businesses,
            resellers and individual customers across the whole UAE.
          </p>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} variant="scale">
              <div className="card p-6 text-center transition hover:-translate-y-1 hover:shadow-md">
                <div className="font-display text-3xl font-bold text-brand-700">{s.value}</div>
                <div className="mt-1 text-sm text-ink-500">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x pb-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950">
              What we stand for
            </h2>
            <div className="mt-8 space-y-4">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 100} variant="right">
                  <div className="flex items-start gap-4 rounded-2xl border border-ink-100 p-5 transition duration-300 hover:translate-x-1 hover:border-brand-200 hover:shadow-md">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-ink-900">{v.title}</div>
                    <div className="mt-1 text-sm leading-relaxed text-ink-500">{v.text}</div>
                  </div>
                </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-ink-950 p-8">
              <MapPin className="h-8 w-8 text-brand-400" />
              <h3 className="mt-4 font-display text-xl font-bold text-white">Visit or reach us</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                Second Industrial Street, Industrial Area 2, Sharjah, UAE — walk in for parts,
                drop off a laptop for repair, or call and we will deliver anywhere in the Emirates.
              </p>
              <Link to="/support" className="btn-primary mt-6">
                Get in touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="card p-8">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Trusted by repair centres and individual customers across the Emirates for
                quality-checked parts, honest advice and fast delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x pb-20">
        <Reveal variant="scale">
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 px-8 py-14 text-center sm:px-14">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 animate-blob rounded-full bg-brand-400/20 blur-3xl" />
            <div
              className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 animate-blob rounded-full bg-brand-300/15 blur-3xl"
              style={{ animationDelay: '-7s' }}
            />
            <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">
              Ready to find your part?
            </h2>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/shop"
                className="btn-primary bg-white text-brand-800 transition hover:scale-105 hover:bg-brand-50 hover:shadow-xl"
              >
                Shop Spare Parts
              </Link>
              <Link
                to="/repair"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:bg-white/10"
              >
                Book a Repair
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
