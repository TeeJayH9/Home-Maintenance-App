import Icon from './Icon';

// Tabs grow as stages land: Parts (stage 2) and Log (stage 4) slot in here.
const TABS = [
  { key: 'home', label: 'Home', icon: 'home', href: '#/' },
  { key: 'equipment', label: 'Equipment', icon: 'tool', href: '#/equipment' },
  { key: 'more', label: 'More', icon: 'more', href: '#/more' }
];

export default function TabBar({ active }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map(t => (
        <a key={t.key} href={t.href} className={'tab' + (active === t.key ? ' active' : '')}
          aria-current={active === t.key ? 'page' : undefined}>
          <Icon name={t.icon} />
          <span>{t.label}</span>
        </a>
      ))}
    </nav>
  );
}
