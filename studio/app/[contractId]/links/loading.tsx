export default function LinksLoading() {
  return (
    <div>
      <div className="mb-5 skeleton h-4 w-48" />
      <div className="grid gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-4"
          >
            <div className="flex-1">
              <div className="skeleton h-3 w-16 mb-2" />
              <div className="skeleton h-4 w-32 mb-1" />
              <div className="skeleton h-3 w-20" />
            </div>
            <div className="skeleton h-4 w-8 shrink-0" />
            <div className="flex-1">
              <div className="skeleton h-3 w-24 mb-2" />
              <div className="skeleton h-4 w-36 mb-1" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
