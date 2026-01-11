'use client';

import React from 'react';
import { OverlayInstance } from '@/game/state';
import { useGame } from '../GameRoot';
import { ModalFrame } from './ModalFrame';

interface PauseOverlayProps {
  overlay: OverlayInstance;
  isTopmost: boolean;
}

export function PauseOverlay({ overlay, isTopmost }: PauseOverlayProps) {
  const { state, dispatch } = useGame();

  const handleResume = () => {
    dispatch({ type: 'RESUME_GAME' });
  };

  const handleToggleSetting = (setting: 'reducedMotion' | 'crt' | 'mute') => {
    dispatch({ type: 'UPDATE_SETTING', setting, value: !state.settings[setting] });
  };

  return (
    <ModalFrame 
      title="PAUSED" 
      variant="default" 
      isTopmost={isTopmost}
      onClose={handleResume}
    >
      <div style={styles.container}>
        <h3 style={styles.title}>GAME PAUSED</h3>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>CONTROLS</h4>
          <div style={styles.controls}>
            <div style={styles.controlRow}>
              <span style={styles.key}>ESC</span>
              <span>Close overlay</span>
            </div>
            <div style={styles.controlRow}>
              <span style={styles.key}>ENTER</span>
              <span>Primary action</span>
            </div>
            <div style={styles.controlRow}>
              <span style={styles.key}>TAB</span>
              <span>Navigate</span>
            </div>
            <div style={styles.controlRow}>
              <span style={styles.key}>F</span>
              <span>Focus Mode</span>
            </div>
            <div style={styles.controlRow}>
              <span style={styles.key}>P</span>
              <span>Pause/Resume</span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>SETTINGS</h4>
          <div style={styles.settings}>
            <label style={styles.toggle}>
              <input
                type="checkbox"
                checked={state.settings.reducedMotion}
                onChange={() => handleToggleSetting('reducedMotion')}
                style={styles.checkbox}
              />
              <span>Reduced Motion</span>
            </label>
            <label style={styles.toggle}>
              <input
                type="checkbox"
                checked={state.settings.crt}
                onChange={() => handleToggleSetting('crt')}
                style={styles.checkbox}
              />
              <span>CRT Effect</span>
            </label>
            <label style={styles.toggle}>
              <input
                type="checkbox"
                checked={state.settings.mute}
                onChange={() => handleToggleSetting('mute')}
                style={styles.checkbox}
              />
              <span>Mute</span>
            </label>
          </div>
        </div>

        <div style={styles.seed}>
          <span style={styles.seedLabel}>RUN SEED:</span>
          <span style={styles.seedValue}>{state.rngSeed}</span>
        </div>

        <button
          className="pixel-btn pixel-btn--primary"
          onClick={handleResume}
          style={styles.resumeBtn}
        >
          RESUME
        </button>

        <p style={styles.hint}>
          Press ESC or P to resume
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
  title: {
    fontSize: '14px',
    color: '#ffcc00',
    margin: 0,
  },
  section: {
    width: '100%',
    background: '#1e1e36',
    border: '3px solid #4a4a6a',
    padding: '12px',
  },
  sectionTitle: {
    fontSize: '10px',
    color: '#aaaacc',
    margin: '0 0 12px 0',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  controlRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '9px',
    color: '#ccccee',
  },
  key: {
    background: '#3a3a5a',
    border: '2px solid #5a5a7a',
    padding: '4px 8px',
    fontSize: '8px',
    minWidth: '50px',
    textAlign: 'center',
  },
  settings: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '9px',
    color: '#ccccee',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#00ff88',
  },
  seed: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '9px',
  },
  seedLabel: {
    color: '#6a6a8a',
  },
  seedValue: {
    color: '#00ff88',
    background: '#1a1a32',
    padding: '4px 8px',
    border: '2px solid #4a4a6a',
  },
  resumeBtn: {
    marginTop: '8px',
  },
  hint: {
    fontSize: '8px',
    color: '#6a6a8a',
  },
};

