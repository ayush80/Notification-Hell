export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'a[href]',
  ].join(',');
  
  return Array.from(container.querySelectorAll<HTMLElement>(selector))
    .filter(el => el.offsetParent !== null);
}

export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return;
  
  const focusable = getFocusableElements(container);
  if (focusable.length === 0) return;
  
  const firstEl = focusable[0];
  const lastEl = focusable[focusable.length - 1];
  
  if (event.shiftKey) {
    if (document.activeElement === firstEl) {
      event.preventDefault();
      lastEl.focus();
    }
  } else {
    if (document.activeElement === lastEl) {
      event.preventDefault();
      firstEl.focus();
    }
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate phone format ###-###-####
export function isValidPhone(phone: string): boolean {
  return /^\d{3}-\d{3}-\d{4}$/.test(phone);
}

// Validate ZIP code (5 digits)
export function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

