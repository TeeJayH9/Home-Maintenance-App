import Icon from './Icon';
import { goBack } from '../lib/router';

// Sticky page header with optional back button and a right-side action.
export default function Page({ title, back, action, children }) {
  return (
    <>
      <header className="topbar">
        {back !== undefined ? (
          <button className="icon-btn" onClick={() => goBack(back)} aria-label="Back">
            <Icon name="back" />
          </button>
        ) : <span className="topbar-spacer" />}
        <h1>{title}</h1>
        {action || <span className="topbar-spacer" />}
      </header>
      <div className="content">{children}</div>
    </>
  );
}
