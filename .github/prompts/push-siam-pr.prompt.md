---
name: "Push Siam PR"
description: "Push StorePilot changes to the siam branch and open a pull request to dev with a strong title and detailed description"
argument-hint: "Brief summary of the change set or PR goal"
agent: "agent"
model: "GPT-5 (copilot)"
---
Prepare and submit a StorePilot pull request for the current worktree.

Context:
- This prompt is StorePilot-specific.
- The source branch is `siam`.
- The target branch is `dev`.
- The user argument is the intended PR goal or change summary.

Workflow:
1. Inspect the current git status and changed files.
2. Identify the package or files that own the change and validate them with the narrowest relevant command before any git operation.
3. Preserve unrelated local changes. Stage only the files relevant to the requested work unless the user explicitly asks for all pending changes.
4. Write a clear commit message based on the actual changes.
5. Commit the staged changes without amending existing commits.
6. Push the commit to the `siam` branch using non-interactive git commands only.
7. Create a pull request from `siam` into `dev`.

PR requirements:
- Write a concise, specific PR title.
- Write a detailed PR body with these sections:
  - Summary
  - Changes
  - Validation
  - Risks or follow-ups
- Base the title and description on the actual diff and on the user-provided argument.

Failure handling:
- If validation fails, stop and report the failure clearly before any commit or push.
- If commit, push, or PR creation is blocked by authentication, missing remote access, or missing GitHub CLI support, do not guess. Report the exact blocker and provide a ready-to-use commit message, PR title, and PR description.

Output:
- Summarize what was validated.
- State exactly what was committed and pushed.
- Provide the PR URL when creation succeeds.
- If blocked, provide the exact blocker and the prepared git and PR text.