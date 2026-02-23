type Status = 'nominal' | 'watch' | 'warning' | 'critical' | 'emergency';

interface MetricRowProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: Status;
}

const STATUS_VAR: Record<Status, string> = {
  nominal:   'var(--nominal)',
  watch:     'var(--watch)',
  warning:   'var(--warning)',
  critical:  'var(--critical)',
  emergency: 'var(--emergency)',
};

export function MetricRow({ label, value, unit, status }: MetricRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span
        className="text-[10px] uppercase shrink-0"
        style={{ color: 'var(--text-2)', fontFamily: 'var(--font-ui)', letterSpacing: '0.08em' }}
      >
        {label}
      </span>
      <span className="flex items-baseline gap-1" style={{ fontFamily: 'var(--font-data)' }}>
        <span className="text-xs tabular-nums" style={{ color: 'var(--text-1)' }}>{value}</span>
        {unit && (
          <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>{unit}</span>
        )}
        {status && (
          <span className="text-[10px]" style={{ color: STATUS_VAR[status] }}>■</span>
        )}
      </span>
    </div>
  );
}
