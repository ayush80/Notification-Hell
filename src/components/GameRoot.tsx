'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import { GameState, GameAction, gameReducer, createInitialState, OverlayInstance } from '@/game/state';
import { engineTick, initAudio, playOpenBeep, playErrorBeep } from '@/game/engine';
import { MenuScreen } from './screens/MenuScreen';
import { WinScreen } from './screens/WinScreen';
import { LoseScreen } from './screens/LoseScreen';
import { HUD } from './hud/HUD';
import { FormLevel } from './level/FormLevel';
import { StickyNoteHint } from './level/StickyNoteHint';
import { OverlayRoot } from './overlays/OverlayRoot';

// Context
interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}

export function GameRoot() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const lastTickRef = useRef<number>(performance.now());
  const rafRef = useRef<number>(0);

  // Game loop
  useEffect(() => {
    const tick = (timestamp: number) => {
      const deltaMs = timestamp - lastTickRef.current;
      lastTickRef.current = timestamp;

      if (state.phase === 'playing') {
        const { actions } = engineTick(state, deltaMs, state.elapsedMs + deltaMs);
        actions.forEach((action) => dispatch(action));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [state]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      
      if (state.phase === 'playing' || state.phase === 'paused') {
        if (e.key === 'p' || e.key === 'P') {
          if (!isTyping) {
            e.preventDefault();
            if (state.phase === 'playing') {
              dispatch({ type: 'PAUSE_GAME' });
            } else {
              dispatch({ type: 'RESUME_GAME' });
            }
          }
        }
        
        if (e.key === 'f' || e.key === 'F') {
          if (!isTyping && state.phase === 'playing') {
            e.preventDefault();
            if (!state.focusMode.active && state.focusMode.cooldownMsLeft === 0) {
              dispatch({ type: 'ACTIVATE_FOCUS_MODE' });
            } else {
              playErrorBeep(state.settings.mute);
            }
          }
        }

        if (e.key === 'Escape') {
          const topOverlay = state.overlay.stack[state.overlay.stack.length - 1];
          if (topOverlay) {
            if (topOverlay.type === 'PAUSE') {
              e.preventDefault();
              dispatch({ type: 'RESUME_GAME' });
            } else if (topOverlay.canEscClose) {
              e.preventDefault();
              dispatch({ type: 'POP_OVERLAY', id: topOverlay.id });
              dispatch({ type: 'ADJUST_CHAOS', amount: -5 });
            } else {
              e.preventDefault();
              playErrorBeep(state.settings.mute);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.phase, state.overlay.stack, state.focusMode, state.settings.mute]);

  // CRT class on body
  useEffect(() => {
    document.body.classList.toggle('reduced-motion', state.settings.reducedMotion);
  }, [state.settings.reducedMotion]);

  const hasBlockingOverlay = state.overlay.stack.some((o) => o.blocking && o.type !== 'GLITCH');

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <div 
        className="game-root"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {state.phase === 'menu' && <MenuScreen />}
        
        {(state.phase === 'playing' || state.phase === 'paused') && (
          <>
            <HUD />
            <div 
              style={{ 
                flex: 1, 
                display: 'flex', 
                position: 'relative',
                overflow: 'auto',
              }}
              {...(hasBlockingOverlay ? { inert: '' } : {})}
            >
              <FormLevel />
              <StickyNoteHint />
            </div>
            <OverlayRoot />
          </>
        )}
        
        {state.phase === 'won' && <WinScreen />}
        {state.phase === 'lost' && <LoseScreen />}
        
        {state.settings.crt && <div className="crt-overlay" />}
      </div>
    </GameContext.Provider>
  );
}

