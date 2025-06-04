"use client";

import { useState } from "react";
import {
  SPORTS,
  getPointsForTrackedSport,
  getSportById,
  trackedSportsToGoogleSheetComment,
  type SportId,
  type TrackedSport,
  type TrackedSportWithId,
} from "./sports";
import { showNotification } from "./notifications/notifications";

export default function Home() {
  const [trackedSports, setTrackedSports] = useState<TrackedSportWithId[]>([]);

  const handleAddTrackedSport = (trackedSport: TrackedSport) => {
    setTrackedSports((prev) => [
      ...prev,
      { ...trackedSport, id: crypto.randomUUID() },
    ]);
  };

  const handleDeleteTrackedSport = (trackedSport: TrackedSportWithId) => {
    setTrackedSports((prev) => prev.filter((t) => t.id !== trackedSport.id));
  };

  const handleReset = () => {
    setTrackedSports([]);
  };

  const handleCopyToGoogleSheet = () => {
    const comment = trackedSportsToGoogleSheetComment(trackedSports);
    navigator.clipboard.writeText(comment);
    showNotification({
      title: "Starke Leistung 🙌",
      message: "Der Kommentar wurde in die Zwischenablage kopiert",
    });
  };

  return (
    <div className="grid justify-items-center font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-screen-lg w-full grid gap-10 p-20">
        <div className="flex items-center gap-2 justify-between">
          <h1 className="text-4xl font-bold">🏃‍♀️ FG Fitness Tracker</h1>
        </div>
        <div className="grid gap-2 w-full">
          <div className="grid grid-cols-12 gap-4 font-bold">
            <div className="col-span-4">Sportart</div>
            <div className="col-span-4">Anzahl</div>
            <div className="col-span-3">Punkte</div>
            <div className="col-span-1"></div>
          </div>
          {trackedSports.map((trackedSport, index) => (
            <TrackedSport
              key={index}
              trackedSport={trackedSport}
              onDelete={() => handleDeleteTrackedSport(trackedSport)}
            />
          ))}
          <TrackedSportForm onSave={handleAddTrackedSport} />
        </div>
        <div className="grid gap-2 w-full border-t border-gray-300 pt-4">
          <div className="grid grid-cols-12 gap-4 font-bold">
            <div className="col-span-4">Summe</div>
            <div className="col-span-4"></div>
            <div className="col-span-3">
              {trackedSports.reduce(
                (acc, trackedSport) =>
                  acc + getPointsForTrackedSport(trackedSport),
                0
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <button
            className="border border-gray-300 rounded-md p-2 px-4 hover:bg-gray-100 cursor-pointer"
            onClick={handleReset}
          >
            Zurücksetzen
          </button>
          <button
            className="bg-teal-500 text-white p-2 px-4 rounded-md font-bold hover:bg-teal-600 cursor-pointer disabled:opacity-50 disabled:bg-teal-500 disabled:cursor-default"
            onClick={handleCopyToGoogleSheet}
            disabled={trackedSports.length === 0}
          >
            Google Sheet Kommentar kopieren
          </button>
        </div>
      </main>
    </div>
  );
}

function TrackedSportForm({
  onSave,
}: {
  onSave: (trackedSport: TrackedSport) => void;
}) {
  const [sportId, setSportId] = useState<SportId | "">("");
  const [units, setUnits] = useState<number>(0);

  const sport = sportId !== "" ? getSportById(sportId) : null;

  function handleSave() {
    if (sportId === "" || units < 1) {
      return;
    }

    onSave({ sportId, units });
    setSportId("");
    setUnits(0);
  }

  return (
    <div className="grid grid-cols-24 gap-4 items-center">
      <select
        value={sportId}
        onChange={(e) => setSportId(e.target.value as SportId | "")}
        className="border border-gray-300 rounded-md p-2 col-span-8"
      >
        <option value="">Sport auswählen</option>
        {SPORTS.map((sport) => (
          <option key={sport.id} value={sport.id}>
            {sport.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Anzahl"
        value={units}
        onChange={(e) => setUnits(Number(e.target.value))}
        className="border border-gray-300 rounded-md p-2 col-span-3"
      />
      <div className="col-span-5">{sport && sport.unit}</div>
      <div className="col-span-4">
        {sportId !== "" ? getPointsForTrackedSport({ sportId, units }) : 0}
      </div>
      <button
        className="col-span-4 bg-teal-500 text-white p-2 rounded-md font-bold hover:bg-teal-600 cursor-pointer"
        onClick={handleSave}
      >
        Speichern
      </button>
    </div>
  );
}

function TrackedSport({
  trackedSport,
  onDelete,
}: {
  trackedSport: TrackedSport;
  onDelete: () => void;
}) {
  const sport = getSportById(trackedSport.sportId);

  if (!sport) {
    return null;
  }

  const points = getPointsForTrackedSport(trackedSport);
  return (
    <div className="grid grid-cols-12 gap-4 w-full items-center">
      <div className="col-span-4">{sport?.name}</div>
      <div className="col-span-4">
        {trackedSport.units} {sport.unit}
      </div>
      <div className="col-span-2">{points}</div>
      <button
        className="col-span-2 border border-gray-300 rounded-md p-1 hover:bg-gray-100 cursor-pointer"
        onClick={onDelete}
      >
        Löschen
      </button>
    </div>
  );
}
