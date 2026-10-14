# Signal Job Radar

Signal is a small experiment in turning an ambiguous job search into a calmer, more actionable product. It combines a public role radar with a native macOS widget that keeps the strongest signals visible throughout the day.

Live dashboard: [signal-job-radar.sage-dog-3724.chatgpt.site](https://signal-job-radar.sage-dog-3724.chatgpt.site)

## The story

The starting point was a practical question: how do you reach for bigger roles without treating every opening as equally plausible? Signal organizes the search into three useful signals:

- Strong signals: credible near-term matches.
- Worth a reach: adjacent roles with meaningful upside.
- Stretch signals: roles that ask for materially larger scope.

The dashboard makes the search legible. The macOS widget makes it ambient. Every role links directly to the employer or ATS listing, so the final action is always one click away.

## Architecture

```text
Dreamwork search
      │
      ▼
Daily Site automation ──► Signal Worker ──► R2 roles feed
                                  │              │
                                  ▼              ▼
                             Web dashboard    macOS widget
```

The hosted Worker serves the dashboard, the public `roles.json` feed, and a small authenticated MCP server:

- `get_roles` reads the current feed.
- `update_roles` validates and replaces the feed.

The personal daily automation uses a connected Dreamwork MCP to search for Seattle hybrid and U.S. remote full-time roles, then writes the result through `update_roles`. The automation and its account connection are intentionally not included in this repository; a new user can use the Site and widget with the public feed, or connect their own search workflow.

## Repository layout

```text
site/                  Dashboard source and fallback feed
worker/                Hosted Worker and MCP endpoint
scripts/               Worker build and validation scripts
dist/                  Packaged deployment artifact
macos/SignalWidget/    Native macOS app and WidgetKit extension
```

## Dashboard / Worker

The deployment artifact is built from the dashboard source:

```bash
bash scripts/build.sh
node scripts/validate-artifact.mjs
```

The build injects the fallback feed into the Worker bundle. In production, the Worker reads the latest feed from R2 and keeps the dashboard and widget on the same data source.

## macOS widget

Open `macos/SignalWidget/SignalWidget.xcodeproj` in Xcode and build the `SignalWidget` scheme. The widget supports small and medium sizes, refreshes the public feed every 30 minutes, and opens role rows directly in the browser. The compact widget opens the full app for search and filtering.

The app targets macOS 14 or later and uses only Apple frameworks.

## Feed contract

Each role contains:

```json
{
  "id": "example-role",
  "company": "Example Co",
  "title": "Senior Product Designer",
  "city": "Seattle, WA",
  "mode": "Hybrid",
  "category": "design",
  "level": "Senior",
  "fit": "strong",
  "fitLabel": "Strong fit",
  "salary": "Not listed",
  "posted": "Today",
  "why": "A concise fit rationale",
  "url": "https://example.com/jobs/example-role"
}
```

The Worker requires HTTPS direct employer or ATS URLs and rejects Dreamwork listing URLs before they can be stored.

## Status

This is a working personal tool and an intentionally small public example. It is not a generalized job board or a guarantee that a role is still open. Check the source listing before applying.
