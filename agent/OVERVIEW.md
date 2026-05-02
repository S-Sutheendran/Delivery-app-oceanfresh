# Agent Folder Overview

**Everything Claude Code (ECC) v1.10.0** — a production-grade AI agent harness with 183 skills, 48 specialized subagents, and 79 slash commands.

---

## What the Agent Can Do

### Core Development Activities

| Category | Activities |
|---|---|
| **TDD** | Write failing tests first, implement to pass, refactor to 80%+ coverage |
| **Code Review** | Security, quality, patterns, type safety — can auto-post to GitHub PRs |
| **Build Fixing** | Diagnose and resolve build errors, type errors, compilation failures |
| **Refactoring** | Dead code cleanup, performance optimization, pattern compliance |
| **Architecture** | System design, scalability analysis, tech trade-offs |

### Language-Specific Workflows

Dedicated agents and rules for: **TypeScript/JS, Python, Go, Java, Kotlin, Rust, C++, PHP, Perl, Swift**

Each includes: build toolchain support, idiomatic patterns, framework-specific skills (Next.js, Django, Spring Boot, FastAPI, etc.)

### Testing

- E2E test generation via **Playwright**
- Unit/integration test writing
- Flake detection and retry strategies
- Coverage analysis and enforcement

### Business / Content

- Article writing, brand voice consistency
- Market research, investor materials
- HTML/PPTX presentation builder
- Content syndication (cross-posting)

### DevOps

- Docker, Kubernetes patterns
- CI/CD pipeline design
- Environment configuration
- Monitoring/alerting setup

---

## Key Components

### `agents/` — 48 Specialized Subagents
Delegatable agents like `architect`, `code-reviewer`, `security-reviewer`, `tdd-guide`, `e2e-runner`, `build-error-resolver`, `database-reviewer`, and 12+ language-specific reviewers.

### `skills/` — 183 Skills (Domain Knowledge)
Deep reference workflows for: `api-design`, `e2e-testing`, `deep-research`, `backend-patterns`, `frontend-patterns`, `claude-api`, `exa-search`, `coding-standards`, and 170+ more.

### `hooks/` — 8+ Automated Behaviors
Auto-triggered on tool use:
- Pre-Bash quality/push guards
- Doc file warnings
- Compaction suggestions at logical intervals
- Governance/secrets capture
- Config protection (prevents weakening linters)
- MCP health checks

### `rules/` — Always-Follow Guidelines
Universal rules (`common/`) + language-specific overrides for coding style, git workflow, security, performance, and testing patterns.

### `commands/` — 79 Slash Commands (Legacy Shims)
User-invocable commands that delegate to agents or skills:
`/tdd`, `/plan`, `/code-review`, `/e2e`, `/build-fix`, `/learn`, `/skill-create`, and 70+ more.

---

## MCP Integrations

| Server | Purpose |
|---|---|
| GitHub | PR/issue management |
| Context7 | RAG-based docs lookup |
| Exa Search | Web research |
| Memory | Cross-session persistence |
| Playwright | Browser automation |
| Sequential Thinking | Extended reasoning |

---

## Example Workflows

**Code Review:**
Gather changed files → Review security/quality → Run lint/tests → Decide approve/block → Post report to GitHub

**TDD:**
Plan → Write RED test → Write GREEN implementation → Refactor → Review → Commit with conventional format

**Multi-Agent Orchestration:**
Run multiple agents in parallel → Chain complex workflows → Manage autonomous loops → Monitor stalled processes → Checkpoint and resume

---

## Summary Statistics

| Component | Count |
|---|---|
| Agents | 48 |
| Skills | 183 |
| Commands (legacy) | 79 |
| Supported Languages | 12+ |
| MCP Integrations | 6 |
| Hook Automations | 8+ |
| Test Coverage | ~97% |
| Cross-IDE Support | 5+ |

**Version:** 1.10.0 | **License:** MIT | **Package:** `ecc-universal` on NPM
