export async function getTasks(): Promise<string[]> {
  const token = process.env.TODOIST_API_TOKEN;
  if (!token) {
    console.warn("TODOIST_API_TOKEN not set");
    return [];
  }

  const url = new URL("https://api.todoist.com/api/v1/tasks");
  if (process.env.TODOIST_PROJECT_ID) {
    url.searchParams.set("project_id", process.env.TODOIST_PROJECT_ID);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Todoist API ${res.status}`);

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

  const data: { results: { content: string; due: { date: string } | null }[] } = await res.json();
  return data.results
    .filter((t) => t.due?.date.startsWith(today))
    .slice(0, 10)
    .map((t) => t.content);
}
