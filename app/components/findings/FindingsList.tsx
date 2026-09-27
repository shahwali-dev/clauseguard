import type { Finding } from "../../lib/types";
import FindingCard from "./FindingCard";

export default function FindingsList({
  findings,
  verifiedCount,
  rejectedCount,
}: {
  findings: Finding[];
  verifiedCount: number;
  rejectedCount: number;
}) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Verified analysis
          </div>

          <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
            Risk Findings
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
          <span className="font-semibold text-emerald-600">
            {verifiedCount} verified
          </span>

          <span>·</span>

          <span>
            {rejectedCount} rejected
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {findings.map((finding, index) => (
          <FindingCard
            key={`${finding.title}-${index}`}
            finding={finding}
            index={index}
          />
        ))}

        {findings.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600">
              ✓
            </div>

            <div className="mt-4 text-sm font-semibold text-slate-900">
              No verified risk findings
            </div>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
              ClauseGuard did not find any supported findings in the
              configured risk categories.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
