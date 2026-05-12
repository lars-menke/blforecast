import { useState } from 'react';
import { useTheme } from './lib/useTheme';
import { useStandings } from './lib/useStandings';
import { useSeason } from './lib/useSeason';
import { MatchdayScreen } from './screens/MatchdayScreen';
import { TableScreen } from './screens/TableScreen';
import { SeasonScreen } from './screens/SeasonScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SplashScreen } from './components/SplashScreen';
import { TabBar } from './components/TabBar';
import type { TabKey } from './components/TabBar';
import './styles/globals.css';
import appStyles from './App.module.css';

export default function App() {
  const { toggle, isDark } = useTheme();
  const [splashDone, setSplashDone] = useState(false);
  const [tab, setTab] = useState<TabKey>('matchday');

  const { rows: tableRows, loading: tableLoading } = useStandings();
  const { data: seasonData, loading: seasonLoading } = useSeason();

  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  return (
    <div className={appStyles.shell}>
      <div className={appStyles.screen}>
        {tab === 'matchday' && <MatchdayScreen onThemeToggle={toggle} isDark={isDark} />}
        {tab === 'table'    && <TableScreen rows={tableRows} loading={tableLoading} />}
        {tab === 'season'   && <SeasonScreen data={seasonData} loading={seasonLoading} />}
        {tab === 'profile'  && <ProfileScreen />}
      </div>
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
