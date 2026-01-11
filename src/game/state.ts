import { generateSeed } from './rng';
import { generateId } from './utils';

// Field IDs
export type FieldId = 
  | 'fullName'
  | 'email'
  | 'phone'
  | 'address'
  | 'city'
  | 'state'
  | 'zip'
  | 'favoriteColor'
  | 'secretCode'
  | 'terms';

// Overlay types
export type OverlayType = 
  | 'RATE_US'
  | 'WARNING'
  | 'CHAT'
  | 'ARE_YOU_SURE'
  | 'SYSTEM_UPDATE'
  | 'SESSION_EXPIRED'
  | 'PAUSE'
  | 'GLITCH'
  | 'NICE_TRY';

export interface OverlayInstance {
  id: string;
  type: OverlayType;
  createdAtMs: number;
  size: 'large' | 'small';
  blocking: boolean;
  critical: boolean;
  canEscClose: boolean;
  payload: Record<string, unknown>;
}

export interface FormState {
  values: Record<FieldId, string | boolean>;
  touched: Record<FieldId, boolean>;
  valid: boolean;
  errors: Record<FieldId, string>;
}

export interface FocusModeState {
  active: boolean;
  cooldownMsLeft: number;
  durationMsLeft: number;
}

export interface SettingsState {
  reducedMotion: boolean;
  mute: boolean;
  crt: boolean;
}

export interface OverlayState {
  stack: OverlayInstance[];
  lastFocusSelector: string | null;
  criticalDeadlineMs: number | null;
  nextAreYouSureAtMs: number;
  chatShownAtLeastOnce: boolean;
  nextSpawnAtMs: number;
  lastLargeOverlayType: OverlayType | null;
}

export type GamePhase = 'menu' | 'playing' | 'won' | 'lost' | 'paused';

export interface GameState {
  phase: GamePhase;
  timeLeftMs: number;
  elapsedMs: number;
  score: number;
  chaos: number;
  resets: number;
  interruptionsCount: number;
  focusMode: FocusModeState;
  settings: SettingsState;
  form: FormState;
  overlay: OverlayState;
  rngSeed: number;
  rngInternalState: number;
  audioInitialized: boolean;
}

// Initial values
const INITIAL_TIME_MS = 120000;
const INITIAL_SCORE = 1000;

export function createInitialFormState(): FormState {
  return {
    values: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      favoriteColor: '',
      secretCode: '',
      terms: false,
    },
    touched: {
      fullName: false,
      email: false,
      phone: false,
      address: false,
      city: false,
      state: false,
      zip: false,
      favoriteColor: false,
      secretCode: false,
      terms: false,
    },
    valid: false,
    errors: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      favoriteColor: '',
      secretCode: '',
      terms: '',
    },
  };
}

export function createInitialState(): GameState {
  const seed = generateSeed();
  return {
    phase: 'menu',
    timeLeftMs: INITIAL_TIME_MS,
    elapsedMs: 0,
    score: INITIAL_SCORE,
    chaos: 0,
    resets: 0,
    interruptionsCount: 0,
    focusMode: {
      active: false,
      cooldownMsLeft: 0,
      durationMsLeft: 0,
    },
    settings: {
      reducedMotion: false,
      mute: false,
      crt: true,
    },
    form: createInitialFormState(),
    overlay: {
      stack: [],
      lastFocusSelector: null,
      criticalDeadlineMs: null,
      nextAreYouSureAtMs: 8000,
      chatShownAtLeastOnce: false,
      nextSpawnAtMs: 3000,
      lastLargeOverlayType: null,
    },
    rngSeed: seed,
    rngInternalState: seed,
    audioInitialized: false,
  };
}

// Actions
export type GameAction =
  | { type: 'START_GAME'; seed?: number }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'WIN_GAME' }
  | { type: 'LOSE_GAME' }
  | { type: 'TICK'; deltaMs: number }
  | { type: 'UPDATE_FIELD'; field: FieldId; value: string | boolean }
  | { type: 'TOUCH_FIELD'; field: FieldId }
  | { type: 'VALIDATE_FORM' }
  | { type: 'RESET_FORM'; cause: 'AreYouSureNo' | 'RestartApp' | 'SessionExpired' }
  | { type: 'PUSH_OVERLAY'; overlay: OverlayInstance }
  | { type: 'POP_OVERLAY'; id?: string }
  | { type: 'UPDATE_OVERLAY'; id: string; payload: Record<string, unknown> }
  | { type: 'CLEAR_OVERLAYS' }
  | { type: 'TRIGGER_SESSION_EXPIRED' }
  | { type: 'ACTIVATE_FOCUS_MODE' }
  | { type: 'UPDATE_SETTING'; setting: keyof SettingsState; value: boolean }
  | { type: 'ADD_SCORE'; amount: number }
  | { type: 'ADJUST_CHAOS'; amount: number }
  | { type: 'SET_NEXT_SPAWN_AT'; ms: number }
  | { type: 'SET_NEXT_ARE_YOU_SURE_AT'; ms: number }
  | { type: 'SET_CHAT_SHOWN' }
  | { type: 'SET_CRITICAL_DEADLINE'; ms: number | null }
  | { type: 'SET_RNG_STATE'; state: number }
  | { type: 'SAVE_FOCUS'; selector: string | null }
  | { type: 'SET_AUDIO_INITIALIZED' }
  | { type: 'SET_LAST_LARGE_OVERLAY_TYPE'; overlayType: OverlayType | null };

// Validation
function validateField(field: FieldId, value: string | boolean): string {
  switch (field) {
    case 'fullName':
      if (typeof value !== 'string' || value.length < 3) {
        return 'Name must be at least 3 characters';
      }
      break;
    case 'email':
      if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Enter a valid email';
      }
      break;
    case 'phone':
      if (typeof value !== 'string' || !/^\d{3}-\d{3}-\d{4}$/.test(value)) {
        return 'Format: ###-###-####';
      }
      break;
    case 'address':
      if (typeof value !== 'string' || value.trim().length === 0) {
        return 'Address is required';
      }
      break;
    case 'city':
      if (typeof value !== 'string' || value.trim().length === 0) {
        return 'City is required';
      }
      break;
    case 'state':
      if (typeof value !== 'string' || value.length === 0) {
        return 'Select a state';
      }
      break;
    case 'zip':
      if (typeof value !== 'string' || !/^\d{5}$/.test(value)) {
        return 'ZIP must be 5 digits';
      }
      break;
    case 'favoriteColor':
      if (typeof value !== 'string' || value.length === 0) {
        return 'Select a color';
      }
      break;
    case 'secretCode':
      if (typeof value !== 'string' || value !== '8BIT') {
        return 'Invalid secret code';
      }
      break;
    case 'terms':
      if (value !== true) {
        return 'You must accept the terms';
      }
      break;
  }
  return '';
}

function validateAllFields(form: FormState): FormState {
  const newErrors = { ...form.errors };
  let allValid = true;

  (Object.keys(form.values) as FieldId[]).forEach((field) => {
    const error = validateField(field, form.values[field]);
    newErrors[field] = error;
    if (error) allValid = false;
  });

  return {
    ...form,
    errors: newErrors,
    valid: allValid,
  };
}

// Penalties
const PENALTIES: Record<string, number> = {
  AreYouSureNo: 200,
  RestartApp: 300,
  SessionExpired: 250,
};

// Reducer
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const seed = action.seed ?? generateSeed();
      return {
        ...createInitialState(),
        phase: 'playing',
        settings: state.settings,
        rngSeed: seed,
        rngInternalState: seed,
        audioInitialized: state.audioInitialized,
      };
    }

    case 'PAUSE_GAME':
      return {
        ...state,
        phase: 'paused',
        overlay: {
          ...state.overlay,
          stack: [
            ...state.overlay.stack,
            {
              id: generateId(),
              type: 'PAUSE',
              createdAtMs: Date.now(),
              size: 'large',
              blocking: true,
              critical: false,
              canEscClose: true,
              payload: {},
            },
          ],
        },
      };

    case 'RESUME_GAME': {
      const newStack = state.overlay.stack.filter((o) => o.type !== 'PAUSE');
      return {
        ...state,
        phase: 'playing',
        overlay: {
          ...state.overlay,
          stack: newStack,
        },
      };
    }

    case 'WIN_GAME':
      return {
        ...state,
        phase: 'won',
        overlay: {
          ...state.overlay,
          stack: [],
        },
      };

    case 'LOSE_GAME':
      return {
        ...state,
        phase: 'lost',
        overlay: {
          ...state.overlay,
          stack: [],
        },
      };

    case 'TICK': {
      if (state.phase !== 'playing') return state;

      const newTimeLeft = state.timeLeftMs - action.deltaMs;
      const newElapsed = state.elapsedMs + action.deltaMs;
      const scoreDecay = Math.floor(action.deltaMs / 1000);
      const chaosIncrease = action.deltaMs / 10000 * 0.6;
      
      let newFocusMode = { ...state.focusMode };
      if (newFocusMode.active) {
        newFocusMode.durationMsLeft -= action.deltaMs;
        if (newFocusMode.durationMsLeft <= 0) {
          newFocusMode.active = false;
          newFocusMode.durationMsLeft = 0;
          newFocusMode.cooldownMsLeft = 20000;
        }
      } else if (newFocusMode.cooldownMsLeft > 0) {
        newFocusMode.cooldownMsLeft = Math.max(0, newFocusMode.cooldownMsLeft - action.deltaMs);
      }

      return {
        ...state,
        timeLeftMs: newTimeLeft,
        elapsedMs: newElapsed,
        score: Math.max(0, state.score - scoreDecay),
        chaos: Math.min(100, Math.max(0, state.chaos + chaosIncrease)),
        focusMode: newFocusMode,
      };
    }

    case 'UPDATE_FIELD': {
      const newValues = {
        ...state.form.values,
        [action.field]: action.value,
      };
      const error = validateField(action.field, action.value);
      const newErrors = {
        ...state.form.errors,
        [action.field]: state.form.touched[action.field] ? error : '',
      };
      
      // Check overall validity
      let allValid = true;
      (Object.keys(newValues) as FieldId[]).forEach((field) => {
        if (validateField(field, newValues[field])) {
          allValid = false;
        }
      });

      return {
        ...state,
        form: {
          ...state.form,
          values: newValues,
          errors: newErrors,
          valid: allValid,
        },
      };
    }

    case 'TOUCH_FIELD': {
      const newTouched = {
        ...state.form.touched,
        [action.field]: true,
      };
      const error = validateField(action.field, state.form.values[action.field]);
      const newErrors = {
        ...state.form.errors,
        [action.field]: error,
      };

      return {
        ...state,
        form: {
          ...state.form,
          touched: newTouched,
          errors: newErrors,
        },
      };
    }

    case 'VALIDATE_FORM':
      return {
        ...state,
        form: validateAllFields({
          ...state.form,
          touched: {
            fullName: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zip: true,
            favoriteColor: true,
            secretCode: true,
            terms: true,
          },
        }),
      };

    case 'RESET_FORM': {
      const penalty = PENALTIES[action.cause] || 0;
      return {
        ...state,
        form: createInitialFormState(),
        resets: state.resets + 1,
        score: Math.max(0, state.score - penalty),
        chaos: Math.min(100, state.chaos + 10),
      };
    }

    case 'PUSH_OVERLAY':
      return {
        ...state,
        interruptionsCount: state.interruptionsCount + 1,
        overlay: {
          ...state.overlay,
          stack: [...state.overlay.stack, action.overlay],
        },
      };

    case 'POP_OVERLAY': {
      let newStack: OverlayInstance[];
      if (action.id) {
        newStack = state.overlay.stack.filter((o) => o.id !== action.id);
      } else {
        newStack = state.overlay.stack.slice(0, -1);
      }
      return {
        ...state,
        overlay: {
          ...state.overlay,
          stack: newStack,
        },
      };
    }

    case 'UPDATE_OVERLAY': {
      const newStack = state.overlay.stack.map((o) =>
        o.id === action.id ? { ...o, payload: { ...o.payload, ...action.payload } } : o
      );
      return {
        ...state,
        overlay: {
          ...state.overlay,
          stack: newStack,
        },
      };
    }

    case 'CLEAR_OVERLAYS':
      return {
        ...state,
        overlay: {
          ...state.overlay,
          stack: [],
          criticalDeadlineMs: null,
        },
      };

    case 'TRIGGER_SESSION_EXPIRED': {
      const sessionExpiredOverlay: OverlayInstance = {
        id: generateId(),
        type: 'SESSION_EXPIRED',
        createdAtMs: Date.now(),
        size: 'small',
        blocking: true,
        critical: false,
        canEscClose: false,
        payload: {},
      };
      return {
        ...state,
        overlay: {
          ...state.overlay,
          stack: [...state.overlay.stack, sessionExpiredOverlay],
          criticalDeadlineMs: null,
        },
      };
    }

    case 'ACTIVATE_FOCUS_MODE': {
      if (state.focusMode.cooldownMsLeft > 0 || state.focusMode.active) {
        return state;
      }
      return {
        ...state,
        focusMode: {
          active: true,
          cooldownMsLeft: 0,
          durationMsLeft: 8000,
        },
      };
    }

    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.setting]: action.value,
        },
      };

    case 'ADD_SCORE':
      return {
        ...state,
        score: Math.max(0, state.score + action.amount),
      };

    case 'ADJUST_CHAOS':
      return {
        ...state,
        chaos: Math.min(100, Math.max(0, state.chaos + action.amount)),
      };

    case 'SET_NEXT_SPAWN_AT':
      return {
        ...state,
        overlay: {
          ...state.overlay,
          nextSpawnAtMs: action.ms,
        },
      };

    case 'SET_NEXT_ARE_YOU_SURE_AT':
      return {
        ...state,
        overlay: {
          ...state.overlay,
          nextAreYouSureAtMs: action.ms,
        },
      };

    case 'SET_CHAT_SHOWN':
      return {
        ...state,
        overlay: {
          ...state.overlay,
          chatShownAtLeastOnce: true,
        },
      };

    case 'SET_CRITICAL_DEADLINE':
      return {
        ...state,
        overlay: {
          ...state.overlay,
          criticalDeadlineMs: action.ms,
        },
      };

    case 'SET_RNG_STATE':
      return {
        ...state,
        rngInternalState: action.state,
      };

    case 'SAVE_FOCUS':
      return {
        ...state,
        overlay: {
          ...state.overlay,
          lastFocusSelector: action.selector,
        },
      };

    case 'SET_AUDIO_INITIALIZED':
      return {
        ...state,
        audioInitialized: true,
      };

    case 'SET_LAST_LARGE_OVERLAY_TYPE':
      return {
        ...state,
        overlay: {
          ...state.overlay,
          lastLargeOverlayType: action.overlayType,
        },
      };

    default:
      return state;
  }
}

