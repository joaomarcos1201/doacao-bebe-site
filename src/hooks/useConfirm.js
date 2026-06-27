import { useState } from 'react';

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: { fn: null },
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  });

  const showConfirm = (title, message, onConfirm, confirmText = 'Confirmar', cancelText = 'Cancelar') => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: { fn: onConfirm },
      confirmText,
      cancelText
    });
  };

  const handleConfirm = () => {
    if (confirmState.onConfirm?.fn) {
      confirmState.onConfirm.fn();
    }
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    confirmState,
    showConfirm,
    handleConfirm,
    handleCancel
  };
};