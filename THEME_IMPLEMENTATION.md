# Dark/Light Theme Implementation

## What Was Done

### 1. CSS Variables Setup (`frontend/src/index.css`)
- Added CSS custom properties for both dark and light themes
- Dark theme (default): Dark greens, warm gold accents
- Light theme: Clean whites, grays, amber accents
- Variables include: backgrounds, borders, text colors, glows, grid colors

### 2. Theme Context (`frontend/src/context/ThemeContext.js`)
- Created React context to manage theme state
- Persists theme preference to localStorage
- Sets `data-theme` attribute on document root
- Provides `theme` and `toggle` function to components

### 3. Color Utility (`frontend/src/utils/colors.js`)
- Dynamic color getters that read from CSS variables
- Allows components to access theme colors reactively
- Updates automatically when theme changes

### 4. Component Updates
All components updated to use dynamic colors:
- `App.js` - Wrapped with ThemeProvider
- `Dashboard.js` - Added theme toggle in Settings panel
- `Login.js`, `Signup.js` - Use COLORS utility
- `Profile.js`, `Sidebar.js` - Use COLORS utility
- `StatCard.js`, `ProgressChart.js`, `ActivityList.js` - Use COLORS utility

### 5. Tailwind Configuration
- Enabled `darkMode: 'class'` in `tailwind.config.js`

## How to Use

### Toggle Theme
1. Log into the app
2. Navigate to **Settings** in the sidebar
3. Click the theme button (shows current theme with icon)
4. Theme switches instantly and persists across sessions

### Theme Persistence
- Theme choice is saved to `localStorage` as `'an-theme'`
- Automatically loads on app restart

## Technical Details

### CSS Variables
```css
:root { /* Dark theme */ }
[data-theme="light"] { /* Light theme */ }
```

### Theme Toggle
Located in Settings panel:
```javascript
const { theme, toggle } = useTheme();
<button onClick={toggle}>
  {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
</button>
```

### Color Access
```javascript
import { COLORS } from '../utils/colors';
const GOLD = COLORS.GOLD; // Reads from CSS variable
```

## Testing
1. Start the frontend: `cd frontend && npm start`
2. Login to the app
3. Go to Settings
4. Click the theme toggle button
5. Observe instant theme change across all UI elements
