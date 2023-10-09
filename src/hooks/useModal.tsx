// hooks/useModal.tsx

import { CheckSpellingResponse } from '@/app/api/checkPronunciation/route';
import ResultsModalComponent from '@/components/ResultsModal';
import { useState } from 'react';

interface OpenModal {
  onClose?: () => void;
}

export const useResultModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rejectFn, setRejectFn] = useState<(() => void) | null>(null);

  const openModal = ({ onClose }: OpenModal) => {
    setIsOpen(true);
    setRejectFn(() => onClose);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (rejectFn) {
      rejectFn();
    }
  };

  const ModalComponent = (result?: CheckSpellingResponse) => {
    if (!result) return null;
    return (
      <ResultsModalComponent
        result={result}
        isOpen={isOpen}
        onClose={closeModal}
      />
    )
  }

  return {
    openModal,
    ModalComponent,
  };
};
