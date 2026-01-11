'use client';

import React from 'react';
import { OverlayInstance } from '@/game/state';
import { useGame } from '../GameRoot';
import { ModalFrame } from './ModalFrame';
import { playResetBeep, playErrorBeep } from '@/game/engine';
import { generateId } from '@/game/utils';

interface SystemUpdateOverlayProps {
  overlay: OverlayInstance;
  isTopmost: boolean;
}

export function SystemUpdateOverlay({ overlay, isTopmost }: SystemUpdateOverlayProps) {
  const { state, dispatch } = useGame();

  const handleRestart = () => {
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
    dispatch({ type: 'RESET_FORM', cause: 'RestartApp' });
  };

  const handleLater = () => {
    playErrorBeep(state.settings.mute);
    dispatch({ type: 'ADJUST_CHAOS', amount: 15 });
    
    // Schedule next overlay sooner
    dispatch({ type: 'SET_NEXT_SPAWN_AT', ms: state.elapsedMs + 3000 });
    dispatch({ type: 'POP_OVERLAY', id: overlay.id });
  };

  return (
    <ModalFrame 
      title="🔄 SYSTEM UPDATE" 
      variant="danger" 
      isTopmost={isTopmost}
    >
      <div style={styles.container}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>🔄</span>
        </div>
        
        <h3 style={styles.title}>Critical Update Required!</h3>
        
        <p style={styles.message}>
          A mandatory system update is available. 
          Please restart to apply the update.
        </p>

        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div style={styles.progressFill} />
          </div>
          <span style={styles.progressText}>Update Ready</span>
        </div>
        
        <div style={styles.buttons}>
          <button
            className="pixel-btn pixel-btn--danger"
            onClick={handleRestart}
            style={styles.restartBtn}
          >
            RESTART APP
          </button>
          <button
            className="pixel-btn"
            onClick={handleLater}
            style={styles.laterBtn}
          >
            LATER
          </button>
        </div>

        <p style={styles.warning}>
          ⚠️ "Restart App" will reset your form!
        </p>
        <p style={styles.warning}>
          ⚠️ "Later" increases chaos!
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
    gap: '14px',
  },
  iconContainer: {
    width: '56px',
    height: '56px',
    background: '#4a2a2a',
    border: '4px solid #aa4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'spin 2s linear infinite',
  },
  icon: {
    fontSize: '28px',
  },
  title: {
    fontSize: '12px',
    color: '#ff6666',
    margin: 0,
  },
  message: {
    fontSize: '9px',
    color: '#ccaaaa',
    textAlign: 'center',
    lineHeight: 1.6,
    margin: 0,
  },
  progressContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  progressBar: {
    height: '12px',
    background: '#1a1a2a',
    border: '2px solid #4a4a6a',
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    background: '#ff4444',
  },
  progressText: {
    fontSize: '8px',
    color: '#6a6a8a',
    textAlign: 'center',
  },
  buttons: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  },
  restartBtn: {
    fontSize: '9px',
  },
  laterBtn: {
    fontSize: '9px',
  },
  warning: {
    fontSize: '8px',
    color: '#ff8844',
    textAlign: 'center',
    margin: 0,
  },
};

