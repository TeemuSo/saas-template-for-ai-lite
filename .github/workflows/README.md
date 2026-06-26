# CI / Claude pipeline

This template ships an AI-native CI pipeline built on the official
[`anthropics/claude-code-action@v1`](https://github.com/anthropics/claude-code-action).

## Workflows

| File | Trigger | What it does |
|------|---------|--------------|
| `ci.yml` | every PR + push to `main` | `pnpm install --frozen-lockfile` + `tsc --noEmit`. The owned pipeline that everything else hangs off. |
| `claude-code-review.yml` | every PR | **Two-pass review.** Pass 1 (Reviewer, Sonnet) finds only *critical* candidates and writes them to a file — posts nothing. Pass 2 (Verifier, Opus) independently re-checks each against the real code and comments **only** the findings it can confirm, discarding false positives. |
| `claude-auto-fix.yml` | `CI` workflow **fails** on a PR | Claude reads the failing logs, applies the minimal fix, and pushes it back to the PR branch. |
| `claude.yml` | `@claude` mention in an issue/PR/review | On-demand assistant. |

## Setup (one-time)

The workflows are inert until Anthropic credentials exist as a repo secret.
The recommended path is the official installer, which installs the Claude GitHub
App **and** adds the `ANTHROPIC_API_KEY` secret for you:

```bash
claude /install-github-app
```

Alternatively, set the secret manually:

```bash
gh secret set ANTHROPIC_API_KEY --repo <owner>/<repo>
```

> Prefer your Claude subscription over API credits? Use
> `CLAUDE_CODE_OAUTH_TOKEN` (from `claude setup-token`) and swap
> `anthropic_api_key:` for `claude_code_oauth_token:` in the workflows.

## Design notes

- **Why a verifier pass?** A single reviewer over-reports. An independent second
  agent that is told to *reject* anything it can't confirm is what keeps the
  signal high — the same shape as Anthropic's managed Code Review.
- **No fix loops.** `claude-auto-fix.yml` pushes with `GITHUB_TOKEN`; pushes made
  with that token don't trigger new workflow runs, so an auto-fix can't retrigger
  itself. A loop guard (skip commits authored by `claude[bot]`) is the backstop.
- **Forks are safe.** The review and auto-fix jobs only run for same-repo
  branches; fork PRs never receive secrets and are skipped explicitly.
- **Models** are pinned in each workflow's `claude_args` (`--model …`) so they're
  easy to bump as newer Claude models ship.
