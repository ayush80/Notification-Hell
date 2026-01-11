'use client';

import React from 'react';
import { OverlayInstance } from '@/game/state';
import { useGame } from '../GameRoot';
import { ModalFrame } from './ModalFrame';
import { playResetBeep } from '@/game/engine';
import { generateId } from '@/game/utils';

interface SessionExpiredOverlayProps {
  overlay: OverlayInstance;
  isTopmost: boolean;
}

export function SessionExpiredOverlay({ overlay, isTopmost }: SessionExpiredOverlayProps) {
  const { state, dispatch } = useGame();

  const handleLogIn = () => {
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

    // Clear all overlays and reset
    dispatch({ type: 'CLEAR_OVERLAYS' });
    dispatch({ type: 'RESET_FORM', cause: 'SessionExpired' });
  };

  return (
    <ModalFrame 
      title="🔒 SESSION EXPIRED" 
      size="small" 
      variant="danger" 
      isTopmost={isTopmost}
    >
      <div style={styles.container}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>🔒</span>
        </div>
        
        <p style={styles.message}>
          Your session has expired due to inactivity.
        </p>
        
        <button
          className="pixel-btn pixel-btn--danger"
          onClick={handleLogIn}
          style={styles.loginBtn}
        >
          LOG IN AGAIN
        </button>

        <p style={styles.warning}>
          All form data will be lost!
        </p>
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
  iconContainer: {
    width: '48px',
    height: '48px',
    background: '#4a2a2a',
    border: '4px solid #aa4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '24px',
  },
  message: {
    fontSize: '10px',
    color: '#ff8888',
    textAlign: 'center',
    lineHeight: 1.5,
    margin: 0,
  },
  loginBtn: {
    marginTop: '8px',
  },
  warning: {
    fontSize: '8px',
    color: '#ff6666',
    textAlign: 'center',
  },
};

