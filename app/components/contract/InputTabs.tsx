type InputMode = "paste" | "upload";

export default function InputTabs({
  inputMode,
  onChange,
}: {
  inputMode: InputMode;
  onChange: (mode: InputMode) => void;
}) {
  return (
    <div className="flex gap-2 border-b border-slate-100 p-2">
      <button
        type="button"
        onClick={() => onChange("paste")}
        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
          inputMode === "paste"
            ? "bg-slate-950 text-white"
            : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        Paste Text
      </button>

      <button
        type="button"
        onClick={() => onChange("upload")}
        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
          inputMode === "upload"
            ? "bg-slate-950 text-white"
            : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        Upload Contract
      </button>
    </div>
  );
}