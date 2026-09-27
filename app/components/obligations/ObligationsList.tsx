import type { Obligation } from "../../lib/types";

export default function ObligationsList({
  obligations,
}: {
  obligations: Obligation[];
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Action items
          </div>

          <h3 className="mt-1 text-base font-bold text-slate-950">
            Obligation Timeline
          </h3>
        </div>

        <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2 text-[11px] font-bold text-slate-600">
          {obligations.length}
        </div>
      </div>

      {obligations.length > 0 ? (
        <div className="mt-6 space-y-0">
          {obligations.map((obligation, index) => (
            <div
              key={`${obligation.title}-${index}`}
              className="relative pl-7 pb-6 last:pb-0"
            >
              {index < obligations.length - 1 && (
                <div className="absolute left-[5px] top-3 h-[calc(100%-6px)] w-px bg-slate-200" />
              )}

              <div className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-white bg-slate-900 shadow-sm ring-1 ring-slate-200" />

              <div className="text-sm font-semibold leading-5 text-slate-900">
                {obligation.title}
              </div>

              <div className="mt-1.5 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                {obligation.deadline}
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {obligation.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs leading-5 text-slate-500">
            No specific deadlines or obligations were extracted from
            the supplied contract.
          </p>
        </div>
      )}
    </section>
  );
}
