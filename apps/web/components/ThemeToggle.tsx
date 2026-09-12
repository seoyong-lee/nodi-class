'use client';

import { Button } from '@nodi/design-system';
import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'nodi-theme';
const THEME_CHANGE_EVENT = 'nodi-theme-change';

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The visual preference still applies when storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }));
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const syncTheme = () => setTheme(currentTheme());

    syncTheme();
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
  }, []);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <Button
      variant="secondary"
      size="sm"
      icon={theme === 'light' ? 'moon' : 'sun'}
      aria-label={`${nextTheme === 'light' ? '라이트' : '다크'} 모드로 전환`}
      aria-pressed={theme === 'light'}
      title={`${nextTheme === 'light' ? '라이트' : '다크'} 모드로 전환`}
      onClick={() => applyTheme(nextTheme)}
    />
  );
}
