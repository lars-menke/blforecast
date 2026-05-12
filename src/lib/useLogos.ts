import { useEffect, useState } from 'react';
import { fetchLogos } from './openligadb';

export function useLogos() {
  const [logos, setLogos] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetchLogos().then(l => { if (!cancelled) setLogos(l); });
    return () => { cancelled = true; };
  }, []);

  return logos;
}
