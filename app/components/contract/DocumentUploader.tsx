"use client";

import { ChangeEvent, useRef } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"];

type Props = {
  selectedFile: File | null;
  loading: boolean;
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
};

export default function DocumentUploader({
  selectedFile,
  loading,
  onFileSelect,
  onAnalyze,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onFileSelect(file);

    event.target.value = "";
  }

  function openPicker() {
    if (!loading) {
      inputRef.current?.click();
    }
  }

  const extension = selectedFile
    ? selectedFile.name
        .slice(selectedFile.name.lastIndexOf("."))
        .toUpperCase()
    : "";

  return (
    <div className="p-5">
      <div
        onClick={openPicker}
        className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 text-center transition hover:border-slate-300 hover:bg-white"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
          ↑
        </div>

        <div className="text-sm font-semibold text-slate-800">
          {selectedFile
            ? "Contract ready for analysis"
            : "Upload a legal contract"}
        </div>

        <div className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
          {selectedFile
            ? "The document will be processed on the server before AI analysis."
            : "Supported formats: PDF, DOCX, and TXT. Maximum file size: 10 MB."}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={handleChange}
          className="hidden"
        />

        {selectedFile && (
          <>
            <div className="mt-5 rounded-lg bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm">
              {selectedFile.name}
            </div>

            <div className="mt-2 text-xs text-slate-400">
              {extension} ·{" "}
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onAnalyze();
              }}
              disabled={loading}
              className="mt-5 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Extracting & Analyzing..."
                : "Analyze Contract →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export { MAX_FILE_SIZE };