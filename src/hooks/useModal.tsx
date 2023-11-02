// hooks/useModal.tsx

import { CheckSpellingResponse } from '@/app/api/checkPronunciation/route';
import ResultsModalComponent from '@/components/ResultsModal';
import { useState } from 'react';

interface OpenModal {
  onClose?: () => void;
  onTryAgain?: () => void;
}

export const useResultModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rejectFn, setRejectFn] = useState<(() => void) | null>(null);
  const [tryAgainFn, setTryAgainFn] = useState<(() => void) | null>(null);

  const openModal = ({ onClose, onTryAgain }: OpenModal) => {
    setIsOpen(true);
    setTryAgainFn(() => onTryAgain);
    setRejectFn(() => onClose);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (rejectFn) {
      rejectFn();
    }
  };

  const tryAgain = () => {
    setIsOpen(false);
    if (tryAgainFn) {
      tryAgainFn();
    }
  }

  const ModalComponent = (result?: CheckSpellingResponse) => {
    if (!result) return null;
    return (
      <ResultsModalComponent
        result={result}
        isOpen={isOpen}
        onClose={closeModal}
        onTryAgain={tryAgain}
      />
    )
  }

  return {
    openModal,
    ModalComponent,
  };
};
