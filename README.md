# incautious-potato

An e-ink dashboard for old Kindle displays, served as a PNG image via a Next.js API route deployed on Vercel.

Shows weather, upcoming calendar events, today's activity, and a live to-do list.

## Stack

- **Next.js** — API route renders the dashboard as a PNG via `next/og`
- **Vercel** — hosts and serves the app
- **Open-Meteo** — free weather API (no key required)
- **Google Calendar** — via public ICS URL
- **Todoist** — to-do list via REST API

## Environment variables

Set these in Vercel's project settings under **Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `TODOIST_API_TOKEN` | Your Todoist API token — found at todoist.com → Settings → Integrations → Developer |
| `TODOIST_PROJECT_ID` | *(optional)* Limit tasks to a specific project. Omit to show all tasks due today. |

## Local development

```bash
npm install
# create .env.local with your TODOIST_API_TOKEN
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The dashboard image is served at `/api/dashboard`.

## Kindle setup

Point the Kindle browser at `https://your-vercel-url.vercel.app/api/dashboard` and refresh on whatever interval you like.

## Customising the activity schedule

Edit `lib/activities.ts`. Available options: `run`, `climb`, `yoga`, `hike`, `rest`, `other`.
