import { useState } from 'react';
import { CLUBS } from '../lib/clubs';
import { useLogos } from '../lib/openligadb';
import type { TeamCode } from '../lib/clubs';

type Props = {
  code: string;
  className?: string;
};

export function TeamLogo({ code, className }: Props) {
  const logos = useLogos();
  const [failed, setFailed] = useState(false);
  const club = CLUBS[code];
  const logoUrl = logos.get(code as TeamCode);
  const showLogo = Boolean(logoUrl && !failed);

  return (
    <span
      className={className}
      data-text={club?.textOnColor}
      style={!showLogo ? { background: club?.color } : undefined}
    >
      {showLogo
        ? <img src={logoUrl} alt={club?.name ?? code} onError={() => setFailed(true)} />
        : (club?.code ?? code)
      }
    </span>
  );
}
