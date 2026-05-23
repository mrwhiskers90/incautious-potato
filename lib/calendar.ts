import ical from "node-ical";
import { CalendarEvent } from "./types";

const CALENDAR_URL =
  "https://calendar.google.com/calendar/ical/t63b2r91iu6qaad3p6dndusmto%40group.calendar.google.com/private-5fd1fcea1190ef5fc5666e6b702d4ea7/basic.ics";

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const res = await fetch(CALENDAR_URL, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    const data = ical.sync.parseICS(text);
    const now = new Date();
    const cutoff = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days

    const events: CalendarEvent[] = [];

    for (const event of Object.values(data) as any[]) {
      if (event.type !== "VEVENT" || !event.summary || !event.start) continue;

      const allDay = event.start?.dateOnly === true;

      if (event.rrule) {
        const dates: Date[] = event.rrule.between(now, cutoff, true);

        for (const date of dates) {
          const dk = dateKey(date);
          const ik = date.toISOString();

          // Skip excluded occurrences (EXDATE)
          if (event.exdate?.[dk] || event.exdate?.[ik]) continue;

          // Use modified title/end if this occurrence was overridden (RECURRENCE-ID)
          const override = event.recurrences?.[dk] ?? event.recurrences?.[ik];
          const title: string = override?.summary ?? event.summary;
          const rawEnd = override?.end ?? event.end;
          const end = rawEnd ? new Date(rawEnd) : undefined;
          const isMultiDay = end && end.getTime() - date.getTime() > 86400000;

          events.push({ title, start: date.toISOString(), end: isMultiDay ? end.toISOString() : undefined, allDay });
        }
      } else {
        const start = new Date(event.start);
        if (start >= now) {
          const end = event.end ? new Date(event.end) : undefined;
          const isMultiDay = end && end.getTime() - start.getTime() > 86400000;
          events.push({ title: event.summary, start: start.toISOString(), end: isMultiDay ? end.toISOString() : undefined, allDay });
        }
      }
    }

    return events
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 6);
  } catch (err) {
    console.error("Calendar fetch failed:", err);
    return [];
  }
}
