import { useRoute } from './lib/router';
import TabBar from './components/TabBar';
import Dashboard from './pages/Dashboard';
import EquipmentList from './pages/EquipmentList';
import EquipmentDetail from './pages/EquipmentDetail';
import EquipmentEdit from './pages/EquipmentEdit';
import ApplianceInfo from './pages/ApplianceInfo';
import Profile from './pages/Profile';
import More from './pages/More';

function resolve(parts) {
  const [a, b, c] = parts;
  switch (a) {
    case undefined: return { tab: 'home', el: <Dashboard /> };
    case 'equipment':
      if (!b) return { tab: 'equipment', el: <EquipmentList /> };
      if (b === 'new') return { tab: 'equipment', el: <EquipmentEdit /> };
      if (c === 'edit') return { tab: 'equipment', el: <EquipmentEdit id={Number(b)} /> };
      return { tab: 'equipment', el: <EquipmentDetail id={Number(b)} /> };
    case 'appliances': return { tab: 'more', el: <ApplianceInfo /> };
    case 'profile': return { tab: 'more', el: <Profile /> };
    case 'more': return { tab: 'more', el: <More /> };
    default: return { tab: 'home', el: <Dashboard /> };
  }
}

export default function App() {
  const parts = useRoute();
  const { tab, el } = resolve(parts);
  return (
    <div className="app">
      {/* key forces a fresh page component (and form state) on each route */}
      <main className="main" key={parts.join('/')}>{el}</main>
      <TabBar active={tab} />
    </div>
  );
}
