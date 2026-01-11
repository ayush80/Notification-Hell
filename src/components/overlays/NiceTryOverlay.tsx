'use client';

import React from 'react';
import { OverlayInstance } from '@/game/state';
import { useGame } from '../GameRoot';
import { ModalFrame } from './ModalFrame';
import { playErrorBeep } from '@/game/engine';

interface NiceTryOverlayProps {
  overlay: OverlayInstance;
  isTopmost: boolean;
}

const SNARKY_MESSAGES = [
  "Did you really think autofill would save you?",
  "Autofill detected! That's not how we play here.",
  "Browser autofill? In MY form? Unacceptable!",
  "We don't do shortcuts around here, buddy.",
  "Autofill is for QUITTERS. Type it yourself!",
  "Your browser tried to help. We said NO.",
  "Caught you! Manual entry only, please.",
  "The form demands GENUINE keystrokes.",
  "Autofill? More like AUTO-FAIL!",
  "Your laziness has been noted and penalized.",
];

export function NiceTryOverlay({ overlay, isTopmost }: NiceTryOverlayProps) {
  const { state, dispatch } = useGame();
  const fieldName = (overlay.payload.fieldName as string) || 'a field';
  const message = (overlay.payload.message as string) || SNARKY_MESSAGES[0];

  const handleDismiss = () => {
    playErrorBeep(state.settings.mute);
    dispatch({ type: 'POP_OVERLAY', id: overlay.id });
  };

  return (
    <ModalFrame 
      title="NICE TRY!" 
      size="small" 
      variant="warning" 
      isTopmost={isTopmost}
    >
      <div style={styles.container}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>X_X</span>
        </div>
        
        <p style={styles.caught}>
          AUTOFILL DETECTED!
        </p>

        <p style={styles.field}>
          Field: {fieldName}
        </p>
        
        <p style={styles.message}>
          {message}
        </p>

        <div style={styles.penalty}>
          <span style={styles.penaltyLabel}>PENALTY:</span>
          <span style={styles.penaltyValue}>-100 POINTS</span>
          <span style={styles.penaltyValue}>+15 CHAOS</span>
        </div>
        
        <button
          className="pixel-btn pixel-btn--warning"
          onClick={handleDismiss}
          style={styles.dismissBtn}
        >
          I'LL TYPE IT MYSELF...
        </button>
      </div>
    </ModalFrame>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  iconContainer: {
    width: '64px',
    height: '64px',
    background: '#4a3a2a',
    border: '4px solid #aa8844',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '18px',
    color: '#ffcc00',
  },
  caught: {
    fontSize: '12px',
    color: '#ff6666',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  field: {
    fontSize: '9px',
    color: '#aaaacc',
    textAlign: 'center',
  },
  message: {
    fontSize: '9px',
    color: '#ffcc88',
    textAlign: 'center',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
  penalty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    background: '#2a1a1a',
    border: '2px solid #aa4444',
    padding: '10px 16px',
  },
  penaltyLabel: {
    fontSize: '8px',
    color: '#aa6666',
  },
  penaltyValue: {
    fontSize: '10px',
    color: '#ff4444',
  },
  dismissBtn: {
    marginTop: '8px',
    fontSize: '8px',
  },
};

