'use client';

import React from 'react';
import { useGame } from '../GameRoot';
import { initAudio } from '@/game/engine';

export function MenuScreen() {
  const { state, dispatch } = useGame();

  const handleStart = () => {
    initAudio();
    dispatch({ type: 'SET_AUDIO_INITIALIZED' });
    dispatch({ type: 'START_GAME' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>
          <span style={styles.titleLine1}>NOTIFICATION</span>
          <span style={styles.titleLine2}>HELL</span>
        </h1>
        
        <p style={styles.subtitle}>
          Complete the form... if you can!
        </p>

        <div style={styles.instructions}>
          <p>* Fill out all 10 fields</p>
          <p>* Before time runs out</p>
          <p>* Survive the interruptions</p>
        </div>

        <button
          className="pixel-btn pixel-btn--primary"
          onClick={handleStart}
          style={styles.startButton}
        >
          START GAME
        </button>

        <div style={styles.settings}>
          <label style={styles.toggle}>
            <input
              type="checkbox"
              checked={state.settings.reducedMotion}
              onChange={(e) => dispatch({ type: 'UPDATE_SETTING', setting: 'reducedMotion', value: e.target.checked })}
              style={styles.checkbox}
            />
            <span>Reduced Motion</span>
          </label>
          
          <label style={styles.toggle}>
            <input
              type="checkbox"
              checked={state.settings.crt}
              onChange={(e) => dispatch({ type: 'UPDATE_SETTING', setting: 'crt', value: e.target.checked })}
              style={styles.checkbox}
            />
            <span>CRT Effect</span>
          </label>
          
          <label style={styles.toggle}>
            <input
              type="checkbox"
              checked={state.settings.mute}
              onChange={(e) => dispatch({ type: 'UPDATE_SETTING', setting: 'mute', value: e.target.checked })}
              style={styles.checkbox}
            />
            <span>Mute</span>
          </label>
        </div>

        <div style={styles.controls}>
          <p style={styles.controlsTitle}>CONTROLS</p>
          <p>ESC - Close overlay</p>
          <p>F - Focus Mode</p>
          <p>P - Pause</p>
          <p>TAB - Navigate</p>
        </div>
      </div>

      <div style={styles.decoration}>
        <div style={styles.pixel1} />
        <div style={styles.pixel2} />
        <div style={styles.pixel3} />
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
    background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    textShadow: '4px 4px 0 #ff6b9d, 8px 8px 0 #00ff88',
  },
  titleLine1: {
    fontSize: '24px',
    color: '#ffcc00',
  },
  titleLine2: {
    fontSize: '48px',
    color: '#ff4444',
  },
  subtitle: {
    fontSize: '12px',
    color: '#aaaacc',
    textAlign: 'center',
  },
  instructions: {
    background: '#2a2a4a',
    border: '4px solid #4a4a6a',
    padding: '16px 24px',
    fontSize: '10px',
    lineHeight: '2',
    color: '#ffffff',
  },
  startButton: {
    fontSize: '14px',
    padding: '16px 48px',
    marginTop: '16px',
  },
  settings: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '24px',
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '10px',
    color: '#aaaacc',
    cursor: 'pointer',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    accentColor: '#00ff88',
  },
  controls: {
    marginTop: '24px',
    fontSize: '8px',
    color: '#6a6a8a',
    textAlign: 'center',
    lineHeight: '2',
  },
  controlsTitle: {
    color: '#aaaacc',
    marginBottom: '8px',
  },
  decoration: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  pixel1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '16px',
    height: '16px',
    background: '#ff6b9d',
    opacity: 0.3,
  },
  pixel2: {
    position: 'absolute',
    bottom: '20%',
    right: '15%',
    width: '24px',
    height: '24px',
    background: '#00ff88',
    opacity: 0.2,
  },
  pixel3: {
    position: 'absolute',
    top: '30%',
    right: '20%',
    width: '12px',
    height: '12px',
    background: '#ffcc00',
    opacity: 0.25,
  },
};

