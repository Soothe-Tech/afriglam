import React from 'react';
import type { Booking } from '../../types';
import { storeApi } from '../../services/storeApi';
import { Modal } from '../../components/Modal';

const Bookings: React.FC = () => {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [monthOffset, setMonthOffset] = React.useState(0);
  const [selectedDay, setSelectedDay] = React.useState(12);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingBooking, setEditingBooking] = React.useState<Booking | null>(null);
  const [statusMessage, setStatusMessage] = React.useState('');
  const [newBooking, setNewBooking] = React.useState({
    customerName: '',
    service: '',
    stylist: '',
    time: '',
  });
  const currentDate = new Date(2024, 10 + monthOffset, 1);
  const monthTitle = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  React.useEffect(() => {
    storeApi.getBookings().then((rows) => setBookings(rows));
  }, []);

  const createBooking = async () => {
    if (!newBooking.customerName || !newBooking.service || !newBooking.stylist || !newBooking.time) {
      setStatusMessage('Please complete all booking fields.');
      return;
    }
    const bookingDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    const response = await storeApi.createBooking({
      customerName: newBooking.customerName,
      service: newBooking.service,
      stylist: newBooking.stylist,
      date: bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: newBooking.time,
    });
    if (!response.ok || !response.booking) {
      setStatusMessage(response.error ?? 'Failed to create booking.');
      return;
    }
    setBookings((prev) => [response.booking as Booking, ...prev]);
    setShowCreateModal(false);
    setNewBooking({ customerName: '', service: '', stylist: '', time: '' });
    setStatusMessage('Booking created successfully.');
  };

  const saveBookingEdit = async () => {
    if (!editingBooking) return;
    const response = await storeApi.updateBooking(editingBooking.id, editingBooking);
    if (!response.ok) {
      setStatusMessage(response.error ?? 'Failed to update booking.');
      return;
    }
    setBookings((prev) => prev.map((item) => (item.id === editingBooking.id ? editingBooking : item)));
    setEditingBooking(null);
    setStatusMessage('Booking updated successfully.');
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage stylist appointments and schedules.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-admin-primary hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-admin-primary/20">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="font-bold text-sm">New Appointment</span>
        </button>
      </div>
      {statusMessage && <p className="text-sm text-slate-500">{statusMessage}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Calendar Placeholder - Left Column */}
         <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white">{monthTitle}</h3>
                <div className="flex gap-2">
                    <button onClick={() => setMonthOffset((prev) => prev - 1)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded" aria-label="Previous month"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                    <button onClick={() => setMonthOffset((prev) => prev + 1)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded" aria-label="Next month"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                </div>
            </div>
            {/* Simple CSS Grid Calendar */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d} className="text-slate-400 text-xs font-bold py-2">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                 {Array.from({length: 30}, (_, i) => i + 1).map(d => (
                     <button onClick={() => setSelectedDay(d)} key={d} className={`aspect-square flex items-center justify-center rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${d === selectedDay ? 'bg-admin-primary text-white hover:!bg-admin-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                         {d}
                         {d === selectedDay && <div className="size-1 bg-white rounded-full absolute bottom-1.5"></div>}
                     </button>
                 ))}
            </div>
         </div>

         {/* Upcoming List - Right Column (Spans 2) */}
         <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Upcoming Appointments</h3>
            
            <div className="space-y-4">
                {bookings.map(booking => (
                    <div key={booking.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <div className="flex gap-4 items-center">
                             <div className="flex flex-col items-center justify-center bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl w-16 h-16 shrink-0 shadow-sm">
                                 <span className="text-xs font-bold text-slate-400 uppercase">{booking.date.split(' ')[0]}</span>
                                 <span className="text-xl font-bold text-slate-900 dark:text-white">{booking.date.split(' ')[1].replace(',','')}</span>
                             </div>
                             <div className="min-w-[120px]">
                                 <div className="flex items-center gap-2 mb-1">
                                     <span className="material-symbols-outlined text-slate-400 text-sm">schedule</span>
                                     <span className="text-sm font-bold text-slate-900 dark:text-white">{booking.time}</span>
                                 </div>
                                 <div className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                     {booking.status}
                                 </div>
                             </div>
                        </div>
                        
                        <div className="w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
                        
                        <div className="flex-1 flex gap-4 items-center">
                            <img src={booking.avatar} alt="" className="size-10 rounded-full object-cover"/>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{booking.customerName}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{booking.service} with <span className="text-admin-primary">{booking.stylist}</span></p>
                            </div>
                        </div>

                        <div className="flex sm:flex-col justify-end gap-2">
                             <button onClick={() => setEditingBooking(booking)} className="p-2 text-slate-400 hover:text-admin-primary hover:bg-admin-primary/10 rounded-lg transition-colors" aria-label={`Edit booking ${booking.id}`}>
                                <span className="material-symbols-outlined">edit</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Appointment"
        actions={
          <>
            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
            <button onClick={createBooking} className="px-4 py-2 rounded-lg bg-admin-primary hover:bg-emerald-600 text-white transition-colors text-sm font-bold">Create</button>
          </>
        }
      >
        <div className="space-y-3">
          <input value={newBooking.customerName} onChange={(e) => setNewBooking((prev) => ({ ...prev, customerName: e.target.value }))} placeholder="Customer Name" className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" />
          <input value={newBooking.service} onChange={(e) => setNewBooking((prev) => ({ ...prev, service: e.target.value }))} placeholder="Service" className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" />
          <input value={newBooking.stylist} onChange={(e) => setNewBooking((prev) => ({ ...prev, stylist: e.target.value }))} placeholder="Stylist" className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" />
          <input value={newBooking.time} onChange={(e) => setNewBooking((prev) => ({ ...prev, time: e.target.value }))} placeholder="Time (e.g. 10:00 AM)" className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" />
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(editingBooking)}
        onClose={() => setEditingBooking(null)}
        title={editingBooking ? `Edit ${editingBooking.customerName}` : 'Edit booking'}
        actions={
          <>
            <button onClick={() => setEditingBooking(null)} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
            <button onClick={saveBookingEdit} className="px-4 py-2 rounded-lg bg-admin-primary hover:bg-emerald-600 text-white transition-colors text-sm font-bold">Save</button>
          </>
        }
      >
        {editingBooking && (
          <div className="space-y-3">
            <input value={editingBooking.service} onChange={(e) => setEditingBooking((prev) => (prev ? { ...prev, service: e.target.value } : prev))} placeholder="Service" className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" />
            <input value={editingBooking.stylist} onChange={(e) => setEditingBooking((prev) => (prev ? { ...prev, stylist: e.target.value } : prev))} placeholder="Stylist" className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" />
            <input value={editingBooking.time} onChange={(e) => setEditingBooking((prev) => (prev ? { ...prev, time: e.target.value } : prev))} placeholder="Time" className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Bookings;
