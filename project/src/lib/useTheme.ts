import { useEffect, useState } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('bl_theme');
    return stored ? stored === 'dark' : true; // Velocity default: dark
  });

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    document.documentElement.dataset.variant = 'velocity';
    localStorage.setItem('bl_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    document.documentElement.dataset.variant = 'velocity';
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { isDark, toggle: () => setIsDark(v => !v) };
}
