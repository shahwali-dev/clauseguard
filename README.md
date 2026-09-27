# ClauseGuard

## Evidence-first contract risk analysis

**ClauseGuard** is an AI-powered contract analysis tool that identifies contractual risks, obligations, and deadlines — then verifies every flagged finding against the original source text before presenting it to the user.

> **AI proposes. Deterministic verification checks. ClauseGuard presents verified findings.**

ClauseGuard is designed around a simple principle:

**Don't just ask AI what your contract says. See exactly why it flagged it.**

---

## Why ClauseGuard?

Traditional AI document analysis can produce useful answers, but generated findings can be difficult to verify.

ClauseGuard adds an evidence-verification layer between AI analysis and the final user interface.

Instead of simply displaying an AI-generated claim:

```text
"This contract contains an automatic renewal clause."
```

ClauseGuard requires the finding to include source evidence that actually appears in the supplied contract.

The analysis pipeline is:

```text
Contract
   │
   ├── Paste Text
   ├── PDF
   ├── DOCX
   └── TXT
        │
        ▼
Document Extraction
        │
        ▼
Structured AI Analysis
        │
        ▼
Zod Schema Validation
        │
        ▼
Deterministic Evidence Verification
        │
        ▼
Verified Findings
        │
        ├── Risk
        ├── Exact Evidence
        ├── Explanation
        └── Suggested Action
        │
        ▼
Obligations & Deadlines
```

Only findings whose cited evidence can be matched against the supplied source are displayed as verified findings.

---

## Core Features

### Risk Detection

ClauseGuard currently analyzes five focused risk categories:

* Automatic renewal
* Termination requirements
* Payment obligations
* Liability / indemnification
* Data / privacy obligations

Each finding includes:

* Risk severity
* Contract section
* Exact source evidence
* Plain-language explanation
* Suggested review action

---

### Evidence Verification

Every AI-generated finding contains an `evidence` field.

ClauseGuard then performs a deterministic source check:

```text
AI finding
   ↓
Evidence text
   ↓
Case-insensitive source matching
   ↓
Evidence exists?
   ├── Yes → Verified finding
   └── No  → Rejected finding
```

This creates a clear separation between:

**AI interpretation**

and

**source-grounded verification**

The verification layer does not ask another AI model whether the evidence is correct. It directly checks whether the cited text exists in the supplied source.

---

### Obligation Timeline

ClauseGuard also extracts important contractual obligations and deadlines.

Examples include:

* Renewal notice periods
* Invoice payment deadlines
* Termination notice periods
* Security incident reporting deadlines
* Cure periods
* Continuing obligations

These are presented separately from risk findings so users can distinguish between:

**What may require review**

and

**What the contract requires someone to do.**

---

## Supported Inputs

ClauseGuard currently supports:

| Input                  | Support                 |
| ---------------------- | ----------------------- |
| Pasted text            | ✅                       |
| PDF                    | ✅                       |
| DOCX                   | ✅                       |
| TXT                    | ✅                       |
| Scanned/image-only PDF | Not currently supported |

PDF and DOCX files are processed server-side before analysis.

Maximum supported upload size:

**10 MB**

---

## Architecture

```text
┌──────────────────────────────┐
│          User Input          │
│                              │
│ Text / PDF / DOCX / TXT      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Document Extraction     │
│                              │
│ PDF / DOCX / TXT → text      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       OpenAI Responses       │
│                              │
│ Structured contract analysis │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Zod Validation         │
│                              │
│ Validate structured output   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Evidence Verification Layer  │
│                              │
│ Source ↔ cited evidence      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       ClauseGuard UI         │
│                              │
│ Risk / Evidence / Actions    │
│ Obligations / Verification   │
└──────────────────────────────┘
```

---

## Technical Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS

### Backend

* Next.js App Router API route
* Node.js runtime

### AI

* OpenAI Responses API
* Structured JSON Schema output

### Validation

* Zod

### Document Processing

* `pdf-parse`
* `mammoth`

### Package Manager

* pnpm

---

## Project Structure

```text
app/
├── api/
│   └── analyze/
│       └── route.ts
│
├── components/
│   ├── contract/
│   │   ├── AnalysisProgress.tsx
│   │   ├── AnalysisResults.tsx
│   │   ├── ContractAnalyzer.tsx
│   │   ├── DocumentUploader.tsx
│   │   ├── InputTabs.tsx
│   │   └── TextInput.tsx
│   │
│   ├── findings/
│   │   ├── EvidenceBlock.tsx
│   │   ├── FindingCard.tsx
│   │   └── FindingsList.tsx
│   │
│   ├── obligations/
│   │   ├── ObligationCard.tsx
│   │   └── ObligationsList.tsx
│   │
│   └── ui/
│       ├── RiskBadge.tsx
│       └── SectionHeader.tsx
│
├── lib/
│   ├── api.ts
│   ├── document-utils.ts
│   └── types.ts
│
├── page.tsx
└── ...
```

---

## Getting Started

### Requirements

* Node.js 24+
* pnpm
* OpenAI API key

### Install dependencies

```bash
pnpm install
```

### Configure environment

Create `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key
```

### Start development server

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

### Production build

```bash
pnpm build
```

### Start production server

```bash
pnpm start
```

---

## API

The application exposes:

```text
POST /api/analyze
```

### Text input

Send JSON:

```json
{
  "text": "Your contract text..."
}
```

### File input

Send multipart form data:

```text
file=<PDF | DOCX | TXT>
```

The API:

1. Extracts document text
2. Sends the source to the AI analysis layer
3. Validates the structured response
4. Verifies cited evidence
5. Removes unsupported findings
6. Returns the verified analysis

---

## Structured Analysis

The AI response is constrained to a structured schema containing:

```text
overallRisk
summary
findings[]
obligations[]
```

Each finding contains:

```text
title
severity
section
evidence
explanation
action
```

Each obligation contains:

```text
title
description
deadline
```

This prevents the frontend from depending on arbitrary free-form model output.

---

## AI Safety & Verification

ClauseGuard is intentionally **not** designed as an autonomous legal advisor.

The AI does not have unrestricted authority to directly determine what should be shown to the user.

Instead:

```text
AI
 ↓
Proposes structured findings
 ↓
Schema validation
 ↓
Deterministic evidence verification
 ↓
Verified findings
```

If the cited evidence cannot be found in the supplied source, the finding is rejected from the displayed results.

This does not guarantee that an analysis is legally complete or legally correct. It is a technical safeguard against displaying unsupported source claims.

---

## Limitations

ClauseGuard is an informational contract analysis prototype.

Current limitations include:

* It does not provide legal advice.
* It does not replace a lawyer or qualified legal professional.
* Evidence verification currently uses deterministic text matching.
* Scanned/image-only PDFs are not OCR processed.
* The configured risk categories are intentionally limited.
* AI interpretation can still be incomplete or incorrect.
* Contract interpretation may depend on jurisdiction and surrounding legal context that ClauseGuard does not independently determine.

For important legal decisions, users should consult a qualified legal professional.

---

## Design Philosophy

ClauseGuard focuses on **traceability rather than simply generating more AI output**.

The core design principle is:

> **Every important AI finding should have a visible path back to the source.**

That principle influences both the backend architecture and the user interface.

Instead of hiding the model's reasoning behind a single summary, ClauseGuard exposes:

```text
Finding
   ↓
Exact Evidence
   ↓
Why It Was Flagged
   ↓
Suggested Review Action
```

This makes the analysis easier for a human reviewer to inspect.

---

## Hackathon Context

ClauseGuard was built for **LexHack 2026**, under the **AI × Law × Civic Technology** theme.

Relevant areas include:

* Legal automation
* AI-assisted contract analysis
* AI safety and verification
* Access to legal information
* Human-centered legal technology

The project is designed as a working prototype demonstrating how structured AI analysis can be combined with deterministic verification for more traceable contract review.

---

## Disclaimer

ClauseGuard provides informational contract analysis only.

It is not a law firm, lawyer, or substitute for professional legal advice.

Always consult a qualified legal professional for legal decisions.

---

## License

This project is intended as a hackathon project.

License details may be added by the project authors.
