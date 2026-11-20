# R2WX GitHub Pages publication

This package contains a static documentation website extracted from the supplied 79-page PDF. It is **not** a deployment of the R2WX application.

## Deploy

1. Copy `docs/`, `mkdocs.yml`, `requirements-pages.txt`, and `.github/workflows/pages.yml` into the **root** of the existing R2WX repository (merge folders, do not replace existing content).
2. If the repository uses a default branch other than `main`, update the workflow branch filter.
3. In GitHub repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
4. Commit and push. Check the **Actions** tab for the `Publish R2WX examination` workflow.
5. Add your verified GitHub repo URL to `mkdocs.yml` as `repo_url`, and your Pages URL as `site_url` once known.

## Content fidelity

The PDF remains included **unchanged** and is the canonical reference. Chapter text, code, and diagrams were extracted from its page layout. The extraction preserves the full chapter sequence and content but PDF line geometry may produce imperfect whitespace in a few diagrams and code exhibits. Visually review those exhibits against the original PDF before considering the site final. The generated logo is a **placeholder**; replace it with the actual R2WX logo before publishing.

## Local preview

```bash
python -m pip install -r requirements-pages.txt
mkdocs serve
```
