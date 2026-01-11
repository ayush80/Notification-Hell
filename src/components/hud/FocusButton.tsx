'use client';

import React from 'react';
import { useGame } from '../GameRoot';
import { playErrorBeep } from '@/game/engine';

export function FocusButton() {
  const { state, dispatch } = useGame();
  const { active, cooldownMsLeft, durationMsLeft } = state.focusMode;

  const handleClick = () => {
    if (active) return;
    
    if (cooldownMsLeft > 0) {
      playErrorBeep(state.settings.mute);
      return;
    }

    dispatch({ type: 'ACTIVATE_FOCUS_MODE' });
  };

  const isDisabled = active || cooldownMsLeft > 0;
  const buttonText = active 
    ? `${Math.ceil(durationMsLeft / 1000)}s` 
    : cooldownMsLeft > 0 
      ? `${Math.ceil(cooldownMsLeft / 1000)}s`
      : 'FOCUS';

  return (
    <button
      className={`pixel-btn ${!isDisabled ? 'pixel-btn--primary' : ''}`}
      onClick={handleClick}
      disabled={active}
      style={{
        ...styles.button,
        opacity: isDisabled ? 0.7 : 1,
        background: active 
          ? '#00ff88' 
          : cooldownMsLeft > 0 
            ? '#4a4a6a' 
            : undefined,
      }}
      title="Focus Mode (F) - Suppresses new interruptions for 8 seconds"
    >
      {buttonText}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    padding: '8px 12px',
    fontSize: '8px',
    minWidth: '80px',
  },
};

