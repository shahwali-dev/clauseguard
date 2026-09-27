import type { Finding } from "../../lib/types";
import { getSeverityClass } from "../ui/RiskBadge";

export default function FindingCard({
    finding,
    index,
}: {
    finding: Finding;
    index: number;
}) {
    return (
        <article
            id={`finding-${index + 1}`}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
            {/* Finding header */}
            <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                            <span>
                                Finding {String(index + 1).padStart(2, "0")}
                            </span>

                            <span className="text-slate-300">•</span>

                            <span>{finding.section}</span>
                        </div>

                        <h4 className="text-lg font-bold tracking-tight text-slate-950">
                            {finding.title}
                        </h4>
                    </div>

                    <span
                        className={`w-fit shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getSeverityClass(
                            finding.severity,
                        )}`}
                    >
                        {finding.severity}
                    </span>
                </div>
            </div>

            {/* Evidence */}
            <div className="px-6 py-6 sm:px-7">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                                ✓
                            </span>

                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                                Exact source evidence
                            </span>
                        </div>

                        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-emerald-700 shadow-sm">
                            VERIFIED
                        </span>
                    </div>

                    <blockquote className="border-l-2 border-emerald-400 pl-4 text-sm italic leading-7 text-slate-700">
                        “{finding.evidence}”
                    </blockquote>
                </div>

                {/* Explanation + action */}
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <InfoBlock
                        label="Why this was flagged"
                        text={finding.explanation}
                    />

                    <InfoBlock
                        label="Suggested review action"
                        text={finding.action}
                    />
                </div>
            </div>
        </article>
    );
}

function InfoBlock({
    label,
    text,
}: {
    label: string;
    text: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {label}
            </div>

            <p className="text-xs leading-6 text-slate-600">
                {text}
            </p>
        </div>
    );
}
