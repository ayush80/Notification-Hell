'use client';

import React from 'react';
import { useGame } from '../GameRoot';
import { ChaosMeter } from './ChaosMeter';
import { FocusButton } from './FocusButton';
import { formatTime } from '@/game/utils';

export function HUD() {
  const { state, dispatch } = useGame();

  const handlePause = () => {
    if (state.phase === 'playing') {
      dispatch({ type: 'PAUSE_GAME' });
    } else if (state.phase === 'paused') {
      dispatch({ type: 'RESUME_GAME' });
    }
  };

  const timerColor = state.timeLeftMs < 30000 
    ? '#ff4444' 
    : state.timeLeftMs < 60000 
      ? '#ffcc00' 
      : '#00ff88';

  const timerPulse = state.timeLeftMs < 15000 && !state.settings.reducedMotion;

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.timerBox}>
          <span style={styles.timerLabel}>TIME</span>
          <span 
            style={{ 
              ...styles.timerValue, 
              color: timerColor,
            }}
            className={timerPulse ? 'pulse' : ''}
          >
            {formatTime(state.timeLeftMs)}
          </span>
        </div>
        
        <div style={styles.scoreBox}>
          <span style={styles.scoreLabel}>SCORE</span>
          <span style={styles.scoreValue}>{state.score}</span>
        </div>
      </div>

      <div style={styles.center}>
        <ChaosMeter chaos={state.chaos} />
      </div>

      <div style={styles.right}>
        <FocusButton />
        
        <button
          className="pixel-btn"
          onClick={handlePause}
          style={styles.pauseBtn}
        >
          {state.phase === 'paused' ? 'RESUME' : 'PAUSE'}
        </button>
      </div>

      {state.focusMode.active && (
        <div style={styles.focusModeIndicator}>
          FOCUS MODE: {Math.ceil(state.focusMode.durationMsLeft / 1000)}s
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: '#1e1e36',
    borderBottom: '4px solid #4a4a6a',
    flexWrap: 'wrap',
    gap: '12px',
    zIndex: 100,
  },
  left: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    minWidth: '200px',
  },
  right: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  timerBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: '8px',
    color: '#6a6a8a',
  },
  timerValue: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  scoreBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: '8px',
    color: '#6a6a8a',
  },
  scoreValue: {
    fontSize: '14px',
    color: '#ffcc00',
  },
  pauseBtn: {
    padding: '8px 16px',
    fontSize: '8px',
  },
  focusModeIndicator: {
    position: 'absolute',
    top: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#00cc6a',
    color: '#0f0f1a',
    padding: '8px 16px',
    fontSize: '10px',
    border: '3px solid #00ff88',
    zIndex: 101,
  },
};

