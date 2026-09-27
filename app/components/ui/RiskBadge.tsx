import type { Severity } from "../../lib/types";

export function getRiskClass(risk: Severity) {
  if (risk === "HIGH") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (risk === "MEDIUM") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

export function getSeverityClass(severity: Severity) {
  if (severity === "HIGH") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (severity === "MEDIUM") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export default function RiskBadge({
  risk,
}: {
  risk: Severity;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold ${getRiskClass(
        risk,
      )}`}
    >
      {risk}
    </span>
  );
}