'use client';

import React from 'react';

interface ChaosMeterProps {
  chaos: number;
}

export function ChaosMeter({ chaos }: ChaosMeterProps) {
  const percentage = Math.min(100, Math.max(0, chaos));
  
  let color: string;
  if (chaos < 30) {
    color = '#44ff88';
  } else if (chaos < 60) {
    color = '#ffcc00';
  } else {
    color = '#ff4444';
  }

  return (
    <div style={styles.container}>
      <div style={styles.label}>
        CHAOS: {Math.round(chaos)}
      </div>
      <div style={styles.track}>
        <div 
          style={{
            ...styles.fill,
            width: `${percentage}%`,
            background: color,
          }}
        />
        <div style={styles.segments}>
          {[...Array(10)].map((_, i) => (
            <div key={i} style={styles.segment} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    width: '100%',
    maxWidth: '240px',
  },
  label: {
    fontSize: '8px',
    color: '#aaaacc',
  },
  track: {
    width: '100%',
    height: '16px',
    background: '#1a1a32',
    border: '3px solid #4a4a6a',
    borderTopColor: '#2a2a4a',
    borderLeftColor: '#2a2a4a',
    position: 'relative',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    transition: 'width 0.3s ease-out',
    position: 'relative',
  },
  segments: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
  },
  segment: {
    flex: 1,
    borderRight: '2px solid rgba(0,0,0,0.3)',
  },
};

