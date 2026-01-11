# 🎮 NOTIFICATION HELL

A chaotic "fill out the form" puzzle game where you must complete a 10-field form while being constantly interrupted by intrusive overlays, popups, and system messages.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Objective

Complete all 10 form fields correctly and submit before the 120-second timer runs out. But beware - the notification demons won't make it easy!

## 📝 Form Fields

1. **Full Name** - Text, minimum 3 characters
2. **Email** - Valid email format
3. **Phone** - Pattern: ###-###-####
4. **Address Line 1** - Required text
5. **City** - Required text
6. **State** - Dropdown (CA, NY, TX, IL, WA)
7. **ZIP** - Exactly 5 digits
8. **Favorite Color** - Dropdown (Red, Blue, Green, Purple)
9. **Secret Code** - Must be exactly "8BIT" (hint on sticky note!)
10. **Terms Checkbox** - Must be checked

## 👾 Interruption Types

### Large Overlays (one at a time)
- **Rate Us** - Pick 1-5 stars and submit. Cannot be escaped! Reduces chaos.
- **Warning** - Dismiss to reduce chaos slightly. Can use Esc.
- **Chat Message** - Someone asks for the secret code. Reply "8BIT" for bonus points!
- **System Update** - Choose "Restart App" (resets form!) or "Later" (increases chaos).

### Small Popups (can stack on top)
- **Are You Sure?** - Click "Yes" to dismiss. "No" resets your form!
- **Session Expired** - Appears if you ignore critical overlays too long. Resets form.

## 💪 Focus Mode

Press the **FOCUS MODE** button (or F key) to suppress new interruptions for 8 seconds. Has a 20-second cooldown after use.

## 📊 Scoring

- Start with 1000 points
- -1 point per second elapsed
- **Penalties:**
  - Wrong chat reply: -50
  - "No" on Are You Sure: -200 + reset
  - "Restart App": -300 + reset
  - Session Expired: -250 + reset
- **Bonuses:**
  - Correct chat reply ("8BIT"): +50
  - Submit rating: Chaos -10

## 🌪️ Chaos Meter

Chaos (0-100) increases over time and with mistakes. Higher chaos = more frequent interruptions!

## ⌨️ Controls

| Key | Action |
|-----|--------|
| **Esc** | Close dismissible overlay |
| **Enter** | Activate primary button |
| **Tab** | Navigate between elements |
| **Shift+Tab** | Navigate backwards |
| **F** | Toggle Focus Mode |
| **P** | Pause/Resume game |

## ⚙️ Settings

- **Reduced Motion** - Disables shake/glitch animations
- **CRT Effect** - Toggle retro scanline overlay
- **Mute** - Disable sound effects

## 🏗️ Architecture

### State Management
Uses React's `useReducer` + Context for centralized state management.

### Game Engine
A tick-based engine using `requestAnimationFrame` handles:
- Timer countdown
- Score decay
- Chaos accumulation
- Overlay spawning
- Focus mode timers
- Critical overlay deadlines

### Seeded RNG
All randomness uses a seeded PRNG for reproducible runs. The seed is shown in the pause menu.

### Overlay System
A stack-based overlay manager with:
- Focus trapping in modals
- Focus restoration on close
- Critical overlay timeout tracking
- Portal-based rendering

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with font & portal
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles & CSS variables
├── src/
│   ├── game/
│   │   ├── state.ts    # Types, reducer, actions
│   │   ├── engine.ts   # Game loop & spawning
│   │   ├── rng.ts      # Seeded RNG
│   │   └── utils.ts    # Helper functions
│   └── components/
│       ├── GameRoot.tsx
│       ├── screens/    # Menu, Win, Lose screens
│       ├── hud/        # HUD, ChaosMeter, FocusButton
│       ├── level/      # FormLevel, StickyNoteHint
│       └── overlays/   # All overlay components
```

## 🎨 Design

Retro pixel-art / 8-bit aesthetic featuring:
- Press Start 2P pixel font
- Chunky bordered UI components
- Limited saturated color palette
- Optional CRT scanline effect
- RPG-style dialog boxes

---

Good luck, and may your form submissions be ever successful! 🕹️

