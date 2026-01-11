'use client';

import React from 'react';
import { OverlayInstance } from '@/game/state';
import { useGame } from '../GameRoot';
import { ModalFrame } from './ModalFrame';

interface WarningOverlayProps {
  overlay: OverlayInstance;
  isTopmost: boolean;
}

export function WarningOverlay({ overlay, isTopmost }: WarningOverlayProps) {
  const { dispatch } = useGame();
  const message = (overlay.payload.message as string) || 'System Warning!';

  const handleDismiss = () => {
    dispatch({ type: 'ADJUST_CHAOS', amount: -5 });
    dispatch({ type: 'POP_OVERLAY', id: overlay.id });
  };

  return (
    <ModalFrame 
      title="SYSTEM WARNING" 
      variant="warning" 
      isTopmost={isTopmost}
      onClose={handleDismiss}
    >
      <div style={styles.container}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>!</span>
        </div>
        
        <p style={styles.message}>{message}</p>
        
        <button
          className="pixel-btn pixel-btn--warning"
          onClick={handleDismiss}
          style={styles.dismissBtn}
        >
          DISMISS
        </button>

        <p style={styles.hint}>
          Press ESC to dismiss
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
    width: '64px',
    height: '64px',
    background: '#4a4a2a',
    border: '4px solid #aa8800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '32px',
  },
  message: {
    fontSize: '11px',
    color: '#ffcc88',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  dismissBtn: {
    marginTop: '8px',
  },
  hint: {
    fontSize: '8px',
    color: '#6a6a4a',
  },
};

