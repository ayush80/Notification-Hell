'use client';

import React from 'react';
import { useGame } from '../GameRoot';

export function LoseScreen() {
  const { state, dispatch } = useGame();

  const handleRetry = () => {
    dispatch({ type: 'START_GAME' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>GAME OVER</h1>
        
        <div style={styles.subtitle}>
          Time's up! The notifications won...
        </div>

        <div style={styles.stats}>
          <div style={styles.statRow}>
            <span>Final Score:</span>
            <span style={styles.statValue}>{state.score}</span>
          </div>
          <div style={styles.statRow}>
            <span>Interruptions:</span>
            <span style={styles.statValue}>{state.interruptionsCount}</span>
          </div>
          <div style={styles.statRow}>
            <span>Form Resets:</span>
            <span style={styles.statValue}>{state.resets}</span>
          </div>
          <div style={styles.statRow}>
            <span>Max Chaos:</span>
            <span style={styles.statValue}>{Math.round(state.chaos)}</span>
          </div>
        </div>

        <div style={styles.seed}>
          Seed: {state.rngSeed}
        </div>

        <button
          className="pixel-btn pixel-btn--danger"
          onClick={handleRetry}
          style={styles.button}
        >
          RETRY
        </button>
      </div>

      <div style={styles.glitchBg}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 100}px`,
              height: '4px',
              background: 'rgba(255, 68, 68, 0.3)',
              transform: `rotate(${Math.random() * 10 - 5}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #2e1a1a 0%, #1a0f0f 100%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    zIndex: 1,
  },
  title: {
    fontSize: '36px',
    color: '#ff4444',
    textShadow: '4px 4px 0 #660000',
  },
  subtitle: {
    fontSize: '12px',
    color: '#ff8888',
  },
  stats: {
    background: '#4a2a2a',
    border: '4px solid #6a4a4a',
    padding: '20px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '280px',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: '#ccaaaa',
  },
  statValue: {
    color: '#ff6666',
    fontWeight: 'bold',
  },
  seed: {
    fontSize: '8px',
    color: '#8a6a6a',
  },
  button: {
    marginTop: '16px',
  },
  glitchBg: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
};

