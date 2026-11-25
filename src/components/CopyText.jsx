import { useState } from 'react';
import Icon from './Icon';

// Tap to copy a value (model/serial numbers when on the phone with service).
export default function CopyText({ value, mono = true }) {
  const [copied, setCopied] = useState(false);
  if (!value) return <span className="muted">—</span>;
  async function copy(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { /* clipboard blocked */ }
  }
  return (
    <button type="button" className={'copy-text' + (mono ? ' mono' : '')} onClick={copy} title="Copy">
      <span>{value}</span>
      <Icon name={copied ? 'check' : 'copy'} size={16} />
    </button>
  );
}
