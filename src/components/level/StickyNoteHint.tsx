'use client';

import React from 'react';

export function StickyNoteHint() {
  return (
    <div style={styles.container}>
      <div style={styles.note}>
        <div style={styles.tape} />
        <div style={styles.content}>
          <span style={styles.title}>📝 REMINDER</span>
          <span style={styles.text}>Secret Code is:</span>
          <span style={styles.code}>8BIT</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    top: '80px',
    right: '20px',
    zIndex: 50,
    pointerEvents: 'none',
  },
  note: {
    width: '140px',
    background: '#ffee88',
    padding: '20px 16px 16px',
    transform: 'rotate(3deg)',
    boxShadow: '4px 4px 8px rgba(0,0,0,0.3)',
    position: 'relative',
  },
  tape: {
    position: 'absolute',
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '16px',
    background: 'rgba(200, 200, 180, 0.7)',
    border: '1px solid rgba(150, 150, 130, 0.5)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    color: '#333',
  },
  title: {
    fontSize: '8px',
    fontWeight: 'bold',
    color: '#666',
  },
  text: {
    fontSize: '9px',
  },
  code: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#cc3333',
    textAlign: 'center',
    marginTop: '4px',
  },
};

