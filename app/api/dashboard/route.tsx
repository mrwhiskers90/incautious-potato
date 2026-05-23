import { ImageResponse } from "next/og";
import { getWeather } from "@/lib/weather";
import { getCalendarEvents } from "@/lib/calendar";
import { getTasks } from "@/lib/tasks";
import { WeatherDay, CalendarEvent } from "@/lib/types";
import { getTodaysActivity } from "@/lib/activities";

export const runtime = "nodejs";

const WIDTH = 800;
const HEIGHT = 600;

const FONT = "system-ui, sans-serif";

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatShortDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
  });
}

// Fix: use new Date() directly since event.start is a real ISO string
function formatEventDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "America/New_York",  // add this
});
}

function formatEventTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",  // add this
});
}

function formatSunTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",  // add this
});
}

function activityImage(activity: string, request: Request): string {
  const baseUrl = new URL(request.url).origin;
  switch (activity) {
    case "run":    return `${baseUrl}/icons/run.png`;
    case "climb":  return `${baseUrl}/icons/climb.png`;
    case "yoga":   return `${baseUrl}/icons/yoga.png`;
    case "rest":   return `${baseUrl}/icons/rest.png`;
    case "hike":   return `${baseUrl}/icons/hike.png`;
    default:       return `${baseUrl}/icons/other.png`;
  }
}

function weatherIcon(code: number, request: Request): string {
  const baseUrl = new URL(request.url).origin;
  if (code === 0)                                              return `${baseUrl}/weather/sun.png`;
  if ([1].includes(code))                                      return `${baseUrl}/weather/partly-cloudy.png`;
  if ([2, 3].includes(code))                                   return `${baseUrl}/weather/cloud.png`;
  if ([45, 48].includes(code))                                 return `${baseUrl}/weather/fog.png`;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))    return `${baseUrl}/weather/rain.png`;
  if ([71, 73, 75, 77, 85, 86].includes(code))                 return `${baseUrl}/weather/snow.png`;
  if ([95, 96, 99].includes(code))                             return `${baseUrl}/weather/storm.png`;
  return `${baseUrl}/weather/cloud.png`;
}

function Panel({
  title,
  children,
  style = {},
}: {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        ...style,
      }}
    >
      {title ? (
        <div
          style={{
            display: "flex",
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "10px",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export async function GET(request: Request) {
  try {
    const [weather, events, tasks] = await Promise.all([
      getWeather(),
      getCalendarEvents(),
      getTasks(),
    ]);

    const now = new Date();
    const activity = getTodaysActivity();

    return new ImageResponse(
      (
        <div
          style={{
            width: WIDTH,
            height: HEIGHT,
            backgroundColor: "white",
            color: "black",
            display: "flex",
            flexDirection: "column",
            padding: "8px",
            gap: "4px",
            fontFamily: FONT,
          }}
        >
          {/* WEATHER */}
          <div
            style={{
              height: "240px",
              display: "flex",
              padding: "10px",
            }}
          >
            <div style={{ display: "flex", flex: 1 }}>
              {weather.daily.map((day: WeatherDay) => (
                <div
                  key={day.date}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "6px 4px",
                  }}
                >
                  <div style={{ display: "flex", fontSize: "20px", fontWeight: 700 }}>
                    {formatShortDate(day.date)}
                  </div>

                  <img
                    src={weatherIcon(day.weathercode, request)}
                    width="96"
                    height="96"
                    alt="weather"
                    style={{ marginTop: "25px" }}
                  />

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", marginTop: "6px" }}>
                    <div style={{ display: "flex", fontSize: "22px", fontWeight: 700 }}>
                      {day.tempMax}°
                    </div>
                    <div style={{ display: "flex", fontSize: "17px" }}>
                      {day.tempMin}°
                    </div>
                    <div style={{ display: "flex", fontSize: "17px" }}>
                      Rain {day.precipitationChance}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOWER SECTION — fixed height so footer is never covered */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              height: "296px",
              overflow: "hidden",
            }}
          >
            {/* AGENDA */}
            <Panel title="" style={{ flex: "0 0 356px", overflow: "hidden", justifyContent: "center", marginLeft: "10px", paddingRight: "0px" }}>
              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {events.length === 0 ? (
                  <div style={{ display: "flex", fontSize: "15px", color: "#666" }}>
                    No upcoming events
                  </div>
                ) : (
                  events.map((event: CalendarEvent, i: number) => (
                    <div
                      key={event.start + event.title}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: "8px",
                        padding: "5px 0",
                        borderBottom: i < events.length - 1 ? "1px solid black" : "none",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", fontSize: "15px", whiteSpace: "nowrap", flexShrink: 0 }}>
                        <div style={{ display: "flex" }}>
                          {event.end
                            ? `${formatEventDate(event.start)} – ${formatEventDate(event.end)}`
                            : formatEventDate(event.start)}
                        </div>
                        {!event.allDay && (
                          <div style={{ display: "flex" }}>
                            {formatEventTime(event.start)}
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", fontSize: "17px" }}>
                        {event.title}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Panel>

            {/* ACTIVITY — tight fixed width, not flex:1 */}
            <div
              style={{
                width: "148px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                paddingLeft: "0px",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              <img
                src={activityImage(activity, request)}
                width="148"
                height="276"
                alt={activity}
              />
            </div>

            {/* TODO */}
            <Panel title="" style={{ flex: "0 0 228px", justifyContent: "center", marginRight: "10px", paddingLeft: "0px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "17px",
                }}
              >
                {tasks.length === 0 ? (
                  <img
                    src={`${new URL(request.url).origin}/tasks/no_tasks.png`}
                    width="226"
                    height="276"
                    alt="No tasks today"
                  />
                ) : (
                  tasks.map((task, i) => (
                    <div key={task} style={{ display: "flex", padding: "5px 0", borderBottom: i < tasks.length - 1 ? "1px solid black" : "none" }}>{task}</div>
                  ))
                )}
              </div>
            </Panel>
          </div>

          {/* FOOTER */}
          <div
            style={{
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 10px",
              fontSize: "13px",
            }}
          >
            <div style={{ display: "flex" }}>
              Sunrise {formatSunTime(weather.sunrise)}
              {" • "}
              Sunset {formatSunTime(weather.sunset)}
            </div>
            <div style={{ display: "flex" }}>
              Latest as of{" "}
              {now.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                timeZone: "America/New York",
              })}
              {" • "}
              {now.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                timeZone: "America/New York",
              })}
            </div>
          </div>
        </div>
      ),
      { width: WIDTH, height: HEIGHT }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    return new ImageResponse(
      (
        <div
          style={{
            width: WIDTH,
            height: HEIGHT,
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "24px",
            fontFamily: FONT,
            padding: "40px",
            textAlign: "center",
          }}
        >
          Dashboard Error: {message}
        </div>
      ),
      { width: WIDTH, height: HEIGHT }
    );
  }
}