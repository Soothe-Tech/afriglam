import React, { useState } from 'react';
import { Modal } from '../../components/Modal';
import { adminApi } from '../../services/adminApi';

const Analytics: React.FC = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<'full' | 'orders'>('full');
  const [period, setPeriod] = useState<'7d' | '30d' | '1y'>('7d');
  const [statusMessage, setStatusMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const revenueByPeriod = {
    '7d': '96,400 PLN',
    '30d': '458,200 PLN',
    '1y': '4,920,000 PLN',
  } as const;

  const conversionByPeriod = {
    '7d': '3.2%',
    '30d': '3.8%',
    '1y': '4.1%',
  } as const;

  const downloadExport = async () => {
    setIsExporting(true);
    setStatusMessage('');
    try {
      const response = await adminApi.requestAnalyticsExport(exportType);
      setStatusMessage(response.message);
      setIsExportModalOpen(false);
    } catch {
      setStatusMessage('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Detailed insights into store performance.</p>
        </div>
        <div className="flex gap-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value as '7d' | '30d' | '1y')} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-admin-primary outline-none">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">This Year</option>
          </select>
          <button onClick={() => setIsExportModalOpen(true)} className="flex items-center gap-2 bg-admin-primary hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-admin-primary/20">
            <span className="material-symbols-outlined text-[20px]">file_download</span>
            <span className="font-bold text-sm">Export Data</span>
          </button>
        </div>
      </div>
      {statusMessage && <p className="text-sm text-slate-500">{statusMessage}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Revenue', value: revenueByPeriod[period], change: '+12%', isPositive: true },
          { title: 'Conversion Rate', value: conversionByPeriod[period], change: '-0.4%', isPositive: false },
          { title: 'Avg. Order Value', value: period === '7d' ? '380 PLN' : period === '30d' ? '401 PLN' : '417 PLN', change: '+5%', isPositive: true },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{stat.title}</p>
            <div className="flex items-baseline gap-3">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
              <span className={`text-sm font-bold ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Overview</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[35, 45, 30, 60, 75, 50, 65, 80, 55, 70, 90, 60].map((h, i) => (
              <div key={i} className="w-full bg-slate-100 dark:bg-white/5 rounded-t-sm relative group">
                <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-admin-primary opacity-80 group-hover:opacity-100 transition-all rounded-t-sm"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-400 font-mono">
            <span>Jan</span><span>Dec</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Traffic Sources</h3>
          <div className="space-y-6">
            {[
              { source: 'Direct', val: 40, color: 'bg-emerald-500' },
              { source: 'Social Media', val: 35, color: 'bg-blue-500' },
              { source: 'Organic Search', val: 15, color: 'bg-purple-500' },
              { source: 'Referral', val: 10, color: 'bg-amber-500' }
            ].map((item) => (
              <div key={item.source}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.source}</span>
                  <span className="text-slate-500">{item.val}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div style={{ width: `${item.val}%` }} className={`h-full ${item.color} rounded-full`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Analytics Data"
        actions={
          <>
            <button onClick={() => setIsExportModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
            <button disabled={isExporting} onClick={downloadExport} className="px-4 py-2 rounded-lg bg-admin-primary hover:bg-emerald-600 text-white transition-colors text-sm font-bold disabled:opacity-60">
              {isExporting ? 'Exporting...' : 'Download CSV'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p>Select the type of data you wish to export.</p>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-white/10 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5">
              <input type="radio" name="exportType" checked={exportType === 'full'} onChange={() => setExportType('full')} className="text-admin-primary focus:ring-admin-primary" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Full Report</p>
                <p className="text-xs text-slate-500">Includes revenue, traffic, and user data.</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-white/10 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5">
              <input type="radio" name="exportType" checked={exportType === 'orders'} onChange={() => setExportType('orders')} className="text-admin-primary focus:ring-admin-primary" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Orders Only</p>
                <p className="text-xs text-slate-500">List of all transactions in the selected period.</p>
              </div>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Analytics;
