export const weeklyActivities = {
  sunday: "yoga",
  monday: "climb",
  tuesday: "run",
  wednesday: "yoga",
  thursday: "run",
  friday: "climb",
  saturday: "rest",
};

// options are "run", "climb", "yoga", "hike", "rest", and "other"

export function getTodaysActivity(): string {
  const today = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toLowerCase();

  return (
    weeklyActivities[
      today as keyof typeof weeklyActivities
    ] || "other"
  );
}