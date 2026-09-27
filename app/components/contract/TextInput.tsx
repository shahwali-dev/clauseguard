type Props = {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  onLoadDemo: () => void;
};

export default function TextInput({
  value,
  loading,
  onChange,
  onAnalyze,
  onLoadDemo,
}: Props) {
  return (
    <div className="p-5">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste your contract or agreement text here..."
        className="min-h-[280px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-400">
          {value.length.toLocaleString()} characters
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onLoadDemo}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Load Demo
          </button>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={loading}
            className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze Contract →"}
          </button>
        </div>
      </div>
    </div>
  );
}