'use client';

import React, { useState, useRef, useEffect } from 'react';
import { OverlayInstance } from '@/game/state';
import { useGame } from '../GameRoot';
import { ModalFrame } from './ModalFrame';
import { playErrorBeep, playSuccessBeep } from '@/game/engine';

interface ChatOverlayProps {
  overlay: OverlayInstance;
  isTopmost: boolean;
}

export function ChatOverlay({ overlay, isTopmost }: ChatOverlayProps) {
  const { state, dispatch } = useGame();
  const [reply, setReply] = useState('');
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTopmost && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTopmost]);

  const handleSend = () => {
    if (reply.trim() === '') return;

    setSent(true);
    
    if (reply.trim().toUpperCase() === '8BIT') {
      playSuccessBeep(state.settings.mute);
      dispatch({ type: 'ADD_SCORE', amount: 50 });
      dispatch({ type: 'ADJUST_CHAOS', amount: -10 });
    } else {
      playErrorBeep(state.settings.mute);
      dispatch({ type: 'ADD_SCORE', amount: -50 });
      dispatch({ type: 'ADJUST_CHAOS', amount: 5 });
    }

    setTimeout(() => {
      dispatch({ type: 'POP_OVERLAY', id: overlay.id });
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !sent) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      e.stopPropagation();
      playErrorBeep(state.settings.mute);
    }
  };

  const isCorrect = reply.trim().toUpperCase() === '8BIT';

  return (
    <ModalFrame 
      title="NEW MESSAGE" 
      variant="info" 
      isTopmost={isTopmost}
    >
      <div style={styles.container}>
        <div style={styles.chatBubble}>
          <div style={styles.avatar}>?</div>
          <div style={styles.messageBox}>
            <span style={styles.sender}>Anonymous_Hacker42</span>
            <p style={styles.messageText}>
              u there?? what's the secret code??
            </p>
          </div>
        </div>

        {!sent ? (
          <>
            <div style={styles.replySection}>
              <input
                ref={inputRef}
                type="text"
                className="pixel-input"
                placeholder="Type your reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={handleKeyDown}
                style={styles.input}
              />
            </div>

            <button
              className="pixel-btn pixel-btn--primary"
              onClick={handleSend}
              disabled={reply.trim() === ''}
              style={styles.sendBtn}
            >
              SEND REPLY
            </button>

            <p style={styles.hint}>
              (You must reply to close this!)
            </p>
          </>
        ) : (
          <div style={styles.sentFeedback}>
            {isCorrect ? (
              <>
                <span style={styles.successIcon}>✓</span>
                <span style={styles.successText}>Correct! +50 points</span>
              </>
            ) : (
              <>
                <span style={styles.errorIcon}>✗</span>
                <span style={styles.errorText}>Wrong! -50 points</span>
              </>
            )}
          </div>
        )}
      </div>
    </ModalFrame>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  chatBubble: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  avatar: {
    width: '40px',
    height: '40px',
    background: '#3a3a5a',
    border: '3px solid #5a5a7a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },
  messageBox: {
    background: '#1a1a32',
    border: '2px solid #4a4a6a',
    padding: '10px 14px',
    flex: 1,
  },
  sender: {
    fontSize: '8px',
    color: '#66aaff',
    display: 'block',
    marginBottom: '4px',
  },
  messageText: {
    fontSize: '10px',
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.5,
  },
  replySection: {
    marginTop: '8px',
  },
  input: {
    width: '100%',
  },
  sendBtn: {
    alignSelf: 'flex-end',
  },
  hint: {
    fontSize: '8px',
    color: '#6a6a8a',
    textAlign: 'center',
  },
  sentFeedback: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px',
  },
  successIcon: {
    fontSize: '24px',
    color: '#00ff88',
  },
  successText: {
    fontSize: '12px',
    color: '#00ff88',
  },
  errorIcon: {
    fontSize: '24px',
    color: '#ff4444',
  },
  errorText: {
    fontSize: '12px',
    color: '#ff4444',
  },
};

