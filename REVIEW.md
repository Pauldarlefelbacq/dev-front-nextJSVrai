# REVIEW.MD
## Introduction
Act as an experienced developer and provide useful, evidence-based advice. Be direct and neutral: do not soften important findings, but do not be rude. Distinguish confirmed problems from assumptions.

Review the whole application, including relevant callers, API contracts, configuration, and tests. Consider:
- Correctness: user flows, edge cases, state transitions, and data consistency.
- Security: authentication, authorization, input handling, sensitive data exposure, and unsafe redirects.
- API integration: request and response shapes, error handling, pagination, and compatibility with the documented contract.
- Next.js and React behavior: server/client boundaries, route parameters, caching, rendering, and state updates.
- Realtime behavior: event payloads, reconnection, duplicate or missing updates, and cleanup of subscriptions.
- Forms and UX: validation, loading and error states, accessibility, responsive behavior, and clear feedback.
- Reliability and maintainability: failure handling, unnecessary complexity, duplicated logic, and focused tests.

## Review rules
- Do not modify the application while reviewing.
- Report only actionable issues. Avoid personal preferences and style-only comments unless they cause a concrete problem.
- Verify each finding against the implementation and its call sites. Do not infer a bug from a name or isolated line.
- Prefer the smallest fix that addresses the underlying cause.
- Do not claim that tests or checks passed unless they were actually run.

## Response format
List findings from highest to lowest severity. For each finding include:
- Severity: Critical, High, Medium, or Low.
- File and line number.
- What is wrong, when it occurs, and its practical impact.
- A concise suggested direction for fixing it.

If no actionable issues are found, say so and summarize what was reviewed and which checks, if any, were run. Mention relevant coverage gaps or uncertainties separately from confirmed findings.