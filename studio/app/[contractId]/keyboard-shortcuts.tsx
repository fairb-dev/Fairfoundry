"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const SHORTCUTS = [
  { key: "1", label: "Go to Data tab" },
  { key: "2", label: "Go to Criteria tab" },
  { key: "3", label: "Go to Links tab" },
  { key: "4", label: "Go to Verification tab" },
  { key: "/", label: "Focus search (Verification page)" },
  { key: "?", label: "Show this help" },
];

export function KeyboardShortcuts({ contractId }: { contractId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't fire when typing in inputs, textareas, or selects
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target.isContentEditable
      ) {
        return;
      }

      // Don't fire with modifier keys (except shift for ?)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key) {
        case "1":
          e.preventDefault();
          router.push(`/${contractId}/data`);
          break;
        case "2":
          e.preventDefault();
          router.push(`/${contractId}/criteria`);
          break;
        case "3":
          e.preventDefault();
          router.push(`/${contractId}/links`);
          break;
        case "4":
          e.preventDefault();
          router.push(`/${contractId}/verification`);
          break;
        case "/":
          // Only focus search if on the verification page
          if (pathname.endsWith("/verification")) {
            e.preventDefault();
            const searchInput = document.querySelector<HTMLInputElement>(
              'input[placeholder*="Search"]',
            );
            if (searchInput) {
              searchInput.focus();
              searchInput.select();
            }
          }
          break;
        case "?":
          e.preventDefault();
          setShowHelp((prev) => !prev);
          break;
        case "Escape":
          if (showHelp) {
            e.preventDefault();
            setShowHelp(false);
          }
          break;
      }
    },
    [contractId, router, pathname, showHelp],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!showHelp) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
      onClick={() => setShowHelp(false)}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          width: "360px",
          maxWidth: "90vw",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            style={{
              margin: 0,
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Keyboard Shortcuts
          </h3>
          <button
            type="button"
            onClick={() => setShowHelp(false)}
            className="bg-transparent border-0 cursor-pointer text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between"
              style={{ padding: "4px 0" }}
            >
              <span className="text-sm text-gray-600">{s.label}</span>
              <kbd
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "28px",
                  height: "24px",
                  padding: "0 6px",
                  borderRadius: "5px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#f9fafb",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  color: "var(--foreground)",
                }}
              >
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
        <div
          className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-gray-400 text-center"
        >
          Press <kbd style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>Esc</kbd> or <kbd style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>?</kbd> to close
        </div>
      </div>
    </div>
  );
}
