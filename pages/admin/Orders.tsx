import React from 'react';
import type { Order } from '../../types';
import { storeApi } from '../../services/storeApi';
import { Modal } from '../../components/Modal';

const Orders: React.FC = () => {
  const [ordersSource, setOrdersSource] = React.useState<Order[]>([]);
  const [query, setQuery] = React.useState('');
  const [market, setMarket] = React.useState<'all' | 'Poland' | 'Nigeria'>('all');
  const [statusFilter, setStatusFilter] = React.useState<'all' | Order['status']>('all');
  const [page, setPage] = React.useState(1);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<Order['status']>('Processing');
  const [statusMessage, setStatusMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const pageSize = 10;

  React.useEffect(() => {
    setLoading(true);
    storeApi
      .getOrders()
      .then((rows) => setOrdersSource(rows))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = ordersSource.filter((order) => {
    const q = query.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(q) ||
      order.customer.name.toLowerCase().includes(q) ||
      order.status.toLowerCase().includes(q);
    const matchesMarket = market === 'all' || order.market === market;
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesMarket && matchesStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const visibleOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const exportCsv = () => {
    const lines = ['id,customer,market,status,total_pln,date'];
    for (const order of filteredOrders) {
      lines.push(`${order.id},${order.customer.name},${order.market},${order.status},${order.total_pln},${order.date}`);
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage(`Exported ${filteredOrders.length} orders.`);
  };

  const openOrderActions = (order: Order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
  };

  const saveOrderStatus = async () => {
    if (!selectedOrder) return;
    const response = await storeApi.updateOrderStatus(selectedOrder.id, selectedStatus);
    if (!response.ok) {
      setStatusMessage(response.error ?? 'Failed to update order.');
      return;
    }
    setOrdersSource((prev) =>
      prev.map((item) => (item.id === selectedOrder.id ? { ...item, status: selectedStatus } : item))
    );
    setStatusMessage(`Order ${selectedOrder.id} updated to ${selectedStatus}.`);
    setSelectedOrder(null);
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Orders</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and fulfill customer orders.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="flex items-center gap-2 bg-admin-primary hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span className="font-bold text-sm">Export</span>
          </button>
        </div>
      </div>
      {statusMessage && <p className="text-sm text-slate-500">{statusMessage}</p>}

      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="flex-1 max-w-md relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-admin-primary"
              placeholder="Search orders by ID, customer or status..."
            />
          </div>
          <select value={market} onChange={(e) => { setMarket(e.target.value as typeof market); setPage(1); }} className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2 text-sm">
            <option value="all">All markets</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Poland">Poland</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }} className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2 text-sm">
            <option value="all">All statuses</option>
            <option value="Processing">Processing</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Transit">In Transit</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="p-8 text-sm text-slate-500">Loading orders...</div>
          ) : visibleOrders.length === 0 ? (
            <div className="p-8 text-sm text-slate-500">No orders match the current filters.</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 sticky top-0">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Market</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {visibleOrders.map((order, i) => (
                  <tr key={`${order.id}-${i}`} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{order.id}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {order.customer.avatar ? (
                          <img src={order.customer.avatar} alt="" className="size-8 rounded-full object-cover" />
                        ) : (
                          <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0" aria-hidden>
                            <span className="material-symbols-outlined text-slate-500 text-lg">person</span>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 dark:text-white">{order.customer.name}</span>
                          <span className="text-xs text-slate-500">{order.customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.market}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        order.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
                          : order.status === 'In Transit'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-900 dark:text-white font-medium">{order.total_pln} PLN</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => openOrderActions(order)} className="text-slate-400 hover:text-admin-primary transition-colors" aria-label={`Open actions for ${order.id}`}>
                        <span className="material-symbols-outlined">more_horiz</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {filteredOrders.length === 0 ? 'No orders to show' : `Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filteredOrders.length)} of ${filteredOrders.length} orders`}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="px-3 py-1 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-white/5 dark:text-white">
              Previous
            </button>
            <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} className="px-3 py-1 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-white/5 dark:text-white">
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order ${selectedOrder.id}` : 'Order actions'}
        actions={
          <>
            <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
            <button onClick={saveOrderStatus} className="px-4 py-2 rounded-lg bg-admin-primary hover:bg-emerald-600 text-white transition-colors text-sm font-bold">Update Status</button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-500">Select the new order status.</p>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as Order['status'])} className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5">
            <option>Confirmed</option>
            <option>Processing</option>
            <option>In Transit</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
