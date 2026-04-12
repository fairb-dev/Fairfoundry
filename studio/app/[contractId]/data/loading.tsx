export default function DataLoading() {
  return (
    <div>
      {/* File info skeleton */}
      <div className="mb-5 flex items-center gap-3">
        <div className="skeleton h-8 w-40 rounded-lg" />
        <div className="skeleton h-4 w-28" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="flex gap-0 bg-[var(--muted)] border-b-2 border-[var(--border)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 min-w-[120px] p-4 border-r border-[var(--border)]"
            >
              <div className="skeleton h-4 w-20 mb-2" />
              <div className="skeleton h-3 w-12" />
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-0 border-b border-[var(--border)]"
          >
            {Array.from({ length: 5 }).map((_, j) => (
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
