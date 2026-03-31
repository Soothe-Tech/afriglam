import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeApi } from '../services/storeApi';
import { useAuth } from '../contexts/AuthContext';

const BookStylist: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState('');
  const [stylist, setStylist] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const customerName = user?.user_metadata?.full_name ?? user?.email ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service.trim() || !stylist.trim() || !date || !time) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    const { ok, error } = await storeApi.createBooking({
      customerName: customerName || 'Guest',
      service: service.trim(),
      stylist: stylist.trim(),
      date,
      time,
    });
    setSubmitting(false);
    if (ok) {
      setMessage({ type: 'success', text: 'Booking request sent. We’ll confirm shortly.' });
      setService('');
      setStylist('');
      setDate('');
      setTime('');
    } else {
      setMessage({ type: 'error', text: error ?? 'Could not submit booking.' });
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl font-bold text-primary dark:text-white mb-2">Book a Stylist</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Expert styling in Lagos and Warsaw. Choose your service and preferred time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service</label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g. Makeup, Braiding, Full Look"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Stylist</label>
            <input
              type="text"
              value={stylist}
              onChange={(e) => setStylist(e.target.value)}
              placeholder="Preferred stylist"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {message.text}
            </p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-full disabled:opacity-50"
            >
              {submitting ? 'Sending…' : 'Request Booking'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/feed')}
              className="px-6 py-3 text-slate-600 dark:text-slate-300 hover:text-primary font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookStylist;
