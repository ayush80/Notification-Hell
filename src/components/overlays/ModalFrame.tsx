'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { trapFocus, getFocusableElements } from '@/game/utils';

interface ModalFrameProps {
  children: React.ReactNode;
  title?: string;
  size?: 'large' | 'small';
  variant?: 'default' | 'warning' | 'danger' | 'success' | 'info';
  isTopmost?: boolean;
  onClose?: () => void;
}

const VARIANT_STYLES: Record<string, { borderColor: string; titleColor: string; bgColor: string }> = {
  default: {
    borderColor: '#6a6a8a',
    titleColor: '#ffcc00',
    bgColor: '#2a2a4a',
  },
  warning: {
    borderColor: '#aa8800',
    titleColor: '#ffcc00',
    bgColor: '#3a3a2a',
  },
  danger: {
    borderColor: '#aa4444',
    titleColor: '#ff6666',
    bgColor: '#3a2a2a',
  },
  success: {
    borderColor: '#44aa44',
    titleColor: '#66ff66',
    bgColor: '#2a3a2a',
  },
  info: {
    borderColor: '#4488aa',
    titleColor: '#66aaff',
    bgColor: '#2a2a3a',
  },
};

export function ModalFrame({ 
  children, 
  title, 
  size = 'large', 
  variant = 'default',
  isTopmost = false,
  onClose,
}: ModalFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.default;

  // Focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!containerRef.current || !isTopmost) return;
    trapFocus(containerRef.current, e);
  }, [isTopmost]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Focus first element when mounted
  useEffect(() => {
    if (!containerRef.current || !isTopmost) return;
    
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      const focusable = getFocusableElements(containerRef.current);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [isTopmost]);

  const sizeStyles: React.CSSProperties = size === 'large' 
    ? { width: '90%', maxWidth: '500px', maxHeight: '80vh' }
    : { width: '90%', maxWidth: '320px' };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      style={{
        ...styles.container,
        ...sizeStyles,
        background: variantStyle.bgColor,
        borderColor: variantStyle.borderColor,
      }}
    >
      <div 
        style={{
          ...styles.titleBar,
          background: variantStyle.borderColor,
        }}
      >
        {title && (
          <span id="modal-title" style={{ ...styles.title, color: '#ffffff' }}>
            {title}
          </span>
        )}
        {onClose && (
          <button
            onClick={onClose}
            style={styles.closeBtn}
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    border: '4px solid',
    boxShadow: '8px 8px 0 rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  titleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    minHeight: '32px',
  },
  title: {
    fontSize: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '4px 8px',
    lineHeight: 1,
    fontFamily: 'inherit',
  },
  content: {
    padding: '20px',
    overflowY: 'auto',
  },
};

