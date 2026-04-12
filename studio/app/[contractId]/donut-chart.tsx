export function DonutChart({
  passRate,
  size = 64,
}: {
  passRate: number;
  size?: number;
}) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const passArc = (passRate / 100) * circumference;
  const color =
    passRate >= 95
      ? "var(--pass-text, #166534)"
      : passRate >= 80
        ? "#b45309"
        : "var(--fail-text, #991b1b)";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="5"
      />
      {/* Pass arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${passArc} ${circumference}`}
        strokeDashoffset={circumference / 4}
        strokeLinecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
      />
      {/* Center text */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="700"
        fontFamily="var(--font-mono)"
        fill={color}
      >
        {Math.round(passRate)}%
      </text>
    </svg>
  );
}

export function CriterionMiniBar({
  passRate,
  label,
  failCount,
}: {
  passRate: number;
  label: string;
  failCount: number;
}) {
  const color =
    passRate >= 95
      ? "#166534"
      : passRate >= 80
        ? "#b45309"
        : "#991b1b";
  const bg =
    passRate >= 95
      ? "#dcfce7"
      : passRate >= 80
        ? "#fef3c7"
        : "#fef2f2";

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div
        className="text-xs font-medium truncate"
        style={{ width: "180px", flexShrink: 0, color: "var(--foreground)" }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: "6px",
          borderRadius: "3px",
          backgroundColor: "#e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${passRate}%`,
            height: "100%",
            borderRadius: "3px",
            backgroundColor: color,
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <div
        className="text-xs font-mono"
        style={{ width: "70px", textAlign: "right", color }}
      >
        {passRate.toFixed(1)}%
      </div>
      {failCount > 0 && (
        <div
          className="text-xs font-mono"
          style={{
            padding: "1px 6px",
            borderRadius: "8px",
            backgroundColor: bg,
            color,
            fontWeight: 600,
          }}
        >
          {failCount} fail
        </div>
      )}
    </div>
  );
}
