import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, PackageSearch, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { trackRepair } from '../lib/api';
import { REPAIR_STATUS_STEPS, STATUS_LABELS, type RepairRequest } from '../lib/types';

export default function Track() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reference, setReference] = useState(searchParams.get('ref') ?? '');
  const [mobile,setMobile] = useState('');
  const [result, setResult] = useState<RepairRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (ref: string) => {
    if (!ref.trim() || !mobile.trim()) return;
    setLoading(true);
    setNotFound(false);
    setError(null);
    try {
      const data = await trackRepair(ref, mobile);
      setResult(data);
      setNotFound(!data);
    } catch {
      setError('We could not check that reference right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const currentStep = result ? REPAIR_STATUS_STEPS.indexOf(result.status as never) : -1;

  return (
    <div className="animate-fade-in">
      <section className="bg-ink-950 py-14">
        <div className="container-x text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Track your repair
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-ink-300">
            Enter the reference number you received when submitting your repair request.
          </p>
          <form
            className="mx-auto mt-6 flex max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSearchParams({ ref: reference });
              lookup(reference);
            }}
          >
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              placeholder="e.g. GCR-2026-00001"
              className="input text-center font-mono tracking-widest"
            />
            <input required value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Mobile used for booking" className="input min-w-0" />
            <button type="submit" className="btn-primary shrink-0" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Track
            </button>
          </form>
        </div>
      </section>

      <div className="container-x py-14">
        {error && (
          <p className="mx-auto max-w-md rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm text-red-700">
            {error}
          </p>
        )}

        {notFound && !loading && (
          <div className="mx-auto max-w-md rounded-2xl border border-ink-100 p-10 text-center">
            <PackageSearch className="mx-auto h-10 w-10 text-ink-300" />
            <h2 className="mt-4 font-display text-lg font-semibold text-ink-900">
              No repair found
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Check the reference number and try again, or contact us for help.
            </p>
          </div>
        )}

        {result && !loading && (
          <div className="mx-auto max-w-2xl animate-fade-up">
            <div className="card p-6 transition hover:shadow-md sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
                    Reference
                  </span>
                  <div className="font-display text-xl font-bold tracking-wider text-brand-700">
                    {result.reference}
                  </div>
                </div>
                <span className="badge bg-emerald-50 text-emerald-700">
                  {STATUS_LABELS[result.status] ?? result.status}
                </span>
              </div>

              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-ink-400">Customer</dt>
                  <dd className="mt-0.5 font-medium text-ink-900">{result.customer_name}</dd>
                </div>
                <div>
                  <dt className="text-ink-400">Laptop</dt>
                  <dd className="mt-0.5 font-medium text-ink-900">{result.laptop_model ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-ink-400">Request type</dt>
                  <dd className="mt-0.5 font-medium capitalize text-ink-900">{result.request_type}</dd>
                </div>
                <div>
                  <dt className="text-ink-400">Submitted</dt>
                  <dd className="mt-0.5 font-medium text-ink-900">
                    {new Date(result.created_at).toLocaleDateString('en-AE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </dd>
                </div>
                {result.issue && (
                  <div className="sm:col-span-2">
                    <dt className="text-ink-400">Details</dt>
                    <dd className="mt-0.5 text-ink-700">{result.issue}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="card mt-6 p-6 sm:p-8">
              <h2 className="font-display text-lg font-bold text-ink-950">Progress</h2>
              <ol className="mt-6 space-y-0">
                {REPAIR_STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const isLast = i === REPAIR_STATUS_STEPS.length - 1;
                  return (
                    <li key={step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {done ? (
                          <CheckCircle2
                            className={`h-6 w-6 shrink-0 text-emerald-500 ${
                              i === currentStep ? 'animate-pop-in' : ''
                            }`}
                          />
                        ) : (
                          <Circle className="h-6 w-6 shrink-0 animate-pulse text-ink-200" />
                        )}
                        {!isLast && (
                          <span
                            className={`w-0.5 flex-1 ${done && i < currentStep ? 'bg-emerald-400' : 'bg-ink-100'}`}
                          />
                        )}
                      </div>
                      <div className={isLast ? 'pb-0' : 'pb-6'}>
                        <div
                          className={`text-sm font-semibold ${done ? 'text-ink-900' : 'text-ink-400'}`}
                        >
                          {STATUS_LABELS[step]}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
