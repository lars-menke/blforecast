import { useState } from 'react';
import { useTheme } from './lib/useTheme';
import { useStandings } from './lib/useStandings';
import { useSeason } from './lib/useSeason';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { MatchdayScreen } from './screens/MatchdayScreen';
import { TableScreen } from './screens/TableScreen';
import { SeasonScreen } from './screens/SeasonScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TabBar } from './components/TabBar';
import type { TabKey } from './components/TabBar';
import './styles/globals.css';
import appStyles from './App.module.css';

function hasOnboarded() {
  try { return localStorage.getItem('bl_onboarded') === '1'; }
  catch { return false; }
}

export default function App() {
  useTheme();
  const [splashDone, setSplashDone] = useState(false);
  const [onboarded, setOnboarded] = useState(hasOnboarded);
  const [tab, setTab] = useState<TabKey>('matchday');

  const { rows: tableRows } = useStandings();
  const { data: seasonData } = useSeason();

  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  if (!onboarded) {
    return (
      <OnboardingScreen onStart={() => {
        try { localStorage.setItem('bl_onboarded', '1'); } catch {}
        setOnboarded(true);
      }} />
    );
  }

  return (
    <div className={appStyles.shell}>
      <div className={appStyles.screen}>
        {tab === 'matchday' && <MatchdayScreen />}
        {tab === 'table'    && <TableScreen rows={tableRows} />}
        {tab === 'season'   && <SeasonScreen data={seasonData} />}
        {tab === 'profile'  && <ProfileScreen />}
      </div>
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
