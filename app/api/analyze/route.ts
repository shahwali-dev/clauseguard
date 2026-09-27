import "pdf-parse/worker";

export const runtime = "nodejs";

import OpenAI from "openai";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { z } from "zod";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const FindingSchema = z.object({
  title: z.string(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
  section: z.string(),
  evidence: z.string(),
  explanation: z.string(),
  action: z.string(),
});

const ObligationSchema = z.object({
  title: z.string(),
  description: z.string(),
  deadline: z.string(),
});

const AnalysisSchema = z.object({
  overallRisk: z.enum(["LOW", "MEDIUM", "HIGH"]),
  summary: z.string(),
  findings: z.array(FindingSchema),
  obligations: z.array(ObligationSchema),
});

const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    overallRisk: {
      type: "string",
      enum: ["LOW", "MEDIUM", "HIGH"],
    },
    summary: {
      type: "string",
    },
    findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: {
            type: "string",
          },
          severity: {
            type: "string",
            enum: ["LOW", "MEDIUM", "HIGH"],
          },
          section: {
            type: "string",
          },
          evidence: {
            type: "string",
          },
          explanation: {
            type: "string",
          },
          action: {
            type: "string",
          },
        },
        required: [
          "title",
          "severity",
          "section",
          "evidence",
          "explanation",
          "action",
        ],
      },
    },
    obligations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          deadline: {
            type: "string",
          },
        },
        required: ["title", "description", "deadline"],
      },
    },
  },
  required: ["overallRisk", "summary", "findings", "obligations"],
};

const SYSTEM_PROMPT = `
You are ClauseGuard, an evidence-first contract analysis engine.

Analyze contracts for informational purposes only.

IMPORTANT RULES:

1. Never invent facts, clauses, sections, dates, obligations, or requirements.
2. Every finding MUST contain evidence copied from the supplied contract.
3. The evidence field must correspond to text that actually appears in the source.
4. If evidence cannot be supported by the source, do not create that finding.
5. Analyze only these risk categories:
   - automatic renewal
   - termination requirements
   - payment obligations
   - liability / indemnification
   - data / privacy obligations
6. Extract important contractual obligations and deadlines.
7. Explain findings in plain English for a non-lawyer.
8. Do not provide legal advice.
9. Do not make assumptions about missing contract language.
10. Return only the requested structured JSON.
`;

async function extractPdfText(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}

async function extractDocxText(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await mammoth.extractRawText({
    buffer,
  });

  return result.value.trim();
}

async function extractTxtText(file: File) {
  return (await file.text()).trim();
}

/**
 * Normalizes whitespace for robust evidence comparison.
 *
 * PDF and DOCX extraction can introduce different line breaks,
 * tabs, or repeated spaces without changing the underlying text.
 */
function normalizeForEvidence(value: string) {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getFileType(file: File) {
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  if (
    mimeType === "application/pdf" ||
    fileName.endsWith(".pdf")
  ) {
    return "pdf";
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    return "docx";
  }

  if (
    mimeType === "text/plain" ||
    fileName.endsWith(".txt")
  ) {
    return "txt";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error: "OPENAI_API_KEY is not configured.",
        },
        { status: 500 },
      );
    }

    const contentType =
      request.headers.get("content-type") || "";

    let text = "";
    let sourceType = "text";
    let sourceName = "Pasted contract";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!(file instanceof File)) {
        return Response.json(
          {
            error:
              "Please provide a PDF, DOCX, or TXT file.",
          },
          { status: 400 },
        );
      }

      if (file.size === 0) {
        return Response.json(
          {
            error: "The uploaded file is empty.",
          },
          { status: 400 },
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return Response.json(
          {
            error:
              "The document must be smaller than 10 MB.",
          },
          { status: 400 },
        );
      }

      const fileType = getFileType(file);

      if (!fileType) {
        return Response.json(
          {
            error:
              "Unsupported file format. Please upload a PDF, DOCX, or TXT file.",
          },
          { status: 400 },
        );
      }

      sourceType = fileType;
      sourceName = file.name;

      if (fileType === "pdf") {
        text = await extractPdfText(file);
      } else if (fileType === "docx") {
        text = await extractDocxText(file);
      } else if (fileType === "txt") {
        text = await extractTxtText(file);
      }
    } else {
      const body = await request.json();

      text =
        typeof body.text === "string"
          ? body.text.trim()
          : "";

      sourceType = "text";
      sourceName = "Pasted contract";
    }

    if (!text) {
      return Response.json(
        {
          error:
            sourceType === "text"
              ? "Contract text is required."
              : "No readable text was found in the uploaded document.",
        },
        { status: 400 },
      );
    }

    if (text.length < 100) {
      return Response.json(
        {
          error:
            "Please provide a longer contract or document.",
        },
        { status: 400 },
      );
    }

    const response = await client.responses.create({
      model: "gpt-6-luna",

      instructions: SYSTEM_PROMPT,

      input: `
Analyze the following contract.

Return:
- overall risk
- a concise summary
- candidate risk findings supported by source evidence
- important obligations and deadlines

Remember:
Every finding's evidence must be copied from the contract.
Do not create a finding if the source does not support it.

Contract:
---
${text}
---
`,

      text: {
        format: {
          type: "json_schema",
          name: "contract_analysis",
          strict: true,
          schema: ANALYSIS_SCHEMA,
        },
      },
    });

    const content = response.output_text;

    if (!content) {
      return Response.json(
        {
          error: "The AI returned an empty response.",
        },
        { status: 502 },
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch {
      return Response.json(
        {
          error: "The AI returned invalid JSON.",
        },
        { status: 502 },
      );
    }

    const result = AnalysisSchema.safeParse(parsed);

    if (!result.success) {
      return Response.json(
        {
          error: "AI response failed schema validation.",
          details: result.error.flatten(),
        },
        { status: 502 },
      );
    }

    /*
     * Deterministic evidence verification.
     *
     * PDF and DOCX extraction can introduce line breaks,
     * tabs, or repeated spaces. Normalize whitespace before
     * comparing evidence with the original extracted source.
     */
    const normalizedSource =
      normalizeForEvidence(text);

    const verifiedFindings = result.data.findings
      .map((finding) => {
        const evidence = finding.evidence.trim();

        const verified =
          evidence.length > 0 &&
          normalizedSource.includes(
            normalizeForEvidence(evidence),
          );

        return {
          ...finding,
          verified,
        };
      })
      .filter((finding) => finding.verified)
      .map(({ verified: _verified, ...finding }) => finding);

    const rejectedFindings = result.data.findings
      .filter((finding) => {
        const evidence = finding.evidence.trim();

        return (
          evidence.length === 0 ||
          !normalizedSource.includes(
            normalizeForEvidence(evidence),
          )
        );
      })
      .map((finding) => finding.title);

    return Response.json({
      ...result.data,

      findings: verifiedFindings,

      verification: {
        verifiedCount: verifiedFindings.length,
        rejectedCount: rejectedFindings.length,
        rejectedFindings,
        method: "deterministic-source-evidence-match",
      },

      source: {
        type: sourceType,
        name: sourceName,
        characters: text.length,
      },
    });
  } catch (error) {
    console.error(
      "ClauseGuard analysis error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    return Response.json(
      {
        error: "Unable to analyze the document.",
        details: message,
      },
      { status: 500 },
    );
  }
}