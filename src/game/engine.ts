import { GameState, GameAction, OverlayType, OverlayInstance } from './state';
import { createRng, RNG } from './rng';
import { clamp, generateId } from './utils';

// Overlay spawn configuration - MORE FREQUENT
const SPAWN_INTERVAL_BASE = 10;
const SPAWN_INTERVAL_MIN = 3;
const SPAWN_INTERVAL_MAX = 10;
const CHAOS_INTERVAL_FACTOR = 0.08;

const ARE_YOU_SURE_INTERVAL_MIN = 8000;
const ARE_YOU_SURE_INTERVAL_MAX = 18000;

const CRITICAL_TIMEOUT_MS = 6000; // Shorter inactivity timer
const FOCUS_MODE_DURATION = 8000;
const FOCUS_MODE_COOLDOWN = 20000;

const WARNING_MESSAGES = [
  'Virus detected in pixel drive!',
  'Warning: Low RAM detected!',
  'Critical: Firewall breach!',
  'Alert: Cookies are stale!',
  'System: Too many tabs open!',
  'Warning: GPU overheating!',
  'Error: Keyboard not found!',
  'Alert: Mouse is tired!',
  'Warning: Coffee levels low!',
  'Critical: Pixel overflow!',
];

// Prompts where YES is the safe/correct answer (clicking NO resets)
export const YES_IS_CORRECT_PROMPTS = [
  { message: 'Continue with current progress?', yesLabel: 'YES', noLabel: 'NO' },
  { message: 'Keep your form data?', yesLabel: 'YES', noLabel: 'NO' },
  { message: 'Stay on this page?', yesLabel: 'STAY', noLabel: 'LEAVE' },
  { message: 'Are you still there?', yesLabel: 'YES', noLabel: 'NO' },
  { message: 'Confirm you are human?', yesLabel: 'CONFIRM', noLabel: 'CANCEL' },
  { message: 'Save your progress?', yesLabel: 'SAVE', noLabel: 'DISCARD' },
  { message: 'Continue filling form?', yesLabel: 'CONTINUE', noLabel: 'STOP' },
  { message: 'Proceed with submission?', yesLabel: 'PROCEED', noLabel: 'ABORT' },
  { message: 'Accept terms of chaos?', yesLabel: 'ACCEPT', noLabel: 'DECLINE' },
  { message: 'Maintain connection?', yesLabel: 'YES', noLabel: 'DISCONNECT' },
];

// Prompts where NO is the safe/correct answer (clicking YES resets)
export const NO_IS_CORRECT_PROMPTS = [
  { message: 'Restart application?', yesLabel: 'RESTART', noLabel: 'CANCEL' },
  { message: 'Clear all form data?', yesLabel: 'CLEAR', noLabel: 'KEEP' },
  { message: 'Delete your progress?', yesLabel: 'DELETE', noLabel: 'KEEP' },
  { message: 'Reset to defaults?', yesLabel: 'RESET', noLabel: 'NO THANKS' },
  { message: 'Abandon current session?', yesLabel: 'ABANDON', noLabel: 'STAY' },
  { message: 'Erase everything?', yesLabel: 'ERASE', noLabel: 'CANCEL' },
  { message: 'Start over from scratch?', yesLabel: 'START OVER', noLabel: 'CONTINUE' },
  { message: 'Discard unsaved changes?', yesLabel: 'DISCARD', noLabel: 'KEEP' },
  { message: 'Cancel your form?', yesLabel: 'CANCEL FORM', noLabel: 'NO' },
  { message: 'Wipe all data?', yesLabel: 'WIPE', noLabel: 'PRESERVE' },
  { message: 'Enable chaos mode?', yesLabel: 'ENABLE', noLabel: 'DISABLE' },
  { message: 'Subscribe to spam?', yesLabel: 'SUBSCRIBE', noLabel: 'NO THANKS' },
  { message: 'Allow notifications?', yesLabel: 'ALLOW', noLabel: 'BLOCK' },
  { message: 'Share your data?', yesLabel: 'SHARE', noLabel: 'PRIVATE' },
  { message: 'Install toolbar?', yesLabel: 'INSTALL', noLabel: 'SKIP' },
];

export interface PromptConfig {
  message: string;
  yesLabel: string;
  noLabel: string;
  correctAnswer: 'yes' | 'no';
}

export function getRandomPrompt(rng: RNG): PromptConfig {
  // 50% chance for each type
  if (rng.nextBool(0.5)) {
    const prompt = rng.pick(YES_IS_CORRECT_PROMPTS);
    return { ...prompt, correctAnswer: 'yes' };
  } else {
    const prompt = rng.pick(NO_IS_CORRECT_PROMPTS);
    return { ...prompt, correctAnswer: 'no' };
  }
}

export function calculateSpawnInterval(chaos: number, rng: RNG): number {
  const baseInterval = SPAWN_INTERVAL_BASE - chaos * CHAOS_INTERVAL_FACTOR;
  const clampedInterval = clamp(baseInterval, SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_MAX);
  const randomOffset = rng.nextFloat(-0.5, 0.5);
  return (clampedInterval + randomOffset) * 1000;
}

export function selectLargeOverlayType(
  chaos: number,
  chatShownAtLeastOnce: boolean,
  timeLeftMs: number,
  lastType: OverlayType | null,
  rng: RNG
): OverlayType {
  // Force chat if not shown and time is running low
  if (!chatShownAtLeastOnce && timeLeftMs <= 80000) {
    return 'CHAT';
  }

  const roll = rng.next();
  
  if (chaos < 30) {
    // Low chaos: mostly warnings
    if (roll < 0.5) return 'WARNING';
    if (roll < 0.7 && !chatShownAtLeastOnce) return 'CHAT';
    if (roll < 0.85) return 'RATE_US';
    return 'SYSTEM_UPDATE';
  } else if (chaos < 60) {
    // Mid chaos: mix of everything
    if (roll < 0.2) return 'WARNING';
    if (roll < 0.4) return 'CHAT';
    if (roll < 0.6) return 'RATE_US';
    if (roll < 0.8) return 'SYSTEM_UPDATE';
    return 'WARNING';
  } else {
    // High chaos: aggressive overlays
    if (roll < 0.35) return 'SYSTEM_UPDATE';
    if (roll < 0.55) return 'RATE_US';
    if (roll < 0.75) return 'CHAT';
    return 'WARNING';
  }
}

export function createOverlayInstance(
  type: OverlayType,
  rng: RNG
): OverlayInstance {
  const base = {
    id: generateId(),
    type,
    createdAtMs: Date.now(),
  };

  switch (type) {
    case 'RATE_US':
      return {
        ...base,
        size: 'large',
        blocking: true,
        critical: false,
        canEscClose: false,
        payload: { rating: 0 },
      };
    case 'WARNING':
      return {
        ...base,
        size: 'large',
        blocking: true,
        critical: false,
        canEscClose: true,
        payload: { message: rng.pick(WARNING_MESSAGES) },
      };
    case 'CHAT':
      return {
        ...base,
        size: 'large',
        blocking: true,
        critical: false,
        canEscClose: false,
        payload: { reply: '' },
      };
    case 'ARE_YOU_SURE': {
      const promptConfig = getRandomPrompt(rng);
      return {
        ...base,
        size: 'small',
        blocking: true,
        critical: true,
        canEscClose: false,
        payload: {
          message: promptConfig.message,
          yesLabel: promptConfig.yesLabel,
          noLabel: promptConfig.noLabel,
          correctAnswer: promptConfig.correctAnswer,
        },
      };
    }
    case 'SYSTEM_UPDATE':
      return {
        ...base,
        size: 'large',
        blocking: true,
        critical: true,
        canEscClose: false,
        payload: {},
      };
    case 'SESSION_EXPIRED':
      return {
        ...base,
        size: 'small',
        blocking: true,
        critical: false,
        canEscClose: false,
        payload: {},
      };
    case 'PAUSE':
      return {
        ...base,
        size: 'large',
        blocking: true,
        critical: false,
        canEscClose: true,
        payload: {},
      };
    case 'GLITCH':
      return {
        ...base,
        size: 'large',
        blocking: false,
        critical: false,
        canEscClose: false,
        payload: {},
      };
    default:
      return {
        ...base,
        size: 'large',
        blocking: true,
        critical: false,
        canEscClose: true,
        payload: {},
      };
  }
}

export function hasLargeOverlay(stack: OverlayInstance[]): boolean {
  return stack.some((o) => o.size === 'large' && o.type !== 'PAUSE' && o.type !== 'GLITCH');
}

export function hasCriticalOverlay(stack: OverlayInstance[]): boolean {
  return stack.some((o) => o.critical);
}

export function hasSessionExpired(stack: OverlayInstance[]): boolean {
  return stack.some((o) => o.type === 'SESSION_EXPIRED');
}

export interface EngineTickResult {
  actions: GameAction[];
}

export function engineTick(
  state: GameState,
  deltaMs: number,
  nowMs: number
): EngineTickResult {
  const actions: GameAction[] = [];
  
  if (state.phase !== 'playing') {
    return { actions };
  }

  // Update tick
  actions.push({ type: 'TICK', deltaMs });

  // Check for game over
  if (state.timeLeftMs - deltaMs <= 0) {
    actions.push({ type: 'LOSE_GAME' });
    return { actions };
  }

  // Create RNG instance
  const rng = createRng(state.rngSeed);
  rng.setState(state.rngInternalState);

  // Handle critical overlay deadline
  const hasCritical = hasCriticalOverlay(state.overlay.stack);
  const hasSessionExp = hasSessionExpired(state.overlay.stack);

  if (hasCritical && !hasSessionExp) {
    if (state.overlay.criticalDeadlineMs === null) {
      // Set deadline
      actions.push({ type: 'SET_CRITICAL_DEADLINE', ms: nowMs + CRITICAL_TIMEOUT_MS });
    } else if (nowMs > state.overlay.criticalDeadlineMs) {
      // Trigger session expired
      actions.push({ type: 'TRIGGER_SESSION_EXPIRED' });
    }
  } else if (!hasCritical && state.overlay.criticalDeadlineMs !== null) {
    // Clear deadline
    actions.push({ type: 'SET_CRITICAL_DEADLINE', ms: null });
  }

  // Don't spawn new overlays during focus mode
  if (state.focusMode.active) {
    actions.push({ type: 'SET_RNG_STATE', state: rng.getState() });
    return { actions };
  }

  const elapsedMs = state.elapsedMs + deltaMs;

  // Check for "Are You Sure" spawn - more frequent now
  if (elapsedMs >= state.overlay.nextAreYouSureAtMs && !hasSessionExp) {
    const areYouSure = createOverlayInstance('ARE_YOU_SURE', rng);
    actions.push({ type: 'PUSH_OVERLAY', overlay: areYouSure });
    
    const nextInterval = rng.nextInt(ARE_YOU_SURE_INTERVAL_MIN, ARE_YOU_SURE_INTERVAL_MAX);
    actions.push({ type: 'SET_NEXT_ARE_YOU_SURE_AT', ms: elapsedMs + nextInterval });
  }

  // Check for large overlay spawn
  if (elapsedMs >= state.overlay.nextSpawnAtMs && !hasSessionExp) {
    const hasLarge = hasLargeOverlay(state.overlay.stack);
    
    if (!hasLarge) {
      let overlayType = selectLargeOverlayType(
        state.chaos,
        state.overlay.chatShownAtLeastOnce,
        state.timeLeftMs - deltaMs,
        state.overlay.lastLargeOverlayType,
        rng
      );

      // Avoid spawning same type twice in a row (especially RATE_US)
      if (overlayType === state.overlay.lastLargeOverlayType && overlayType === 'RATE_US') {
        overlayType = 'WARNING';
      }

      const overlay = createOverlayInstance(overlayType, rng);
      actions.push({ type: 'PUSH_OVERLAY', overlay });
      actions.push({ type: 'SET_LAST_LARGE_OVERLAY_TYPE', overlayType });

      if (overlayType === 'CHAT') {
        actions.push({ type: 'SET_CHAT_SHOWN' });
      }
    }

    // Schedule next spawn
    const interval = calculateSpawnInterval(state.chaos, rng);
    actions.push({ type: 'SET_NEXT_SPAWN_AT', ms: elapsedMs + interval });
  }

  // Save RNG state
  actions.push({ type: 'SET_RNG_STATE', state: rng.getState() });

  return { actions };
}

// Audio manager for beeps
let audioContext: AudioContext | null = null;

export function initAudio(): void {
  if (audioContext) return;
  try {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch (e) {
    console.warn('WebAudio not supported');
  }
}

export function playBeep(frequency: number, duration: number, muted: boolean): void {
  if (muted || !audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    // Ignore audio errors
  }
}

export function playOpenBeep(muted: boolean): void {
  playBeep(440, 0.1, muted);
  setTimeout(() => playBeep(660, 0.1, muted), 50);
}

export function playErrorBeep(muted: boolean): void {
  playBeep(220, 0.2, muted);
}

export function playResetBeep(muted: boolean): void {
  playBeep(330, 0.15, muted);
  setTimeout(() => playBeep(220, 0.15, muted), 80);
  setTimeout(() => playBeep(165, 0.2, muted), 160);
}

export function playSuccessBeep(muted: boolean): void {
  playBeep(440, 0.1, muted);
  setTimeout(() => playBeep(550, 0.1, muted), 80);
  setTimeout(() => playBeep(660, 0.15, muted), 160);
}
