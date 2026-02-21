import React, { useEffect } from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: 'bg-emerald-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  };

  return (
    <div className={`fixed top-6 right-6 z-[110] flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg shadow-black/10 transition-all duration-300 transform translate-y-0 ${styles[type]} animate-fadeIn`}>
      <span className="material-symbols-outlined">{icons[type]}</span>
      <p className="font-medium text-sm">{message}</p>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};
