"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Overview", suffix: "" },
  { label: "Data", suffix: "/data" },
  { label: "Criteria", suffix: "/criteria" },
  { label: "Links", suffix: "/links" },
  { label: "Verification", suffix: "/verification" },
];

export function TabNav({ contractId }: { contractId: string }) {
  const pathname = usePathname();
  const basePath = `/${contractId}`;

  return (
    <nav className="tab-nav">
      {TABS.map((tab) => {
        const href = `${basePath}${tab.suffix}`;
        const isActive =
          tab.suffix === ""
            ? pathname === basePath
            : pathname.startsWith(href);

        return (
          <Link
            key={tab.label}
            href={href}
            className={`tab-link ${isActive ? "tab-link-active" : ""}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
