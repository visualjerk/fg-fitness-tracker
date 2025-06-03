type Sport = {
  id: string;
  name: string;
  unit: string;
  unitsPerPoint: number;
};

export const SPORTS = [
  {
    id: "steps",
    name: "Schritte (Gehen)",
    unit: "Schritte",
    unitsPerPoint: 1000,
  },
  {
    id: "jogging",
    name: "Joggen",
    unit: "KM",
    unitsPerPoint: 0.5,
  },
  {
    id: "cycling",
    name: "Radfahren (kein E-Bike)",
    unit: "KM",
    unitsPerPoint: 4,
  },
  {
    id: "swimming",
    name: "Schwimmen",
    unit: "Meter",
    unitsPerPoint: 100,
  },
  {
    id: "pushups",
    name: "Push Ups",
    unit: "Wiederholungen",
    unitsPerPoint: 40,
  },
  {
    id: "rope-jumping",
    name: "Seilspringen",
    unit: "Wiederholungen",
    unitsPerPoint: 400,
  },
  {
    id: "meditation",
    name: "Meditieren",
    unit: "Minuten",
    unitsPerPoint: 15,
  },
  {
    id: "yoga",
    name: "Yoga/Pilates",
    unit: "Minuten",
    unitsPerPoint: 15,
  },
  {
    id: "gym",
    name: "Krafttraining / Vereinsbesuch",
    unit: "Minuten",
    unitsPerPoint: 15,
  },
  {
    id: "situps",
    name: "Sit Ups",
    unit: "Wiederholungen",
    unitsPerPoint: 100,
  },
  {
    id: "pullups",
    name: "Klimmzüge (komplett)",
    unit: "Wiederholungen",
    unitsPerPoint: 15,
  },
  {
    id: "stretching",
    name: "Stretching / BlackRoll",
    unit: "Minuten",
    unitsPerPoint: 20,
  },
  {
    id: "planks",
    name: "Planks",
    unit: "Minuten",
    unitsPerPoint: 5,
  },
] as const satisfies Sport[];

export type SportId = (typeof SPORTS)[number]["id"];

export const getSportById = (sportId: SportId) => {
  return SPORTS.find((sport) => sport.id === sportId);
};

export type TrackedSport = {
  sportId: SportId;
  units: number;
};

export type TrackedSportWithId = TrackedSport & {
  id: string;
};

export function getPointsForTrackedSport(trackedSport: TrackedSport) {
  const sport = getSportById(trackedSport.sportId);
  if (!sport) return 0;
  return Math.floor(trackedSport.units / sport.unitsPerPoint);
}

export function trackedSportsToGoogleSheetComment(
  trackedSports: TrackedSport[]
) {
  const trackedSportsLines = trackedSports
    .map((trackedSport) => {
      const sport = getSportById(trackedSport.sportId);
      if (!sport) return "";
      return `${getPointsForTrackedSport(trackedSport)} P.: ${
        trackedSport.units
      } ${sport.unit} ${sport.name}`;
    })
    .join("\n");

  return `${trackedSportsLines}\n--------------------------------\n${trackedSports.reduce(
    (acc, trackedSport) => acc + getPointsForTrackedSport(trackedSport),
    0
  )} Punkte Gesamt`;
}
