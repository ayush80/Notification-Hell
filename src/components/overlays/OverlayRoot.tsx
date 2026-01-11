'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '../GameRoot';
import { OverlayInstance } from '@/game/state';
import { ModalFrame } from './ModalFrame';
import { RateUsOverlay } from './RateUsOverlay';
import { WarningOverlay } from './WarningOverlay';
import { ChatOverlay } from './ChatOverlay';
import { AreYouSurePopup } from './AreYouSurePopup';
import { SystemUpdateOverlay } from './SystemUpdateOverlay';
import { SessionExpiredOverlay } from './SessionExpiredOverlay';
import { PauseOverlay } from './PauseOverlay';
import { GlitchFlash } from './GlitchFlash';

function OverlayRenderer({ overlay, isTopmost }: { overlay: OverlayInstance; isTopmost: boolean }) {
  switch (overlay.type) {
    case 'RATE_US':
      return <RateUsOverlay overlay={overlay} isTopmost={isTopmost} />;
    case 'WARNING':
      return <WarningOverlay overlay={overlay} isTopmost={isTopmost} />;
    case 'CHAT':
      return <ChatOverlay overlay={overlay} isTopmost={isTopmost} />;
    case 'ARE_YOU_SURE':
      return <AreYouSurePopup overlay={overlay} isTopmost={isTopmost} />;
    case 'SYSTEM_UPDATE':
      return <SystemUpdateOverlay overlay={overlay} isTopmost={isTopmost} />;
    case 'SESSION_EXPIRED':
      return <SessionExpiredOverlay overlay={overlay} isTopmost={isTopmost} />;
    case 'PAUSE':
      return <PauseOverlay overlay={overlay} isTopmost={isTopmost} />;
    case 'GLITCH':
      return <GlitchFlash overlay={overlay} />;
    default:
      return null;
  }
}

export function OverlayRoot() {
  const { state, dispatch } = useGame();
  const portalRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    portalRef.current = document.getElementById('overlay-root');
  }, []);

  // Save focus when opening overlay
  useEffect(() => {
    if (state.overlay.stack.length > 0 && state.overlay.lastFocusSelector === null) {
      const activeEl = document.activeElement;
      if (activeEl && activeEl instanceof HTMLElement) {
        const selector = generateSelector(activeEl);
        dispatch({ type: 'SAVE_FOCUS', selector });
      }
    }
    
    // Restore focus when all overlays closed
    if (state.overlay.stack.length === 0 && state.overlay.lastFocusSelector) {
      const el = document.querySelector(state.overlay.lastFocusSelector);
      if (el instanceof HTMLElement) {
        setTimeout(() => el.focus(), 10);
      }
      dispatch({ type: 'SAVE_FOCUS', selector: null });
    }
  }, [state.overlay.stack.length, state.overlay.lastFocusSelector, dispatch]);

  if (!portalRef.current) {
    return null;
  }

  return createPortal(
    <>
      {state.overlay.stack.map((overlay, index) => {
        const isTopmost = index === state.overlay.stack.length - 1;
        const zIndex = 1000 + index * 10 + (overlay.size === 'small' ? 1000 : 0);
        
        return (
          <div
            key={overlay.id}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {overlay.type !== 'GLITCH' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.7)',
                }}
              />
            )}
            <OverlayRenderer overlay={overlay} isTopmost={isTopmost} />
          </div>
        );
      })}
    </>,
    portalRef.current
  );
}

function generateSelector(el: HTMLElement): string {
  if (el.id) {
    return `#${el.id}`;
  }
  if (el.className && typeof el.className === 'string') {
    const classes = el.className.split(' ').filter(c => c.trim()).join('.');
    if (classes) {
      return `${el.tagName.toLowerCase()}.${classes}`;
    }
  }
  return el.tagName.toLowerCase();
}

