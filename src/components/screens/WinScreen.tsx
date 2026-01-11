'use client';

import React from 'react';
import { useGame } from '../GameRoot';
import { formatTime } from '@/game/utils';

export function WinScreen() {
  const { state, dispatch } = useGame();

  const handlePlayAgain = () => {
    dispatch({ type: 'START_GAME' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>YOU WIN!</h1>
        
        <div style={styles.subtitle}>
          Form Submitted Successfully!
        </div>

        <div style={styles.stats}>
          <div style={styles.statRow}>
            <span>Final Score:</span>
            <span style={styles.statValue}>{state.score}</span>
          </div>
          <div style={styles.statRow}>
            <span>Time Remaining:</span>
            <span style={styles.statValue}>{formatTime(state.timeLeftMs)}</span>
          </div>
          <div style={styles.statRow}>
            <span>Interruptions:</span>
            <span style={styles.statValue}>{state.interruptionsCount}</span>
          </div>
          <div style={styles.statRow}>
            <span>Form Resets:</span>
            <span style={styles.statValue}>{state.resets}</span>
          </div>
        </div>

        <div style={styles.seed}>
          Seed: {state.rngSeed}
        </div>

        <button
          className="pixel-btn pixel-btn--primary"
          onClick={handlePlayAgain}
          style={styles.button}
        >
          PLAY AGAIN
        </button>
      </div>

      <div style={styles.confetti}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.confettiPiece,
              left: `${8 + i * 8}%`,
              animationDelay: `${i * 0.1}s`,
              background: ['#00ff88', '#ff6b9d', '#ffcc00', '#44aaff'][i % 4],
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
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
    background: 'linear-gradient(180deg, #1a3a2e 0%, #0f1f1a 100%)',
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
    color: '#00ff88',
    textShadow: '4px 4px 0 #006633',
  },
  subtitle: {
    fontSize: '12px',
    color: '#88ffbb',
  },
  stats: {
    background: '#2a4a3a',
    border: '4px solid #4a6a5a',
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
    color: '#aaccbb',
  },
  statValue: {
    color: '#00ff88',
    fontWeight: 'bold',
  },
  seed: {
    fontSize: '8px',
    color: '#6a8a7a',
  },
  button: {
    marginTop: '16px',
  },
  confetti: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  confettiPiece: {
    position: 'absolute',
    top: '-20px',
    width: '12px',
    height: '12px',
    animation: 'confettiFall 3s linear infinite',
  },
};

