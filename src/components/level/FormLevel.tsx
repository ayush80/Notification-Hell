'use client';

import React, { useRef, useCallback } from 'react';
import { useGame } from '../GameRoot';
import { FieldId, OverlayInstance } from '@/game/state';
import { createRng } from '@/game/rng';
import { generateId } from '@/game/utils';
import { playSuccessBeep, YES_IS_CORRECT_PROMPTS } from '@/game/engine';

const STATES = ['CA', 'NY', 'TX', 'IL', 'WA'];
const COLORS = ['Red', 'Blue', 'Green', 'Purple'];

const FIELD_CONFIG: { id: FieldId; label: string; type: string; placeholder?: string }[] = [
  { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
  { id: 'phone', label: 'Phone (###-###-####)', type: 'tel', placeholder: '555-123-4567' },
  { id: 'address', label: 'Address Line 1', type: 'text', placeholder: '123 Pixel Street' },
  { id: 'city', label: 'City', type: 'text', placeholder: 'Retroville' },
  { id: 'state', label: 'State', type: 'select' },
  { id: 'zip', label: 'ZIP Code (5 digits)', type: 'text', placeholder: '12345' },
  { id: 'favoriteColor', label: 'Favorite Color', type: 'select' },
  { id: 'secretCode', label: 'Secret Code', type: 'text', placeholder: '???' },
  { id: 'terms', label: 'I accept the Terms & Conditions', type: 'checkbox' },
];

// Submit-specific prompts (always yes = correct for submit)
const SUBMIT_PROMPTS = [
  { message: 'Submit your form?', yesLabel: 'SUBMIT', noLabel: 'CANCEL' },
  { message: 'Finalize submission?', yesLabel: 'FINALIZE', noLabel: 'GO BACK' },
  { message: 'Confirm and send?', yesLabel: 'SEND', noLabel: 'WAIT' },
  { message: 'Complete registration?', yesLabel: 'COMPLETE', noLabel: 'ABORT' },
  { message: 'Ready to submit?', yesLabel: 'READY', noLabel: 'NOT YET' },
];

export function FormLevel() {
  const { state, dispatch } = useGame();
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = useCallback((field: FieldId, value: string | boolean) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, [dispatch]);

  const handleBlur = useCallback((field: FieldId) => {
    dispatch({ type: 'TOUCH_FIELD', field });
  }, [dispatch]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch({ type: 'VALIDATE_FORM' });
    
    if (!state.form.valid) {
      if (!state.settings.reducedMotion && formRef.current) {
        formRef.current.classList.add('shake');
        setTimeout(() => formRef.current?.classList.remove('shake'), 300);
      }
      return;
    }

    // Check for "Are You Sure?" popup (60% chance - increased)
    const rng = createRng(state.rngSeed);
    rng.setState(state.rngInternalState);
    
    if (rng.nextBool(0.6)) {
      const prompt = rng.pick(SUBMIT_PROMPTS);
      const overlay: OverlayInstance = {
        id: generateId(),
        type: 'ARE_YOU_SURE',
        createdAtMs: Date.now(),
        size: 'small',
        blocking: true,
        critical: true,
        canEscClose: false,
        payload: { 
          message: prompt.message,
          yesLabel: prompt.yesLabel,
          noLabel: prompt.noLabel,
          correctAnswer: 'yes',
          isSubmitCheck: true,
        },
      };
      dispatch({ type: 'SET_RNG_STATE', state: rng.getState() });
      dispatch({ type: 'PUSH_OVERLAY', overlay });
      return;
    }

    dispatch({ type: 'SET_RNG_STATE', state: rng.getState() });
    playSuccessBeep(state.settings.mute);
    dispatch({ type: 'WIN_GAME' });
  }, [state.form.valid, state.rngSeed, state.rngInternalState, state.settings, dispatch]);

  const renderField = (config: typeof FIELD_CONFIG[0]) => {
    const { id, label, type, placeholder } = config;
    const value = state.form.values[id];
    const error = state.form.errors[id];
    const touched = state.form.touched[id];

    if (type === 'checkbox') {
      return (
        <div key={id} style={styles.checkboxField}>
          <label className="pixel-checkbox-wrapper">
            <input
              type="checkbox"
              className="pixel-checkbox"
              checked={value as boolean}
              onChange={(e) => handleChange(id, e.target.checked)}
              onBlur={() => handleBlur(id)}
            />
            <span style={styles.checkboxLabel}>{label}</span>
          </label>
          {touched && error && <span className="form-error">{error}</span>}
        </div>
      );
    }

    if (type === 'select') {
      const options = id === 'state' ? STATES : COLORS;
      return (
        <div key={id} className="form-field">
          <label className="form-label">{label}</label>
          <select
            className={`pixel-select ${touched && error ? 'invalid' : touched && !error ? 'valid' : ''}`}
            value={value as string}
            onChange={(e) => handleChange(id, e.target.value)}
            onBlur={() => handleBlur(id)}
          >
            <option value="">Select...</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {touched && error && <span className="form-error">{error}</span>}
        </div>
      );
    }

    return (
      <div key={id} className="form-field">
        <label className="form-label">{label}</label>
        <input
          type={type}
          className={`pixel-input ${touched && error ? 'invalid' : touched && !error ? 'valid' : ''}`}
          value={value as string}
          placeholder={placeholder}
          onChange={(e) => handleChange(id, e.target.value)}
          onBlur={() => handleBlur(id)}
        />
        {touched && error && <span className="form-error">{error}</span>}
      </div>
    );
  };

  const filledCount = Object.entries(state.form.values).filter(([key, val]) => {
    if (key === 'terms') return val === true;
    return typeof val === 'string' && val.trim().length > 0;
  }).length;

  return (
    <div style={styles.container}>
      <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.header}>
          <h2 style={styles.title}>📋 COMPLETE THE FORM</h2>
          <div style={styles.progress}>
            {filledCount}/10 fields
          </div>
        </div>

        <div style={styles.fieldsGrid}>
          {FIELD_CONFIG.map(renderField)}
        </div>

        <div style={styles.footer}>
          <button
            type="submit"
            className="pixel-btn pixel-btn--primary"
            disabled={!state.form.valid}
            style={styles.submitBtn}
          >
            SUBMIT FORM
          </button>
        </div>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '24px',
    overflowY: 'auto',
  },
  form: {
    background: '#2a2a4a',
    border: '4px solid #4a4a6a',
    borderTopColor: '#6a6a8a',
    borderLeftColor: '#6a6a8a',
    boxShadow: '8px 8px 0 rgba(0,0,0,0.3)',
    padding: '24px',
    width: '100%',
    maxWidth: '500px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    fontSize: '14px',
    color: '#ffcc00',
    margin: 0,
  },
  progress: {
    fontSize: '10px',
    color: '#00ff88',
    background: '#1a1a32',
    padding: '6px 12px',
    border: '2px solid #4a4a6a',
  },
  fieldsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  checkboxField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '12px',
    marginBottom: '8px',
  },
  checkboxLabel: {
    fontSize: '10px',
  },
  footer: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'center',
  },
  submitBtn: {
    fontSize: '12px',
    padding: '14px 32px',
  },
};
