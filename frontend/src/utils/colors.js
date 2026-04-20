// Dynamic color getters that read from CSS variables
export const getColors = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    BG_DARK: style.getPropertyValue('--bg-dark').trim(),
    BG_CARD: style.getPropertyValue('--bg-card').trim(),
    INPUT_BG: style.getPropertyValue('--bg-input').trim(),
    GOLD: style.getPropertyValue('--gold').trim(),
    GOLD_HOVER: style.getPropertyValue('--gold-hover').trim(),
    TEXT: style.getPropertyValue('--text').trim(),
    MUTED: style.getPropertyValue('--muted').trim(),
    BORDER: style.getPropertyValue('--border').trim(),
  };
};

// For components that need static references (will update on theme change via re-render)
export const COLORS = {
  get BG_DARK() { return getComputedStyle(document.documentElement).getPropertyValue('--bg-dark').trim(); },
  get BG_CARD() { return getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim(); },
  get INPUT_BG() { return getComputedStyle(document.documentElement).getPropertyValue('--bg-input').trim(); },
  get GOLD() { return getComputedStyle(document.documentElement).getPropertyValue('--gold').trim(); },
  get GOLD_HOVER() { return getComputedStyle(document.documentElement).getPropertyValue('--gold-hover').trim(); },
  get TEXT() { return getComputedStyle(document.documentElement).getPropertyValue('--text').trim(); },
  get MUTED() { return getComputedStyle(document.documentElement).getPropertyValue('--muted').trim(); },
  get BORDER() { return getComputedStyle(document.documentElement).getPropertyValue('--border').trim(); },
};
