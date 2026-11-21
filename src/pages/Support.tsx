import { useState } from 'react';
import {
  Headset,
  PackageSearch,
  RotateCcw,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import { submitSupportTicket } from '../lib/api';
import Reveal from '../components/Reveal';

const SUPPORT_AREAS = [
  {
    icon: PackageSearch,
    title: 'Product Support',
    text: 'Find the correct part using the laptop model or part number.',
  },
  {
    icon: Headset,
    title: 'Order Support',
    text: 'Get assistance with an existing order or delivery.',
  },
  {
    icon: RotateCcw,
    title: 'Warranty & Returns',
    text: 'Request help with warranty, returns or replacement.',
  },
];

const SUBJECTS = ['Product enquiry', 'Order assistance', 'Warranty & returns', 'Repair request', 'Wholesale quotation', 'Other'];

export default function Support() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitSupportTicket(form);
      setSent(true);
    } catch {
      setError('Something went wrong sending your message. Please try again or call us.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <section className="bg-ink-950 py-14">
        <div className="container-x text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How can we help?
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-300">
            Contact Ghaza Computer for product enquiries, order assistance, warranty support,
            repairs, returns and wholesale quotations.
          </p>
        </div>
      </section>

      <div className="container-x grid gap-4 py-12 sm:grid-cols-3">
        {SUPPORT_AREAS.map((a, i) => (
          <Reveal key={a.title} delay={i * 120} variant="up">
            <div className="card group h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                <a.icon className="h-5 w-5" />
              </span>
            <h2 className="mt-4 font-display text-base font-bold text-ink-950">{a.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{a.text}</p>
          </div>
        </Reveal>
        ))}
      </div>

      <div className="container-x grid gap-10 pb-16 lg:grid-cols-[1fr_380px]">
        <div className="card p-6 sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center py-14 text-center animate-fade-up">
              <span className="flex h-14 w-14 animate-pop-in items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <h2 className="mt-5 font-display text-xl font-bold text-ink-950">Message sent</h2>
              <p className="mt-2 max-w-sm text-sm text-ink-500">
                Thank you. Our team will get back to you as soon as possible — usually within
                one business day.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold text-ink-950">Send a support request</h2>
              <p className="mt-1 text-sm text-ink-500">
                Complete the form and our team will contact you.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="s-name">Name *</label>
                    <input id="s-name" required value={form.name} onChange={set('name')} className="input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="label" htmlFor="s-phone">Phone *</label>
                    <input id="s-phone" required value={form.phone} onChange={set('phone')} className="input" placeholder="+971 5X XXX XXXX" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="s-email">Email *</label>
                    <input id="s-email" type="email" required value={form.email} onChange={set('email')} className="input" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="label" htmlFor="s-subject">Subject *</label>
                    <select id="s-subject" value={form.subject} onChange={set('subject')} className="input">
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="s-message">Message *</label>
                  <textarea
                    id="s-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={set('message')}
                    className="input resize-none"
                    placeholder="Tell us your laptop model or part number and how we can help..."
                  />
                </div>
                {error && (
                  <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </p>
                )}
                <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto sm:px-10">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-ink-950 p-6">
            <h3 className="font-display text-base font-bold text-white">Contact information</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a href="tel:+971563840130" className="flex items-center gap-3 text-ink-200 transition hover:text-white">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 text-brand-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  +971 56 384 0130
                </a>
              </li>
              <li>
                <a href="mailto:info@ghazacomp.com" className="flex items-center gap-3 text-ink-200 transition hover:text-white">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 text-brand-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  info@ghazacomp.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-ink-200">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 text-brand-400">
                  <MapPin className="h-4 w-4" />
                </span>
                Sharjah, UAE
              </li>
              <li>
                <a
                  href="https://wa.me/971563840130"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-emerald-400 transition hover:text-emerald-300"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-base font-bold text-ink-950">What we help with</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Laptop replacement parts, product compatibility assistance and repair support for
              all major brands — Apple, Acer, Asus, Dell, HP, Lenovo and more.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
