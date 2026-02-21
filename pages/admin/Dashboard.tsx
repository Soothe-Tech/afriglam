import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Booking, Order } from '../../types';
import { storeApi } from '../../services/storeApi';
import { adminApi } from '../../services/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [statusMessage, setStatusMessage] = React.useState('');
  const [chartPeriod, setChartPeriod] = React.useState<'thisYear' | 'lastYear'>('thisYear');

  React.useEffect(() => {
    storeApi.getOrders().then((result) => setOrders(result));
    storeApi.getBookings().then((result) => setBookings(result));
  }, []);
  const handleDownloadReport = async () => {
    try {
      const response = await adminApi.requestAnalyticsExport('full');
      setStatusMessage(response.message);
    } catch {
      setStatusMessage('Failed to queue report export.');
    }
  };

  const displayName = [user?.user_metadata?.full_name, user?.user_metadata?.name].filter(Boolean)[0] ?? user?.email ?? 'there';
  const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, {displayName}. Here&apos;s what&apos;s happening today.</p>
        </div>
        <button onClick={handleDownloadReport} className="flex items-center gap-2 bg-admin-primary hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-admin-primary/20">
          <span className="material-symbols-outlined text-[20px]">download</span>
          <span className="font-bold text-sm">Download Report</span>
        </button>
      </div>
      {statusMessage && <p className="text-sm text-slate-500">{statusMessage}</p>}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '458,200 PLN', sub: '+12.5% from last month', icon: 'payments', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total Orders', value: String(orders.length), sub: 'All time', icon: 'shopping_bag', color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Customers', value: '—', sub: 'From profiles', icon: 'group', color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Pending Bookings', value: String(pendingBookings), sub: pendingBookings ? 'Requires attention' : 'Up to date', icon: 'calendar_clock', color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
              </div>
              <span className={`flex items-center text-xs font-bold ${stat.sub.includes('+') ? 'text-emerald-500' : 'text-amber-500'} bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-full`}>
                {stat.sub.includes('+') ? '↑' : '•'} {stat.sub.split(' ')[0]}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg text-slate-900 dark:text-white">Revenue Analytics</h3>
             <select
               value={chartPeriod}
               onChange={(e) => setChartPeriod(e.target.value as 'thisYear' | 'lastYear')}
               className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white text-xs font-bold rounded-lg py-1 pl-3 pr-8"
             >
               <option value="thisYear">This Year</option>
               <option value="lastYear">Last Year</option>
             </select>
           </div>
           {/* CSS Graphic Simulation */}
           <div className="h-64 w-full flex items-end gap-2 sm:gap-4 px-2">
              {[40, 65, 45, 80, 55, 70, 40, 60, 75, 50, 85, 95].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                  <div 
                    style={{ height: `${h}%` }} 
                    className="w-full bg-admin-primary/20 dark:bg-admin-primary/10 rounded-t-sm group-hover:bg-admin-primary transition-colors relative"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                      {h * 1000} PLN
                    </div>
                  </div>
                </div>
              ))}
           </div>
           <div className="flex justify-between text-xs text-slate-400 font-medium mt-4 px-2">
             <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
           </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Recent Activity</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
             {[
               { icon: 'shopping_cart', color: 'bg-blue-100 text-blue-600', text: 'New order #ORD-7829', time: '5 min ago' },
               { icon: 'person_add', color: 'bg-purple-100 text-purple-600', text: 'New customer registered', time: '2 hours ago' },
               { icon: 'inventory', color: 'bg-amber-100 text-amber-600', text: 'Low stock: Royal Silk Wig', time: '4 hours ago' },
               { icon: 'calendar_month', color: 'bg-emerald-100 text-emerald-600', text: 'Booking confirmed: Amara O.', time: 'Yesterday' },
               { icon: 'reviews', color: 'bg-pink-100 text-pink-600', text: 'New 5-star review received', time: 'Yesterday' },
             ].map((item, i) => (
               <div key={i} className="flex gap-4 items-start">
                 <div className={`shrink-0 size-10 rounded-full flex items-center justify-center ${item.color}`}>
                   <span className="material-symbols-outlined text-lg">{item.icon}</span>
                 </div>
                 <div>
                   <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">{item.text}</p>
                   <span className="text-xs text-slate-500 dark:text-slate-400">{item.time}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table Mini */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Orders</h3>
             <button onClick={() => navigate('/admin/orders')} className="text-admin-primary text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs font-semibold uppercase text-slate-500 border-b border-slate-100 dark:border-white/5">
                <tr>
                  <th className="pb-3 pl-2">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 pl-2 font-medium text-slate-900 dark:text-white">{order.id}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{order.customer.name}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                        order.status === 'In Transit' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2 font-mono text-slate-900 dark:text-white">{order.total_pln} PLN</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Bookings Mini */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg text-slate-900 dark:text-white">Upcoming Appointments</h3>
             <button onClick={() => navigate('/admin/bookings')} className="text-admin-primary text-sm font-bold hover:underline">View Calendar</button>
          </div>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-admin-primary/30 transition-colors">
                <img src={booking.avatar} alt={booking.customerName} className="size-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate">{booking.service}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">with {booking.stylist}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{booking.time}</p>
                  <p className="text-xs text-slate-500">{booking.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
