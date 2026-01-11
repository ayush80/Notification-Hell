'use client';

import React, { useState } from 'react';
import { OverlayInstance } from '@/game/state';
import { useGame } from '../GameRoot';
import { ModalFrame } from './ModalFrame';
import { playErrorBeep, playSuccessBeep } from '@/game/engine';

interface RateUsOverlayProps {
  overlay: OverlayInstance;
  isTopmost: boolean;
}

export function RateUsOverlay({ overlay, isTopmost }: RateUsOverlayProps) {
  const { state, dispatch } = useGame();
  const [rating, setRating] = useState(0);
  const [attempted, setAttempted] = useState(false);

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      setAttempted(true);
      return;
    }

    playSuccessBeep(state.settings.mute);
    dispatch({ type: 'ADJUST_CHAOS', amount: -10 });
    dispatch({ type: 'POP_OVERLAY', id: overlay.id });
  };

  const handleEscapeAttempt = () => {
    playErrorBeep(state.settings.mute);
  };

  return (
    <ModalFrame 
      title="⭐ RATE OUR APP!" 
      variant="info" 
      isTopmost={isTopmost}
    >
      <div style={styles.container}>
        <p style={styles.text}>
          Your feedback means everything to us!
        </p>
        
        <div style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`star ${rating >= star ? 'filled' : ''}`}
              onClick={() => handleStarClick(star)}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              ★
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p style={styles.ratingText}>
            You selected: {rating} star{rating > 1 ? 's' : ''}
          </p>
        )}

        {attempted && rating === 0 && (
          <p style={styles.error}>
            Please select a rating first!
          </p>
        )}

        <button
          className="pixel-btn pixel-btn--primary"
          onClick={handleSubmit}
          style={styles.submitBtn}
        >
          SUBMIT RATING
        </button>

        <p style={styles.escapeNote} onClick={handleEscapeAttempt}>
          ⚠️ You can't escape feedback!
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
  text: {
    fontSize: '10px',
    color: '#aaaacc',
    textAlign: 'center',
  },
  stars: {
    display: 'flex',
    gap: '8px',
  },
  ratingText: {
    fontSize: '10px',
    color: '#ffcc00',
  },
  error: {
    fontSize: '10px',
    color: '#ff4444',
  },
  submitBtn: {
    marginTop: '8px',
  },
  escapeNote: {
    fontSize: '8px',
    color: '#6a6a8a',
    marginTop: '12px',
    cursor: 'pointer',
  },
};

