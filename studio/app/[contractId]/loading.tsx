export default function ContractOverviewLoading() {
  return (
    <div>
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border)] p-7"
          >
            <div className="skeleton h-9 w-16 mb-2" />
            <div className="skeleton h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Status description skeleton */}
      <div className="mt-6 rounded-xl bg-[var(--muted)] border border-[var(--border)] p-5">
        <div className="skeleton h-4 w-3/4" />
      </div>

      {/* Parties skeleton */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border)] p-5"
          >
            <div className="skeleton h-3 w-12 mb-3" />
            <div className="skeleton h-5 w-36 mb-2" />
            <div className="skeleton h-3 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}
