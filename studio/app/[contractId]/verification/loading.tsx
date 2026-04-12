export default function VerificationLoading() {
  return (
    <div>
      {/* Summary bar skeleton */}
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-white p-8">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <div className="skeleton h-4 w-28 mb-2" />
            <div className="skeleton h-8 w-48" />
          </div>
          <div className="skeleton h-4 w-32" />
        </div>
        <div className="skeleton h-2 w-full rounded-full" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        {/* Header row */}
        <div className="flex gap-0 bg-[var(--muted)] border-b-2 border-[var(--border)]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 min-w-[120px] p-4 border-r border-[var(--border)]"
            >
              <div className="skeleton h-4 w-20 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          ))}
        </div>
        {/* Body rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-0 border-b border-[var(--border)]"
          >
            {Array.from({ length: 6 }).map((_, j) => (
              <div
                key={j}
                className="flex-1 min-w-[120px] p-3 border-r border-[var(--border)]"
              >
                <div className="skeleton h-4 w-16" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
