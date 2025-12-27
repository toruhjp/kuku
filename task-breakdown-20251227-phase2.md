# Task Breakdown: 九九の練習ウェブサイト開発 – Phase 2 (GitHub Pages Deployment)

## Date Created
2025-12-27

## User Request (Unprocessed)

Source: `kuku/reference/kukuの練習ウェブサイト開発-phase2.md`

> According to a completion doc of `C:\Users\TORU HIRASAWA\Desktop\rooCode\kuku\reference\final-completion-report-phase1-ja.md`, the project members completed the 1st phase. Currently, the web page seems all right at localhost. Next, we are going to deploy the codes to a new repository and its GitHub Pages.

Account information:
- GitHub user: `toruhjp` (https://github.com/toruhjp)
- `gh` (GitHub CLI) is available on localhost
- No repository for the app has been initialized yet

Least ToDo (from the request):
1. Initialize a public repository named `kuku`
2. `git push` to `main`
3. Configure and publish the app via GitHub Pages

This Phase 2 focuses on turning the already-working local `kuku/` project into a public GitHub repository with automatic deployment to GitHub Pages using GitHub Actions.

---

## Questions Asked and Responses

### Q1: What should be the repository root contents?
**Question:** Should the GitHub repository `kuku` use the local `kuku/` directory as its root (so that `index.html` is at the repository root)?

**Answer:** Yes. Use the local `kuku/` directory as the repository root.

### Q2: How should GitHub Pages deployment be configured?
**Question:** Which Pages configuration is desired?
- A. Directly publish from `main` branch (no Actions)
- B. Use GitHub Actions to deploy on each push to `main`

**Answer:** Use **B. GitHub Actions** for automatic deployment from `main`.

### Q3: Level of automation using `gh` CLI
**Question:** May we actually execute `gh` commands (e.g., `gh repo create`, `gh api` for Pages config), or only document the steps?

**Answer:** We may and should actually execute the `gh` commands from localhost to complete setup, not only document them.

---

## Subdivided Tasks (Phase 2 – Deployment to GitHub Pages)

### Task 1: Confirm local project structure for publication

**Description:** Verify that the local `kuku/` directory is ready to be used as the root of the new GitHub repository.

**Key checks:**
- `kuku/index.html` exists and works when opened locally.
- Asset paths (`styles.css`, `app.js`, etc.) are relative (no leading `/`) so they work under `https://toruhjp.github.io/kuku/`.
- Auxiliary docs (Phase 1 reports, architecture docs, etc.) are located under `kuku/` as desired.

**Completion Criteria:**
- [ ] Opening `kuku/index.html` in a browser (via file:// or simple local server) still shows a fully working app.
- [ ] No path changes are required specifically for GitHub Pages (relative paths confirmed).
- [ ] A short note is added (e.g., in `kuku/README.md` or this file) confirming that `kuku/` is ready as repository root.

---

### Task 2: Initialize local Git repository under `kuku/`

**Description:** Initialize a new Git repository directly in the `kuku/` directory, targeting `main` as the default branch.

**Suggested steps (for implementer using CLI):**
- `cd` into the local `kuku/` directory.
- Run `git init -b main` (or `git init` + `git branch -M main`).
- Ensure `.gitignore` exists and is appropriate (e.g., ignore editor/OS/temp files; currently there is `kuku/.gitignore`).
- Stage all relevant files and make an initial commit.

**Completion Criteria:**
- [ ] `kuku/` is a Git repository with `main` as the current branch.
- [ ] `git status` reports a clean working tree after the initial commit.
- [ ] Initial commit message is meaningful (e.g., `Initial commit: 九九 practice site Phase 1`).

---

### Task 3: Create remote GitHub repository `toruhjp/kuku` and connect

**Description:** Create a new public repository on GitHub named `kuku` under the `toruhjp` account, and set it as the `origin` remote of the local repo.

**Suggested steps (for implementer using `gh` CLI):**
- Ensure `gh auth status` shows that `toruhjp` is authenticated.
- From within `kuku/`, run one of:
  - `gh repo create kuku --public --source=. --remote=origin --push`  
    (creates the repo, adds `origin`, and pushes `main` in one step),
  - or equivalently: `gh repo create toruhjp/kuku --public` followed by manual `git remote add origin ...` and push.

**Completion Criteria:**
- [ ] GitHub repository `https://github.com/toruhjp/kuku` exists and is public.
- [ ] Local `kuku/` repo has an `origin` remote pointing to `toruhjp/kuku`.
- [ ] `git remote -v` shows the correct URLs.

---

### Task 4: Push `main` branch to GitHub

**Description:** Ensure the current local `main` (containing the complete Phase 1 implementation) is pushed to the new GitHub repository.

**Suggested steps:**
- From `kuku/`, run `git push -u origin main` if not already pushed by `gh repo create`.
- Confirm on GitHub that files such as `index.html`, `styles.css`, `app.js`, and docs are present at the repository root.

**Completion Criteria:**
- [ ] `git push` succeeds with no errors.
- [ ] On GitHub web UI, `main` branch shows the expected files at the repo root.

---

### Task 5: Add GitHub Actions workflow for GitHub Pages deployment

**Description:** Configure an official GitHub Actions workflow that publishes the static site to GitHub Pages on each push to `main`.

**Workflow design:**
- Use the official `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages` actions.
- Deploy the repository root (i.e., `.`) as the site content.
- Trigger on:
  - `push` to `main`
  - optional `workflow_dispatch` (manual run)

**Expected file:**
- `.github/workflows/deploy-pages.yml` (or similar clear name) inside the `kuku/` repo.

**Example skeleton (for implementer to adapt):**

```yaml
name: Deploy 九九サイト to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload site artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Completion Criteria:**
- [ ] `.github/workflows/deploy-pages.yml` (or equivalent) is committed to `main` and pushed.
- [ ] Workflow uses the official GitHub Pages actions as above.
- [ ] The site root for deployment is correctly set to `.` (repo root) so that `index.html` is served.

---

### Task 6: Configure GitHub Pages for the repository

**Description:** Ensure GitHub Pages is enabled for `toruhjp/kuku` and is configured to use the GitHub Actions workflow as the source.

**Possible approaches:**
- **Via GitHub UI (manual):**
  - Navigate to `Settings` → `Pages` for `toruhjp/kuku`.
  - Under "Source" or "Build and deployment", select "GitHub Actions" (not branch-based deployment).
- **Via `gh` CLI / API (optional automation for implementer):**
  - Use `gh api` to configure Pages according to GitHub REST API docs for `repos/{owner}/{repo}/pages`.

**Completion Criteria:**
- [ ] GitHub Pages is enabled for `toruhjp/kuku`.
- [ ] The Pages configuration is set to use GitHub Actions (not the legacy branch-based mode).
- [ ] The first workflow run is either already triggered automatically by a push or is manually dispatched.

---

### Task 7: Verify successful deployment to `https://toruhjp.github.io/kuku/`

**Description:** Confirm that the 九九練習サイト is accessible via GitHub Pages and behaves the same as the local version.

**Verification points:**
- The site URL `https://toruhjp.github.io/kuku/` loads without errors.
- Main features work as in Phase 1 local tests:
  - 初項の複数選択
  - 3→2→1 カウントダウン
  - 九九の出題と均等分布
  - 正誤判定とメッセージ表示
  - 3秒後の自動「つぎへ」
  - すべて回答後の大きな〇と `X/Y done` 表示
- Layout, dark mode,スマホ横画面での見え方がローカルと同等であること。

**Completion Criteria:**
- [ ] GitHub Actions workflow run for deployment completes successfully (green).
- [ ] `https://toruhjp.github.io/kuku/` でアプリが正しく表示・動作する。
- [ ] 主要な動作（出題〜完了まで）の簡易チェック結果がドキュメントに残されている（例: Phase 2 レポート）。

---

### Task 8: Document Phase 2 deployment setup and usage

**Description:** Create documentation summarizing how deployment is set up and how to operate it in the future.

**Suggested documents:**
- `kuku/README.md` 更新または新規作成:
  - プロジェクト概要
  - ローカルでの動作方法
  - GitHub Pages の URL
  - デプロイフローの簡単な説明（`main` に push すると自動デプロイ）
- `kuku/final-completion-report-phase2-ja.md`（本フェーズの最終報告書）
  - Phase 2 の目的
  - 実施した手順（リポジトリ作成〜Pages公開まで）
  - 確認した動作と結果

**Completion Criteria:**
- [ ] README に GitHub Pages の URL とデプロイ手順が明記されている。
- [ ] 日本語の最終完了報告書（Phase 2）が作成されている。
- [ ] 今後の保守・更新時に、README と報告書を読めば手順が再現できる状態になっている。

---

## Implementation Plan (Execution Order for Phase 2)

Recommended execution order:

1. **Preparation & Local Git Setup**
   - Complete Task 1 (confirm `kuku/` structure).
   - Complete Task 2 (initialize Git repo with `main`).

2. **Create Remote and Push Code**
   - Complete Task 3 (create `toruhjp/kuku` and set remote).
   - Complete Task 4 (push `main` to GitHub).

3. **Configure GitHub Pages Deployment**
   - Complete Task 5 (add and commit GitHub Actions workflow).
   - Complete Task 6 (enable/configure GitHub Pages to use Actions).

4. **Verification & Documentation**
   - Complete Task 7 (end-to-end verification at `https://toruhjp.github.io/kuku/`).
   - Complete Task 8 (update README and create Phase 2 final report in Japanese).

---

## Output Locations

- GitHub repository: `https://github.com/toruhjp/kuku`
- GitHub Pages URL: `https://toruhjp.github.io/kuku/`

- Local repo root (this project): `kuku/`
  - Main app files: `index.html`, `styles.css`, `app.js`
  - Phase 1 documents: e.g., `final-completion-report-phase1-ja.md` (under `kuku/` or `kuku/reference/`)
  - Phase 2 planning: `kuku/task-breakdown-20251227-phase2.md` (this file)
  - Phase 2 final report (to be created): `kuku/final-completion-report-phase2-ja.md`

