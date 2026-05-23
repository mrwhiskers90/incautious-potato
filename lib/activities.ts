export const weeklyActivities = {
  sunday: "rest",
  monday: "run",
  tuesday: "climb",
  wednesday: "yoga",
  thursday: "run",
  friday: "climb",
  saturday: "hike",
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