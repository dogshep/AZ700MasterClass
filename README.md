# AZ-700 Masterclass

A production-quality, self-contained Azure AZ-700 study website built with MkDocs Material, Markdown, vanilla JavaScript, Mermaid, and GitHub Pages.

## Features

- Modern responsive design with dark mode
- Search, breadcrumbs, table of contents, and navigation
- Interactive flashcards, quiz engine, exam timer, and bookmarking
- Detailed lesson content for all AZ-700 domains
- Hands-on labs, practice tests, and printable exam cram notes

## Local development

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

## Deployment

The repository includes a GitHub Actions workflow that builds the site and deploys it to GitHub Pages on pushes to the main branch.

## License

MIT License
