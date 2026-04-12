"use client";

import { useRef, useState, useTransition } from "react";
import { uploadERSAction } from "./actions";

export function ERSUpload({
  contractId,
  onManualClick,
}: {
  contractId: string;
  onManualClick: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    count?: number;
    error?: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".json") || file.name.endsWith(".txt"))) {
      setFileName(file.name);
      setResult(null);
      const dt = new DataTransfer();
      dt.items.add(file);
      if (inputRef.current) {
        inputRef.current.files = dt.files;
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setResult(null);
    }
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await uploadERSAction(contractId, formData);
      setResult(res);
    });
  }

  // After successful upload, show success message
  if (result && result.count && result.count > 0) {
    return (
      <div className="rounded-2xl border-2 border-green-200 bg-green-50/50 p-12 text-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          className="mx-auto mb-4 text-green-500"
        >
          <path
            d="M9 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <p className="text-lg font-semibold text-green-800">
          {result.count} {result.count === 1 ? "criterion" : "criteria"}{" "}
          extracted
        </p>
        <p className="mt-2 text-sm text-green-600">
          From {fileName}
        </p>
      </div>
    );
  }

  return (
    <div>
      <form action={handleSubmit}>
        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 text-center transition-colors cursor-pointer ${
            isDragging
              ? "border-[var(--accent)] bg-blue-50/50"
              : fileName
                ? "border-green-300 bg-green-50/30"
                : "border-[var(--border)] bg-[var(--muted)] hover:border-gray-400"
          }`}
        >
          {/* Icon */}
          {fileName ? (
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              className="mb-4 text-green-500"
            >
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              className="mb-4 text-gray-400"
            >
              <path
                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12 18v-6M9 15l3-3 3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {fileName ? (
            <>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {fileName}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Ready to extract criteria. Click the button below.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-600">
                Drop your specification file here or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Supports .json and .txt specification files.
              </p>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            name="ersFile"
            accept=".json,.txt,.text"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            tabIndex={-1}
          />
        </div>

        {/* Error display */}
        {result?.error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-red-700">
            {result.error}
          </div>
        )}

        {/* Upload button */}
        {fileName && (
          <div className="mt-5 flex justify-center">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M4 12a8 8 0 018-8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-75"
                    />
                  </svg>
                  Extracting Criteria...
                </span>
              ) : (
                "Extract Criteria"
              )}
            </button>
          </div>
        )}
      </form>

      {/* Manual entry link */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onManualClick}
          className="text-sm text-gray-500 underline underline-offset-2 hover:text-[var(--foreground)] cursor-pointer"
        >
          Or define criteria manually
        </button>
      </div>
    </div>
  );
}
