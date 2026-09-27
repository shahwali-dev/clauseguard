# ClauseGuard

## Evidence-first contract risk analysis

> **AI proposes. Deterministic verification checks. ClauseGuard presents verified findings.**

ClauseGuard is an AI-powered contract analysis tool that identifies potential contractual **risks, obligations, and deadlines** — then verifies every displayed finding against the **original contract text** before presenting it to the user.

### The core idea

> **Don't just ask AI what your contract says. See exactly why it flagged it.**

---

## 🔗 Quick Links

* **Live Demo:** https://clauseguard-labs.vercel.app/
* **GitHub:** https://github.com/shahwali-dev/clauseguard
* **Demo Video:** https://youtu.be/lUKRRT1O2_A

---

# Why ClauseGuard?

Most AI contract tools focus primarily on generating summaries, extracting clauses, or answering questions about a document.

ClauseGuard adds another layer:

```text
AI identifies a potential issue
              ↓
AI provides supporting evidence
              ↓
Deterministic system checks the evidence
              ↓
Evidence exists in source?
        ┌─────┴─────┐
       YES          NO
        ↓            ↓
    VERIFIED      REJECTED
```

This means the AI is **not the final authority over what gets displayed as a verified finding**.

The system separates:

**AI interpretation**

from

**source-grounded verification**

That separation is the central design principle behind ClauseGuard.

---

# The Problem

Contracts contain important obligations, deadlines, restrictions, and risk clauses, but reviewing them manually can be slow and difficult.

Important terms can be buried inside long agreements:

* Automatic renewal clauses
* Termination requirements
* Payment obligations
* Liability and indemnification
* Data and privacy obligations
* Notice periods
* Security incident deadlines
* Cure periods
* Continuing obligations

AI can make these documents easier to understand, but a plausible AI-generated statement is not automatically trustworthy simply because it sounds convincing.

For example, an AI system might say:

```text
"This contract contains an automatic renewal clause."
```

The more important question is:

```text
Where exactly does the contract say that?
```

**ClauseGuard is built around that question.**

---

# The Solution

ClauseGuard creates an evidence-verification layer between generative AI analysis and the final user interface.

```text
                         CONTRACT
                            │
              ┌─────────────┴─────────────┐
              │                           │
         Paste Text                PDF / DOCX / TXT
              │                           │
              └─────────────┬─────────────┘
                            ▼
                   Document Extraction
                            │
                            ▼
                  Structured AI Analysis
                            │
                            ▼
                     Zod Validation
                            │
                            ▼
              Deterministic Evidence Check
                            │
                   ┌────────┴────────┐
                   │                 │
             Evidence found    Evidence missing
                   │                 │
                   ▼                 ▼
             VERIFIED FINDING      REJECTED
                   │
                   ▼
              ClauseGuard
               Risk Report
```

The result is an AI-assisted workflow where every displayed finding has a traceable path back to the supplied contract.

---

# What ClauseGuard Detects

ClauseGuard currently focuses on five contract risk categories.

### 1. Automatic Renewal

Identifies renewal language, recurring terms, notice periods, and renewal-related requirements that may require attention.

### 2. Termination

Identifies termination conditions, notice requirements, suspension rights, cure periods, and related restrictions.

### 3. Payment

Finds payment obligations, invoice requirements, payment deadlines, and related contractual terms.

### 4. Liability & Indemnification

Highlights liability limitations, indemnification provisions, and related contractual risk language.

### 5. Data & Privacy

Identifies obligations involving data handling, privacy, security, incident reporting, and related requirements.

---

# Every Finding Is Actionable

Each verified finding contains:

| Field           | Purpose                                        |
| --------------- | ---------------------------------------------- |
| **Severity**    | Indicates LOW, MEDIUM, or HIGH attention level |
| **Section**     | Identifies the relevant contract section       |
| **Evidence**    | Shows the exact supporting source text         |
| **Explanation** | Explains the finding in plain English          |
| **Action**      | Suggests what the reviewer should examine      |

The user does not have to search through the entire document to understand why something was flagged.

---

# Evidence Verification

## The Core Technical Differentiator

The AI is explicitly required to provide evidence supporting each finding.

ClauseGuard then performs a deterministic check against the original source text.

```text
                    AI FINDING
                        │
                        ▼
                  Evidence text
                        │
                        ▼
             Normalize source + evidence
                        │
                        ▼
             Case-insensitive matching
                        │
                        ▼
             Evidence exists in source?
                   ┌────┴────┐
                  YES        NO
                   │          │
                   ▼          ▼
              VERIFIED     REJECTED
```

The verification layer does **not** ask another AI model whether the evidence is correct.

Instead, it directly checks whether the cited evidence exists within the supplied contract text.

This creates a deliberately simple and auditable boundary:

```text
Probabilistic AI
       │
       ▼
Structured output
       │
       ▼
Deterministic verification
       │
       ▼
Human-readable result
```

### Why this matters

A model can generate a plausible clause that does not actually exist in the source document.

ClauseGuard is designed to prevent that unsupported finding from appearing in the verified findings shown to the user.

This does **not** guarantee legal correctness or completeness.

It provides a clear technical safeguard against displaying findings whose cited evidence cannot be traced to the supplied source.

---

# Obligations & Deadlines

Contract review is not only about identifying risks.

Contracts also contain actions that someone must perform.

ClauseGuard therefore extracts obligations and deadlines separately from risk findings.

Examples include:

* Renewal notice periods
* Invoice payment deadlines
* Termination notice periods
* Security incident reporting deadlines
* Cure periods
* Continuing obligations
* Data protection requirements

This creates an important distinction:

> **What may require review**

versus

> **What the contract requires someone to do**

---

# Human-in-the-Loop by Design

ClauseGuard is intentionally designed as a **review assistant**, not an autonomous legal decision-maker.

For each verified finding, the interface exposes:

```text
Risk
  ↓
Exact Contract Evidence
  ↓
Why It Was Flagged
  ↓
Suggested Review Action
```

The reviewer can inspect the underlying evidence instead of being asked to blindly trust an AI-generated conclusion.

The goal is not to make AI sound more authoritative.

The goal is to make AI-assisted contract review **more transparent, traceable, and inspectable**.

---

# Supported Inputs

| Input                    | Support                    |
| ------------------------ | -------------------------- |
| Pasted contract text     | ✅                          |
| PDF                      | ✅                          |
| DOCX                     | ✅                          |
| TXT                      | ✅                          |
| Scanned / image-only PDF | ⚠️ Not currently supported |

PDF and DOCX files are extracted server-side and then passed through the same analysis pipeline as pasted text.

**Maximum upload size: 10 MB**

---

# End-to-End Architecture

```text
┌─────────────────────────────────────────┐
│                USER INPUT               │
│                                         │
│      Text / PDF / DOCX / TXT            │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│          DOCUMENT EXTRACTION             │
│                                         │
│       PDF / DOCX / TXT → Text           │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│          OPENAI RESPONSES API            │
│                                         │
│      Structured contract analysis        │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│             ZOD VALIDATION              │
│                                         │
│        Validate structured output       │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│       DETERMINISTIC VERIFICATION        │
│                                         │
│           Source ↔ Evidence             │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│             CLAUSEGUARD UI              │
│                                         │
│  Risks / Evidence / Actions /           │
│  Obligations / Verification             │
└─────────────────────────────────────────┘
```

---

# Technical Stack

### Frontend

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS**

### Backend

* **Next.js App Router**
* **Node.js runtime**
* Server-side document processing

### AI

* **OpenAI Responses API**
* Structured JSON Schema output

### Validation

* **Zod**

### Document Processing

* **pdf-parse**
* **Mammoth**

### Package Management

* **pnpm**

### Deployment

* **Vercel**

---

# Structured AI Output

The model is constrained to a structured schema rather than unrestricted free-form output.

### Analysis

```text
overallRisk
summary
findings[]
obligations[]
```

### Finding

```text
title
severity
section
evidence
explanation
action
```

### Obligation

```text
title
description
deadline
```

This gives the application a predictable contract between the AI layer and the frontend.

---

# API

ClauseGuard exposes a single analysis endpoint:

```text
POST /api/analyze
```

### Text input

```json
{
  "text": "Your contract text..."
}
```

### File input

```text
multipart/form-data
file=<PDF | DOCX | TXT>
```

### Processing pipeline

1. Receive contract text or document
2. Validate input and file size
3. Extract source text
4. Send source to structured AI analysis
5. Validate the AI response with Zod
6. Verify each cited finding against the original source
7. Reject unsupported findings
8. Return the verified analysis and verification statistics

---

# Verification Result

The API exposes verification information alongside the analysis.

Conceptually:

```text
Verification
├── verifiedCount
├── rejectedCount
├── rejectedFindings
└── method
```

The UI surfaces this as an **Evidence Checked** / verification indicator so the user can understand how the displayed findings were processed.

The verification method is intentionally transparent:

```text
deterministic-source-evidence-match
```

---

# AI Safety & Guardrails

ClauseGuard deliberately avoids presenting itself as an autonomous legal advisor.

The analysis pipeline applies multiple constraints:

### 1. Structured output

The AI must return a defined schema.

### 2. Source-grounded evidence

Every finding is required to contain supporting evidence.

### 3. Deterministic verification

The supplied evidence must be found in the original source text.

### 4. Limited risk categories

The prototype focuses on five defined categories rather than pretending to understand every possible legal issue.

### 5. Human review

The final interface exposes evidence, explanation, and suggested review action instead of presenting the model as the final authority.

```text
AI
 │
 ▼
Structured findings
 │
 ▼
Schema validation
 │
 ▼
Source evidence verification
 │
 ▼
Verified findings
 │
 ▼
Human review
```

---

# Challenges We Designed Around

The main engineering challenge was balancing the usefulness of generative AI with the need for traceability.

An LLM can produce an explanation that sounds convincing but is not actually supported by the supplied document.

Instead of solving that problem by adding another opaque AI layer, ClauseGuard uses a deterministic verification boundary.

```text
Probabilistic AI
       +
Structured output
       +
Deterministic validation
       +
Human inspection
       =
More traceable AI-assisted analysis
```

A second challenge was supporting multiple document formats while maintaining one consistent analysis pipeline.

PDF, DOCX, TXT, and pasted text are normalized into source text before entering the same structured analysis and verification flow.

---

# What We Learned

Building ClauseGuard reinforced a simple principle:

> **Adding AI to a workflow is not the same as making the workflow trustworthy.**

For document analysis, the surrounding system matters just as much as the model.

The project combines:

* LLM-based interpretation
* Structured output schemas
* Runtime validation
* Deterministic source verification
* Human-readable evidence presentation

The result is an architecture where AI can provide useful analysis without becoming the only authority in the workflow.

---

# Accomplishments

ClauseGuard demonstrates a complete working flow from document ingestion to verified contract analysis.

### Core capabilities

* ✅ Full-stack contract analysis
* ✅ Pasted-text analysis
* ✅ PDF support
* ✅ DOCX support
* ✅ TXT support
* ✅ Structured AI analysis
* ✅ Five focused risk categories
* ✅ Risk severity classification
* ✅ Obligation extraction
* ✅ Deadline extraction
* ✅ Exact evidence presentation
* ✅ Deterministic source-evidence verification
* ✅ Rejected-finding tracking
* ✅ Structured AI output validation
* ✅ Production deployment

### The central accomplishment

> **Every displayed finding is connected to evidence that can be traced back to the supplied contract text.**

---

# Design Philosophy

ClauseGuard focuses on:

> **Traceability rather than simply generating more AI output.**

The core principle is:

> **Every important AI finding should have a visible path back to the source.**

That principle influences both the backend architecture and the interface.

Instead of hiding everything behind a single AI-generated summary:

```text
Finding
   ↓
Exact Evidence
   ↓
Why It Was Flagged
   ↓
Suggested Review Action
```

The reviewer can inspect the reasoning path and return to the source evidence.

---

# Why This Fits LexHack

ClauseGuard was built for **LexHack 2026**, a student hackathon focused on:

**AI × Law × Civic Technology**

The project directly intersects with the challenge's areas around:

* **Legal Automation & Workflow Innovation**
* **AI Safety, Ethics & Governance**
* **Access to Justice & Civic Technology**
* AI-assisted legal information workflows

The project demonstrates a practical approach to combining generative AI with deterministic verification in a legal-document workflow.

Rather than positioning AI as a replacement for legal professionals, ClauseGuard focuses on making an initial contract-review workflow more transparent and easier for a human to inspect.

---

# Real-World Use Case

Consider a long service agreement containing:

* an automatic renewal clause,
* a 30-day termination notice,
* payment requirements,
* an indemnification clause,
* and a security incident reporting deadline.

A reviewer could spend significant time locating and interpreting these provisions manually.

ClauseGuard turns the first-pass review into a structured workflow:

```text
Contract
   ↓
Potential Risks
   +
Obligations
   +
Deadlines
   ↓
Evidence Verification
   ↓
Traceable Review Report
```

The reviewer can then focus attention on the clauses that actually require examination.

---

# Getting Started

## Requirements

* Node.js 24+
* pnpm
* OpenAI API key

## Installation

```bash
pnpm install
```

## Environment

Create `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key
```

## Development

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Production build

```bash
pnpm build
```

## Production server

```bash
pnpm start
```

---

# Project Structure

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
│   └── types.ts
│
├── icon.svg
├── layout.tsx
├── page.tsx
└── globals.css
```

---

# Limitations

ClauseGuard is an informational contract-analysis prototype.

Current limitations include:

* It does not provide legal advice.
* It does not replace a lawyer or qualified legal professional.
* Evidence verification currently uses deterministic text matching.
* Scanned/image-only PDFs are not currently OCR processed.
* The configured risk categories are intentionally limited.
* AI interpretation can still be incomplete or incorrect.
* Contract interpretation can depend on jurisdiction and surrounding legal context that ClauseGuard does not independently determine.

For consequential legal decisions, users should consult a qualified legal professional.

---

# What's Next

The evidence-first architecture can be extended into a broader contract-review workflow.

Potential future improvements include:

* Visual highlighting of source clauses
* Stronger clause and section mapping
* More contract risk categories
* Exportable risk reports
* Contract comparison and version tracking
* More detailed obligation timelines
* Additional deterministic validation rules
* Better handling of complex document structures
* OCR support for scanned documents
* More jurisdiction-aware analysis

The goal is to expand capability **without losing the evidence-first principle**.

---

# Project Links

**Live Application**

https://clauseguard-labs.vercel.app/

**Source Code**

https://github.com/shahwali-dev/clauseguard

**Demo Video**

https://youtu.be/lUKRRT1O2_A

---

# Disclaimer

ClauseGuard provides informational contract analysis only.

It is not a law firm, lawyer, or substitute for professional legal advice.

Always consult a qualified legal professional for legal decisions.

---

# License

This project was created as a hackathon project.

License details may be added by the project authors.
