type Status = 'nominal' | 'watch' | 'warning' | 'critical' | 'emergency' | 'loading';

interface SectionHeaderProps {
  label: string;
  status?: Status;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

const STATUS_VAR: Record<string, string> = {
  nominal:   'var(--nominal)',
  watch:     'var(--watch)',
  warning:   'var(--warning)',
  critical:  'var(--critical)',
  emergency: 'var(--emergency)',
  loading:   'var(--text-3)',
};

export function SectionHeader({ label, status, collapsible, collapsed, onToggle }: SectionHeaderProps) {
  const statusColor = status ? STATUS_VAR[status] : 'var(--text-3)';

  if (collapsible) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full py-1.5"
      >
        <span className="text-[10px]" style={{ color: statusColor }}>■</span>
        <span
          className="text-[10px] uppercase font-medium"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-data)', letterSpacing: '0.08em' }}
        >
          {label}
        </span>
        <span className="ml-auto text-[10px]" style={{ color: 'var(--text-3)' }}>
          {collapsed ? '▶' : '▼'}
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="text-[10px]" style={{ color: statusColor }}>■</span>
      <span
        className="text-[10px] uppercase font-medium"
        style={{ color: 'var(--accent)', fontFamily: 'var(--font-data)', letterSpacing: '0.08em' }}
      >
        {label}
      </span>
    </div>
  );
}
