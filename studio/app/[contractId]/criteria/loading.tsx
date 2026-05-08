export default function CriteriaLoading() {
  return (
    <div>
      <div className="mb-5 skeleton h-4 w-32" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border)] p-5"
          >
            <div className="skeleton h-4 w-40 mb-3" />
            <div className="skeleton h-6 w-28 mb-3" />
            <div className="skeleton h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
