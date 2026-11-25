// Labelled form controls. Inputs use 16px+ text so iOS Safari doesn't zoom on focus.
export function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function TextField({ label, hint, value, onChange, ...rest }) {
  return (
    <Field label={label} hint={hint}>
      <input value={value ?? ''} onChange={e => onChange(e.target.value)} {...rest} />
    </Field>
  );
}

export function TextArea({ label, hint, value, onChange, rows = 3, ...rest }) {
  return (
    <Field label={label} hint={hint}>
      <textarea rows={rows} value={value ?? ''} onChange={e => onChange(e.target.value)} {...rest} />
    </Field>
  );
}

export function Select({ label, hint, value, onChange, options, ...rest }) {
  return (
    <Field label={label} hint={hint}>
      <select value={value ?? ''} onChange={e => onChange(e.target.value)} {...rest}>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}
