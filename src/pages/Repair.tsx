import { useToast } from '../components/ui/ToastProvider';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Wrench,
  MonitorX,
  ClipboardList,
  Search,
  FileText,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { submitRepairRequest } from '../lib/api';
import { REPAIR_TYPE_LABELS, type RepairType } from '../lib/types';
import Reveal from '../components/Reveal';

const STEPS = [
  { icon: ClipboardList, title: 'Submit request', text: 'Tell us what you need.' },
  { icon: Search, title: 'Diagnosis', text: 'We inspect and check parts.' },
  { icon: FileText, title: 'Quotation', text: 'You approve the price first.' },
  { icon: Wrench, title: 'Repair', text: 'Fixed by our technicians.' },
  { icon: CheckCircle2, title: 'Collection', text: 'Pick up or get it delivered.' },
];

const TYPE_ICONS: Record<RepairType, typeof Package> = {
  part: Package,
  install: Wrench,
  repair: MonitorX,
};

export default function Repair() {
  const toast=useToast();
  const [type, setType] = useState<RepairType>('repair');
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', laptopModel: '', issue: '' });
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const ref = await submitRepairRequest({ ...form, requestType: type });
      setReference(ref);toast.success('Repair request submitted', `Reference: ${ref}`);
    } catch {
      setError('Something went wrong sending your request. Please try again or contact us.');
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <div className="container-x flex flex-col items-center py-24 text-center animate-fade-in">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink-950">Request received</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
          Keep this reference number to track your job online:
        </p>
        <div className="mt-5 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50 px-8 py-4 font-display text-2xl font-bold tracking-wider text-brand-800">
          {reference}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={`/track?ref=${reference}`} className="btn-primary">
            Track this request
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="https://wa.me/971563840130"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Us
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <section className="bg-ink-950 py-14">
        <div className="container-x">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Repair, replacement or diagnosis.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-300">
            Start with what you need. We will check part availability first when required, then
            guide you through booking, diagnosis, quotation, repair and collection.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="border-b border-ink-100 bg-white">
        <div className="container-x grid grid-cols-2 gap-6 py-10 md:grid-cols-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 120} variant="up">
              <div className="group flex flex-col items-center text-center">
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                  <s.icon className="h-5 w-5" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white transition group-hover:scale-125">
                    {i + 1}
                  </span>
                </span>
                <div className="mt-3 text-sm font-semibold text-ink-900">{s.title}</div>
                <div className="mt-0.5 text-xs text-ink-400">{s.text}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="container-x grid gap-10 py-14 lg:grid-cols-2 lg:gap-16">
        <Reveal variant="left">
          <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink-950">
            What can we help you with?
          </h2>
          <p className="mt-2 text-sm text-ink-500">Choose the option that matches your situation.</p>
          <div className="mt-6 space-y-3">
            {(Object.keys(REPAIR_TYPE_LABELS) as RepairType[]).map((t) => {
              const Icon = TYPE_ICONS[t];
              const active = type === t;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                    active
                      ? 'border-brand-600 bg-brand-50/60 shadow-sm'
                      : 'border-ink-100 bg-white hover:border-brand-200'
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-300 ${
                      active ? 'scale-110 bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink-900">
                      {REPAIR_TYPE_LABELS[t].title}
                    </span>
                    <span className="mt-1 block text-sm text-ink-500">
                      {REPAIR_TYPE_LABELS[t].description}
                    </span>
                  </span>
                  <span
                    className={`ml-auto mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                      active ? 'border-brand-600 bg-brand-600 ring-2 ring-brand-200' : 'border-ink-300'
                    }`}
                  />
                </button>
            );
            })}
          </div>
        </div>
        </Reveal>

        <Reveal variant="right">
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink-950">Booking details</h2>
            <p className="mt-1 text-sm text-ink-500">
              After submitting, keep the repair reference number to track progress online.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="name">Full name *</label>
                  <input id="name" required value={form.customerName} onChange={set('customerName')} className="input" placeholder="Ahmed Ali" />
                </div>
                <div>
                  <label className="label" htmlFor="phone">Phone *</label>
                  <input id="phone" required value={form.phone} onChange={set('phone')} className="input" placeholder="+971 5X XXX XXXX" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="email">Email (optional)</label>
                <input id="email" type="email" value={form.email} onChange={set('email')} className="input" placeholder="you@example.com" />
              </div>
              <div>
                <label className="label" htmlFor="model">Laptop brand & model *</label>
                <input id="model" required value={form.laptopModel} onChange={set('laptopModel')} className="input" placeholder="e.g. Dell Latitude 5420" />
              </div>
              <div>
                <label className="label" htmlFor="issue">
                  {type === 'part' ? 'Which part do you need? *' : type === 'install' ? 'Installation notes' : 'Describe the problem *'}
                </label>
                <textarea
                  id="issue"
                  required={type !== 'install'}
                  value={form.issue}
                  onChange={set('issue')}
                  rows={4}
                  className="input resize-none"
                  placeholder={
                    type === 'part'
                      ? 'e.g. Replacement keyboard, US layout'
                      : type === 'install'
                        ? 'Anything we should know before installation'
                        : 'e.g. Screen flickers, laptop shuts down randomly, battery not charging...'
                  }
                />
              </div>
              {error && (
                <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}
              <button type="submit" disabled={submitting} className="btn-primary w-full transition hover:scale-[1.02]">
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Submitting...
                  </>
                ) : (
                  'Submit Repair Request'
                )}
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
