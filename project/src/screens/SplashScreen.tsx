import { useEffect, useState } from 'react';
import s from './SplashScreen.module.css';
import { VelocityIcon } from '../components/Icons';

type Props = {
  onDone: () => void;
};

export function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'out'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 300);
    const t2 = setTimeout(() => setPhase('out'), 2200);
    const t3 = setTimeout(() => onDone(), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className={`${s.splash} ${phase === 'out' ? s.splashOut : ''}`}>
      <div className={s.mark}>
        <VelocityIcon size={64} />
      </div>
      <div className={s.name}>
        BL<em>FORECAST</em>
      </div>
      <div className={s.bar} />
    </div>
  );
}
