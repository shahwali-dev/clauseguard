export type Severity = "LOW" | "MEDIUM" | "HIGH";

export type SourceType = "pdf" | "docx" | "txt" | "text";

export type Finding = {
  title: string;
  severity: Severity;
  section: string;
  evidence: string;
  explanation: string;
  action: string;
};

export type Obligation = {
  title: string;
  description: string;
  deadline: string;
};

export type AnalysisResult = {
  overallRisk: Severity;
  summary: string;
  findings: Finding[];
  obligations: Obligation[];

  verification: {
    verifiedCount: number;
    rejectedCount: number;
    rejectedFindings: string[];
    method: string;
  };

  source?: {
    type: SourceType;
    name: string;
    characters: number;
  };
};