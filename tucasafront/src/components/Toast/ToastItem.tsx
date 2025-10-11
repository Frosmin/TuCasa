// components/Toast/ToastItem.tsx
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Toast } from './types';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export default function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsExiting(false);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-800';
    }
  };

  const getIconColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg transition-all duration-300 transform ${getStyles()} ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      <div className={getIconColor()}>{getIcon()}</div>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleRemove}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}