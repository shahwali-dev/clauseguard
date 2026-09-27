"use client";

import { useState } from "react";
import InputTabs from "./components/contract/InputTabs";
import TextInput from "./components/contract/TextInput";
import DocumentUploader, {
  MAX_FILE_SIZE,
} from "./components/contract/DocumentUploader";
import AnalysisResults from "./components/contract/AnalysisResults";
import { analyzeFile, analyzeText } from "./lib/api";
import type { AnalysisResult } from "./lib/types";

type InputMode = "paste" | "upload";

const demoContract = `SERVICE AGREEMENT

This Agreement shall automatically renew for successive one-year periods unless either party provides written notice at least thirty (30) days before the renewal date.

Invoices are payable within fifteen (15) days of receipt. If an invoice remains unpaid for more than ten (10) days after written notice, the service provider may suspend performance.

Either party may terminate this Agreement by providing thirty (30) days written notice. Any amounts accrued before termination remain payable.

The customer shall indemnify and hold harmless the service provider from third-party claims arising from the customer's use of the services, except to the extent caused by the provider's gross negligence or willful misconduct.

The service provider shall implement reasonable technical and organizational measures to protect personal data and shall notify the customer of a confirmed security incident within forty-eight (48) hours after becoming aware of it.

The parties shall continue to comply with confidentiality and data protection obligations that by their nature survive termination.`;

export default function Home() {
  const [inputMode, setInputMode] = useState<InputMode>("paste");
  const [contractText, setContractText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleModeChange(mode: InputMode) {
    setInputMode(mode);
    setError("");
  }

  function loadDemo() {
    setInputMode("paste");
    setContractText(demoContract);
    setSelectedFile(null);
    setAnalysis(null);
    setError("");
  }

  function handleFileSelect(file: File) {
    setError("");
    setAnalysis(null);
    setSelectedFile(null);

    const name = file.name.toLowerCase();

    const supported =
      name.endsWith(".pdf") ||
      name.endsWith(".docx") ||
      name.endsWith(".txt");

    if (!supported) {
      setError(
        "Unsupported file format. Please select a PDF, DOCX, or TXT contract.",
      );
      return;
    }

    if (file.size === 0) {
      setError("The selected file is empty.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("The document must be smaller than 10 MB.");
      return;
    }

    setSelectedFile(file);
    setInputMode("upload");
  }

  async function analyzeContract() {
    setError("");
    setAnalysis(null);

    try {
      setLoading(true);

      if (inputMode === "upload") {
        if (!selectedFile) {
          throw new Error(
            "Please select a PDF, DOCX, or TXT contract before analyzing.",
          );
        }

        const result = await analyzeFile(selectedFile);

        setAnalysis(result);
        return;
      }

      const text = contractText.trim();

      if (!text) {
        throw new Error(
          "Please paste contract text before analyzing.",
        );
      }

      if (text.length < 100) {
        throw new Error(
          "Please provide a longer contract or document.",
        );
      }

      const result = await analyzeText(text);

      setAnalysis(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze the document.",
      );
    } finally {
      setLoading(false);
    }
  }

  function resetAnalysis() {
    setAnalysis(null);
    setSelectedFile(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold tracking-tight text-white shadow-sm">
              C
            </div>

            <div>
              <div className="text-[15px] font-bold tracking-tight text-slate-950">
                ClauseGuard
              </div>

              <div className="text-[11px] font-medium text-slate-500">
                Evidence-first contract analysis
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-7 text-xs font-medium text-slate-500 md:flex">
            <span>Risk Detection</span>
            <span>Evidence Verification</span>
            <span>Obligations</span>
          </div>
        </div>
      </header>

      {!analysis ? (
        <>
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.06),transparent_65%)]" />

            <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[11px] font-semibold tracking-wide text-slate-600 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  AI × LAW × CIVIC TECHNOLOGY
                </div>

                <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
                  Don't just ask AI
                  <br />
                  <span className="text-slate-400">
                    what your contract says.
                  </span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                  ClauseGuard identifies contract risks, obligations, and
                  deadlines — then verifies every flagged finding against
                  the original source.
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                    AI-assisted analysis
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                    Deterministic evidence check
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                    No legal advice
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Analyzer */}
          <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-950">
                        Analyze a contract
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Paste text or upload a PDF, DOCX, or TXT file.
                      </p>
                    </div>

                    {!loading && (
                      <button
                        type="button"
                        onClick={loadDemo}
                        className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        Load demo
                      </button>
                    )}
                  </div>
                </div>

                <InputTabs
                  inputMode={inputMode}
                  onChange={handleModeChange}
                />

                {inputMode === "paste" ? (
                  <TextInput
                    value={contractText}
                    loading={loading}
                    onChange={setContractText}
                    onAnalyze={analyzeContract}
                    onLoadDemo={loadDemo}
                  />
                ) : (
                  <DocumentUploader
                    selectedFile={selectedFile}
                    loading={loading}
                    onFileSelect={handleFileSelect}
                    onAnalyze={analyzeContract}
                  />
                )}

                {loading && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950" />

                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          Analyzing contract…
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Extracting clauses, checking evidence, and
                          preparing findings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-bold text-red-700">
                      !
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-red-800">
                        Analysis could not be completed
                      </p>

                      <p className="mt-1 text-xs leading-5 text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Product pillars */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Feature
                  number="01"
                  title="Detect risk"
                  description="Identify renewal, termination, payment, liability, and privacy issues."
                />

                <Feature
                  number="02"
                  title="Verify evidence"
                  description="A finding is shown only when its cited evidence appears in the source."
                />

                <Feature
                  number="03"
                  title="Track obligations"
                  description="Turn contractual deadlines and responsibilities into clear action items."
                />
              </div>

              {/* Trust strip */}
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                <div className="flex flex-col gap-3 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    <strong className="font-semibold text-slate-700">
                      Evidence-first architecture
                    </strong>{" "}
                    — AI proposes findings; deterministic checks verify
                    source evidence.
                  </span>

                  <span className="shrink-0 font-medium text-slate-400">
                    Informational analysis only
                  </span>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <AnalysisResults
          analysis={analysis}
          onBack={resetAnalysis}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-7 text-center text-[11px] leading-5 text-slate-400 sm:px-8">
          <p>
            ClauseGuard provides informational contract analysis, not legal
            advice.
          </p>

          <p>
            Always consult a qualified legal professional for legal
            decisions.
          </p>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-[0.16em] text-slate-400">
          {number}
        </span>

        <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
      </div>

      <h3 className="text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}
