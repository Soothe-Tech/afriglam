import React from 'react';
import type { Customer } from '../../types';
import { storeApi } from '../../services/storeApi';
import { Modal } from '../../components/Modal';

const Customers: React.FC = () => {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [query, setQuery] = React.useState('');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [newEmail, setNewEmail] = React.useState('');
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [statusMessage, setStatusMessage] = React.useState('');
  React.useEffect(() => {
    storeApi.getCustomers().then((result) => setCustomers(result));
  }, []);
  const rows = customers.filter((customer) => {
    const q = query.toLowerCase();
    return !q || customer.name.toLowerCase().includes(q) || customer.email.toLowerCase().includes(q);
  });

  const addCustomer = async () => {
    if (!newName || !newEmail) {
      setStatusMessage('Name and email are required to add a customer.');
      return;
    }
    const response = await storeApi.createCustomer({ name: newName, email: newEmail });
    if (!response.ok || !response.customer) {
      setStatusMessage(response.error ?? 'Failed to add customer.');
      return;
    }
    setCustomers((prev) => [response.customer as Customer, ...prev]);
    setNewName('');
    setNewEmail('');
    setShowAddModal(false);
    setStatusMessage('Customer created successfully.');
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Customers</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage your customer base.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-admin-primary hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-admin-primary/20">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          <span className="font-bold text-sm">Add Customer</span>
        </button>
      </div>
      {statusMessage && <p className="text-sm text-slate-500">{statusMessage}</p>}

      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex gap-4">
           <div className="flex-1 max-w-md relative">
             <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
             <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-admin-primary" placeholder="Search by name, email..." />
           </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 sticky top-0">
                <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4 text-right">Total Spent</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4 text-center">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {rows.map((customer) => (
                <tr key={customer.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <img src={customer.avatar} alt="" className="size-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"/>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 dark:text-white">{customer.name}</span>
                                <span className="text-xs text-slate-500">ID: {customer.id}</span>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {customer.email}
                    </td>
                    <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white">
                             {customer.totalOrders}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-900 dark:text-white font-medium">
                        {customer.totalSpent_pln} PLN
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                        {customer.lastActive}
                    </td>
                    <td className="px-6 py-4 text-center">
                         <button onClick={() => setSelectedCustomer(customer)} className="text-slate-400 hover:text-admin-primary transition-colors" aria-label={`Open actions for ${customer.name}`}>
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Customer"
        actions={
          <>
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
            <button onClick={addCustomer} className="px-4 py-2 rounded-lg bg-admin-primary hover:bg-emerald-600 text-white transition-colors text-sm font-bold">Create</button>
          </>
        }
      >
        <div className="space-y-3">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Customer name" className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" />
          <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Customer email" type="email" className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" />
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer ? selectedCustomer.name : 'Customer'}
        actions={
          <button onClick={() => setSelectedCustomer(null)} className="px-4 py-2 rounded-lg bg-admin-primary hover:bg-emerald-600 text-white transition-colors text-sm font-bold">Close</button>
        }
      >
        {selectedCustomer && (
          <div className="space-y-2">
            <p><span className="font-semibold">Email:</span> {selectedCustomer.email}</p>
            <p><span className="font-semibold">Orders:</span> {selectedCustomer.totalOrders}</p>
            <p><span className="font-semibold">Total Spend:</span> {selectedCustomer.totalSpent_pln} PLN</p>
            <p><span className="font-semibold">Last Active:</span> {selectedCustomer.lastActive}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Customers;
