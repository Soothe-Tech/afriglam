import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  type?: 'default' | 'danger';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, actions, type = 'default' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
          <h3 className={`text-lg font-bold font-serif ${type === 'danger' ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
            {title}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-slate-600 dark:text-slate-300">
          {children}
        </div>
        {actions && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
