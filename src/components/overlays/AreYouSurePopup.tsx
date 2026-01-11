'use client';

import React from 'react';
import { OverlayInstance } from '@/game/state';
import { useGame } from '../GameRoot';
import { ModalFrame } from './ModalFrame';
import { playResetBeep, playSuccessBeep } from '@/game/engine';
import { generateId } from '@/game/utils';

interface AreYouSurePopupProps {
  overlay: OverlayInstance;
  isTopmost: boolean;
}

export function AreYouSurePopup({ overlay, isTopmost }: AreYouSurePopupProps) {
  const { state, dispatch } = useGame();
  const message = (overlay.payload.message as string) || 'Are you sure?';
  const yesLabel = (overlay.payload.yesLabel as string) || 'YES';
  const noLabel = (overlay.payload.noLabel as string) || 'NO';
  const correctAnswer = (overlay.payload.correctAnswer as 'yes' | 'no') || 'yes';
  const isSubmitCheck = overlay.payload.isSubmitCheck as boolean;

  const triggerReset = () => {
    playResetBeep(state.settings.mute);
    
    // Add glitch effect
    if (!state.settings.reducedMotion) {
      const glitchOverlay = {
        id: generateId(),
        type: 'GLITCH' as const,
        createdAtMs: Date.now(),
        size: 'large' as const,
        blocking: false,
        critical: false,
        canEscClose: false,
        payload: {},
      };
      dispatch({ type: 'PUSH_OVERLAY', overlay: glitchOverlay });
      
      setTimeout(() => {
        dispatch({ type: 'POP_OVERLAY', id: glitchOverlay.id });
      }, 300);
    }

    dispatch({ type: 'POP_OVERLAY', id: overlay.id });
    dispatch({ type: 'RESET_FORM', cause: 'AreYouSureNo' });
  };

  const triggerSafe = () => {
    playSuccessBeep(state.settings.mute);
    dispatch({ type: 'POP_OVERLAY', id: overlay.id });
    
    // If this was a submit check, win the game
    if (isSubmitCheck) {
      setTimeout(() => {
        dispatch({ type: 'WIN_GAME' });
      }, 100);
    }
  };

  const handleYes = () => {
    if (correctAnswer === 'yes') {
      triggerSafe();
    } else {
      triggerReset();
    }
  };

  const handleNo = () => {
    if (correctAnswer === 'no') {
      triggerSafe();
    } else {
      triggerReset();
    }
  };

  // Determine button styles based on which is "safe"
  const yesIsSafe = correctAnswer === 'yes';

  return (
    <ModalFrame 
      title="❓ CONFIRM" 
      size="small" 
      variant="warning" 
      isTopmost={isTopmost}
    >
      <div style={styles.container}>
        <p style={styles.message}>{message}</p>
        
        <div style={styles.buttons}>
          <button
            className={`pixel-btn ${yesIsSafe ? 'pixel-btn--primary' : 'pixel-btn--danger'}`}
            onClick={handleYes}
            style={styles.btn}
          >
            {yesLabel}
          </button>
          <button
            className={`pixel-btn ${!yesIsSafe ? 'pixel-btn--primary' : 'pixel-btn--danger'}`}
            onClick={handleNo}
            style={styles.btn}
          >
            {noLabel}
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  message: {
    fontSize: '11px',
    color: '#ffcc88',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  buttons: {
    display: 'flex',
    gap: '16px',
  },
  btn: {
    minWidth: '90px',
    fontSize: '9px',
  },
};
