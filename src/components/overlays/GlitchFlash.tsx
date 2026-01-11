'use client';

import React, { useEffect } from 'react';
import { OverlayInstance } from '@/game/state';
import { useGame } from '../GameRoot';

interface GlitchFlashProps {
  overlay: OverlayInstance;
}

export function GlitchFlash({ overlay }: GlitchFlashProps) {
  const { state, dispatch } = useGame();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'POP_OVERLAY', id: overlay.id });
    }, 300);

    return () => clearTimeout(timer);
  }, [overlay.id, dispatch]);

  if (state.settings.reducedMotion) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.6)',
          zIndex: 10000,
          animation: 'fadeOut 0.3s forwards',
        }}
      />
    );
  }

  return (
    <div className="glitch-flash" />
  );
}

