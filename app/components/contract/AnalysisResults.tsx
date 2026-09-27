import type { AnalysisResult } from "../../lib/types";
import { getRiskClass } from "../ui/RiskBadge";
import FindingsList from "../findings/FindingsList";
import ObligationsList from "../obligations/ObligationsList";

export default function AnalysisResults({
  analysis,
  onBack,
}: {
  analysis: AnalysisResult;
  onBack: () => void;
}) {
  const sourceCharacters = analysis.source?.characters ?? 0;

  const sourceName =
    analysis.source?.name ||
    (analysis.source?.type === "pdf"
      ? "Uploaded PDF"
      : analysis.source?.type === "docx"
        ? "Uploaded DOCX"
        : analysis.source?.type === "txt"
          ? "Uploaded TXT"
          : "Pasted contract");

  const verifiedCount = analysis.verification.verifiedCount;
  const rejectedCount = analysis.verification.rejectedCount;
  const totalReviewed = verifiedCount + rejectedCount;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12">
      {/* Top bar */}
      <div className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-950"
          >
            <span aria-hidden="true">←</span>
            Analyze another contract
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              Contract Risk Report
            </h2>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Evidence checked
            </span>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            AI-generated findings are checked against the original source
            before they are shown below.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-2xl border px-4 py-3 ${getRiskClass(
            analysis.overallRisk,
          )}`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            Overall risk
          </span>

          <span className="text-sm font-bold">
            {analysis.overallRisk}
          </span>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          {/* Executive summary */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                01
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Executive summary
                </div>

                <h3 className="mt-1 text-sm font-bold text-slate-950">
                  What ClauseGuard found
                </h3>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-700">
              {analysis.summary}
            </p>
          </section>

          {/* Findings */}
          <FindingsList
            findings={analysis.findings}
            verifiedCount={verifiedCount}
            rejectedCount={rejectedCount}
          />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Verification card */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Evidence verification
                </div>

                <h3 className="mt-1 text-base font-bold text-slate-950">
                  Findings checked
                </h3>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600">
                ✓
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Stat
                label="Verified"
                value={verifiedCount}
                tone="verified"
              />

              <Stat
                label="Rejected"
                value={rejectedCount}
                tone="rejected"
              />
            </div>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Verification rate
                </span>

                <span className="text-xs font-bold text-slate-700">
                  {totalReviewed > 0
                    ? `${Math.round(
                        (verifiedCount / totalReviewed) * 100,
                      )}%`
                    : "—"}
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width:
                      totalReviewed > 0
                        ? `${(verifiedCount / totalReviewed) * 100}%`
                        : "0%",
                  }}
                />
              </div>

              <p className="mt-3 text-[11px] leading-5 text-slate-500">
                Evidence is checked using deterministic matching against
                the supplied contract source.
              </p>
            </div>
          </section>

          {/* Obligations */}
          <ObligationsList obligations={analysis.obligations} />

          {/* Source */}
          <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Source analyzed
            </div>

            <div className="mt-3 break-words text-sm font-semibold">
              {sourceName}
            </div>

            <div className="mt-2 text-xs leading-5 text-slate-400">
              {sourceCharacters.toLocaleString()} characters extracted
              and analyzed.
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Method
              </div>

              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                AI proposes structured findings. ClauseGuard validates the
                response and verifies cited evidence against the source.
              </p>
            </div>
          </section>
        </aside>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-[11px] leading-5 text-slate-400">
        ClauseGuard provides informational contract analysis, not legal
        advice. Consult a qualified legal professional for legal decisions.
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "verified" | "rejected";
}) {
  const valueClass =
    tone === "verified"
      ? "text-emerald-700"
      : value > 0
        ? "text-red-600"
        : "text-slate-950";

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className={`text-2xl font-bold ${valueClass}`}>
        {value}
      </div>

      <div className="mt-1 text-[11px] font-semibold text-slate-500">
        {label}
      </div>
    </div>
  );
}
